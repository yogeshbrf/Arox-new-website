const { getDb } = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Registration = require('../models/Registration');
const { generateStudentId, generateRegistrationId, generatePassword, calculateGST } = require('../utils/helpers');
const paymentService = require('../services/paymentService');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Safe require for Internship (may not exist in all deployments)
let Internship;
try {
  Internship = require('../models/Internship');
} catch (e) {
  Internship = null;
}

const registrationController = {
  /**
   * POST /api/registrations
   * Complete registration flow (all steps combined)
   */
  async create(req, res) {
    const db = getDb();
    
    try {
      const {
        // Step 1: Personal
        first_name, last_name, email, phone, gender, dob, address, city, state, pincode,
        // Step 2: College
        college, university, degree, department, year_of_study, graduation_year, roll_number,
        // Step 3: Course
        course_id, internship_id,
        // Step 4: Payment
        payment_plan, payment_method, coupon_code
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !phone || !course_id) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: first_name, last_name, email, phone, and course_id are required.'
        });
      }

      // Check if email already registered
      const existingUser = User.findByEmail(email);
      const existingStudent = Student.findByEmail(email);
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: 'A student with this email already exists.'
        });
      }
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'A user account with this email already exists. Please log in.'
        });
      }

      // Get course details
      const course = Course.findById(course_id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Calculate pricing
      const basePrice = course.discounted_price || course.price || 0;
      let discount = 0;
      let appliedCoupon = null;

      if (coupon_code) {
        const couponResult = paymentService.verifyCoupon(db, coupon_code, basePrice);
        if (couponResult.valid) {
          discount = couponResult.coupon.discount;
          appliedCoupon = couponResult.coupon;
        }
      }

      // Check for referral code if provided (supports referrals table + unique employee referral codes)
      const rawRefCode = (req.body.referral_code || req.body.referral || '').trim().toUpperCase();
      let validatedReferralCode = null;
      let referredByEmployeeId = null;
      let referralDiscount = 0;

      if (rawRefCode) {
        const refRecord = db.prepare('SELECT * FROM referrals WHERE UPPER(code) = ? AND is_active = 1').get(rawRefCode);
        const empRefUser = db.prepare('SELECT id, referral_code FROM users WHERE UPPER(referral_code) = ? AND deleted_at IS NULL').get(rawRefCode);
        if (!refRecord && !empRefUser) {
          return res.status(400).json({
            success: false,
            message: `Invalid referral code "${rawRefCode}". Please check code or leave blank.`
          });
        }
        if (refRecord && refRecord.max_uses > 0 && refRecord.times_used >= refRecord.max_uses) {
          return res.status(400).json({
            success: false,
            message: `Referral code "${rawRefCode}" has reached its maximum usage limit.`
          });
        }
        validatedReferralCode = (refRecord ? refRecord.code : empRefUser.referral_code).toUpperCase();
        referredByEmployeeId = (refRecord && refRecord.employee_id) || (empRefUser && empRefUser.id) || null;
        referralDiscount = refRecord ? Math.round(basePrice * ((refRecord.discount_percent || 0) / 100)) : 0;
      }

      if (referralDiscount > discount) {
        discount = referralDiscount;
      }

      const priceAfterDiscount = basePrice - discount;
      const gstInfo = calculateGST(priceAfterDiscount);
      const totalAmount = priceAfterDiscount;
      
      // Calculate payment amounts based on plan
      let paidAmount = totalAmount;
      let balanceAmount = 0;

      if (payment_plan === 'advance') {
        paidAmount = Math.round(totalAmount * 0.5); // 50% advance
        balanceAmount = totalAmount - paidAmount;
      }

      // Generate IDs
      const studentId = generateStudentId();
      const registrationId = generateRegistrationId();
      const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
      const rawPassword = emailPrefix; // Default password is text before '@' of email (e.g. yogeshbrf2006)

      // Start transaction
      const transaction = db.transaction(() => {
        // 1. Create user account
        const userResult = db.prepare(`
          INSERT INTO users (email, password_hash, role_id, status, first_name, last_name, phone, email_verified)
          VALUES (?, ?, 3, 'active', ?, ?, ?, 0)
        `).run(email, require('bcryptjs').hashSync(rawPassword, 12), first_name, last_name, phone);

        const userId = userResult.lastInsertRowid;

        // 2. Create student profile
        const photoPath = req.file ? `/uploads/photos/${req.file.filename}` : null;
        
        const studentResult = db.prepare(`
          INSERT INTO students (
            user_id, student_id, photo, first_name, last_name, email, phone,
            gender, dob, address, city, state, pincode,
            college, university, degree, department, year_of_study, graduation_year, roll_number,
            referred_by, referral_code
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          userId, studentId, photoPath, first_name, last_name, email, phone,
          gender, dob, address, city || '', state || '', pincode || '',
          college, university, degree, department, year_of_study, graduation_year, roll_number || '',
          referredByEmployeeId, validatedReferralCode || null
        );

        const studentDbId = studentResult.lastInsertRowid;

        // 3. Create registration
        const regResult = db.prepare(`
          INSERT INTO registrations (
            registration_id, student_id, course_id, internship_id,
            batch_name, start_date, end_date, mode,
            status, payment_plan, total_amount, paid_amount, balance_amount,
            coupon_code, referral_code, discount_amount, gst_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          registrationId, studentDbId, course_id, internship_id || null,
          course.batch_name, course.start_date, course.end_date, course.mode || 'online',
          'confirmed', payment_plan || 'full', totalAmount, paidAmount, balanceAmount,
          coupon_code || null, validatedReferralCode || null, discount, gstInfo.gstAmount
        );

        const regDbId = regResult.lastInsertRowid;

        // 4. Increment enrollment counters
        Course.incrementEnrollment(course_id);
        if (internship_id && Internship) {
          try {
            Internship.incrementEnrollment(internship_id);
          } catch (e) {
            logger.warn('Could not increment internship enrollment:', e.message);
          }
        }

        // 5. Use coupon or referral if applied
        if (appliedCoupon) {
          paymentService.useCoupon(db, coupon_code);
        }
        if (validatedReferralCode) {
          db.prepare('UPDATE referrals SET times_used = times_used + 1, updated_at = CURRENT_TIMESTAMP WHERE UPPER(code) = ?').run(validatedReferralCode);
        }

        // 6. Log activity
        try {
          db.prepare(`
            INSERT INTO activity_logs (user_id, action, module, entity_type, entity_id, description)
            VALUES (?, 'registration', 'registrations', 'registration', ?, ?)
          `).run(userId, regDbId, `New registration: ${first_name} ${last_name} for ${course.title}`);
        } catch (e) {
          logger.warn('Activity log write failed:', e.message);
        }

        return {
          userId,
          studentDbId,
          regDbId,
          studentId,
          registrationId
        };
      });

      const result = transaction();

      // Generate offer letter (async, don't block response)
      pdfService.generateOfferLetter(
        { student_id: studentId, first_name, last_name },
        { registration_id: registrationId, batch_name: course.batch_name, start_date: course.start_date, end_date: course.end_date, mode: course.mode || 'online' },
        course
      ).then(pdf => {
        db.prepare('UPDATE registrations SET offer_letter_generated = 1, offer_letter_path = ? WHERE id = ?')
          .run(pdf.relativePath, result.regDbId);
      }).catch(err => logger.error('Offer letter generation failed:', err));

      // Send welcome email (async)
      emailService.sendWelcomeEmail(
        { first_name, last_name, email, student_id: studentId },
        { email, password: rawPassword }
      ).catch(err => logger.error('Welcome email failed:', err));

      if (validatedReferralCode) {
        const syncService = require('../services/syncService');
        syncService.broadcast('referral:used', {
          code: validatedReferralCode,
          studentName: `${first_name} ${last_name}`,
          message: `Referral code ${validatedReferralCode} used by ${first_name} ${last_name}.`
        });
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful! 🎉',
        data: {
          studentId,
          registrationId,
          courseName: course.title,
          batchName: course.batch_name,
          startDate: course.start_date,
          endDate: course.end_date,
          mode: course.mode || 'online',
          trainerName: course.trainer_name,
          totalAmount: totalAmount,
          paidAmount,
          balanceAmount,
          discount,
          gst: gstInfo.gstAmount,
          paymentPlan: payment_plan || 'full',
          credentials: {
            email,
            password: rawPassword
          },
          offerLetterUrl: `/api/registrations/${registrationId}/offer-letter`
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
  },

  /**
   * GET /api/registrations/:regId/offer-letter
   */

  /**
   * POST /api/registrations/apply
   * Public application submission
   */
  async apply(req, res) {
    const db = getDb();
    
    try {
      const {
        // Step 1: Personal
        first_name, last_name, email, phone, gender,
        // Step 2: College
        college, university, degree, department, year_of_study, graduation_year,
        // Step 3: Course
        course, course_start_date, course_duration, requirements,
        // Step 4: Payment
        payment_plan
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: first_name, last_name, email, and phone are required.'
        });
      }

      // Find or get course
      let courseRecord = null;
      if (req.body.course_id) {
        courseRecord = Course.findById(req.body.course_id);
      }

      const rawCourse = (course || req.body.course_name || req.body.track || req.body.program || '').trim();

      if (!courseRecord && rawCourse) {
        const cleanName = rawCourse.replace(/\s+(Internship|Training|Program)$/i, '').trim();
        const slug = require('../utils/helpers').slugify(cleanName || rawCourse);

        // 1. Exact case-insensitive match
        courseRecord = db.prepare('SELECT * FROM courses WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))').get(rawCourse);

        // 2. Cleaned name match (e.g. without trailing "Internship")
        if (!courseRecord && cleanName) {
          courseRecord = db.prepare('SELECT * FROM courses WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))').get(cleanName);
        }

        // 3. Slug match
        if (!courseRecord && slug) {
          courseRecord = db.prepare('SELECT * FROM courses WHERE slug = ?').get(slug);
        }

        // 4. Partial LIKE match
        if (!courseRecord && cleanName) {
          courseRecord = db.prepare('SELECT * FROM courses WHERE LOWER(title) LIKE LOWER(?)').get(`%${cleanName}%`);
        }

        // 5. If STILL not found, auto-create this exact course record dynamically!
        if (!courseRecord) {
          const { slugify } = require('../utils/helpers');
          const finalTitle = cleanName || rawCourse;
          const finalSlug = slugify(finalTitle);
          const coursePrice = 8999;
          const isInternship = /internship/i.test(rawCourse);
          const result = db.prepare(`
            INSERT INTO courses (slug, title, duration, price, discounted_price, category, is_active, batch_name, start_date) 
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
          `).run(
            finalSlug,
            finalTitle,
            course_duration || '3 Months',
            coursePrice,
            coursePrice,
            isInternship ? 'internship' : 'training',
            `Batch ${finalTitle.substring(0, 16)} 2026`,
            course_start_date || new Date().toISOString().split('T')[0]
          );
          courseRecord = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
          logger.info(`✨ Dynamically registered exact course: "${finalTitle}" (ID: ${courseRecord.id})`);
        }
      }

      // 6. Only if NO course at all was passed in the request, fallback to first active course
      if (!courseRecord) {
        courseRecord = db.prepare('SELECT * FROM courses WHERE is_active = 1 ORDER BY id ASC LIMIT 1').get();
      }

      // Check existing user or student account (email match OR authenticated session user)
      let existingUser = db.prepare('SELECT id, email, status FROM users WHERE LOWER(email) = LOWER(?)').get(email);
      if (!existingUser && req.user && req.user.id) {
        existingUser = db.prepare('SELECT id, email, status FROM users WHERE id = ?').get(req.user.id);
      }
      let existingStudent = Student.findByEmail(email);
      if (!existingStudent && existingUser) {
        existingStudent = db.prepare('SELECT * FROM students WHERE user_id = ?').get(existingUser.id);
      }
      const alreadyRegisteredUser = !!existingUser;

      // Check if student is already enrolled in this exact course
      if (existingStudent && courseRecord) {
        const existingReg = db.prepare('SELECT * FROM registrations WHERE student_id = ? AND course_id = ? AND status != "cancelled"').get(existingStudent.id, courseRecord.id);
        if (existingReg) {
          return res.status(400).json({
            success: false,
            message: `You are already registered for "${courseRecord.title}". Please log in to your student dashboard.`
          });
        }
      }

      // Check and validate referral code if provided (supports referrals table, unique employee referral codes, or existing student referral)
      let validatedReferralCode = null;
      let referredByEmployeeId = null;
      let referralDiscountPercent = 0;
      let rawRefCode = (req.body.referral_code || req.body.referral || '').trim().toUpperCase();
      if (!rawRefCode && existingStudent) {
        if (existingStudent.referral_code) {
          rawRefCode = String(existingStudent.referral_code).trim().toUpperCase();
        } else if (existingStudent.referred_by) {
          const fallbackEmp = db.prepare('SELECT id, referral_code FROM users WHERE id = ? AND deleted_at IS NULL').get(existingStudent.referred_by);
          if (fallbackEmp) {
            referredByEmployeeId = fallbackEmp.id;
            if (fallbackEmp.referral_code) rawRefCode = String(fallbackEmp.referral_code).trim().toUpperCase();
          }
        }
      }
      if (rawRefCode) {
        const refRecord = db.prepare('SELECT * FROM referrals WHERE UPPER(code) = ? AND is_active = 1').get(rawRefCode);
        const empRefUser = db.prepare('SELECT id, referral_code FROM users WHERE UPPER(referral_code) = ? AND deleted_at IS NULL').get(rawRefCode);
        if (!refRecord && !empRefUser) {
          return res.status(400).json({
            success: false,
            message: `Invalid referral code "${rawRefCode}". Please check code or leave blank.`
          });
        }
        if (refRecord && refRecord.max_uses > 0 && refRecord.times_used >= refRecord.max_uses) {
          return res.status(400).json({
            success: false,
            message: `Referral code "${rawRefCode}" has reached its maximum usage limit.`
          });
        }
        validatedReferralCode = (refRecord ? refRecord.code : empRefUser.referral_code).toUpperCase();
        referredByEmployeeId = (refRecord && refRecord.employee_id) || (empRefUser && empRefUser.id) || null;
        referralDiscountPercent = refRecord ? (refRecord.discount_percent || 0) : 0;
      }

      // Compute pricing — Initially, the registered student does NOT have any payments mentioned
      // Total amount, paid amount, and balance are set to 0.
      // Admin or Employee will later assign payment details, which will then reflect to the student.
      const totalAmount = 0;
      const paidAmount = 0;
      const balanceAmount = 0;
      const paymentPlan = 'full';

      // Generate IDs
      const studentId = generateStudentId();
      const registrationId = generateRegistrationId();
      const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
      const rawPassword = emailPrefix; // Default password is text before '@' of email (e.g. yogeshbrf2006)

      // Start transaction
      const transaction = db.transaction(() => {
        // 1. Create user account if not existing
        let userId = existingUser ? existingUser.id : null;
        if (!userId) {
          const userResult = db.prepare(`
            INSERT INTO users (email, password_hash, role_id, status, first_name, last_name, phone, email_verified)
            VALUES (?, ?, 3, 'active', ?, ?, ?, 0)
          `).run(email, require('bcryptjs').hashSync(rawPassword, 12), first_name, last_name, phone);
          userId = userResult.lastInsertRowid;
        }

        // 2. Create student profile if not existing
        let studentDbId = existingStudent ? existingStudent.id : null;
        let finalStudentId = existingStudent ? existingStudent.student_id : studentId;
        const photoPath = req.file ? `/uploads/photos/${req.file.filename}` : (existingStudent ? existingStudent.photo : null);
        
        if (!studentDbId) {
          const studentResult = db.prepare(`
            INSERT INTO students (
              user_id, student_id, photo, first_name, last_name, email, phone,
              gender, college, university, degree, department, year_of_study, graduation_year,
              referred_by, referral_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            userId, finalStudentId, photoPath, first_name, last_name, email, phone,
            gender || null, college || null, university || null, degree || null, department || null, year_of_study || null, graduation_year || null,
            referredByEmployeeId, validatedReferralCode || null
          );
          studentDbId = studentResult.lastInsertRowid;
        } else {
          // Keep existing student profile and enrich missing fields or referral attribution
          db.prepare(`
            UPDATE students SET
              photo = COALESCE(photo, ?),
              gender = COALESCE(NULLIF(gender, ''), ?),
              college = COALESCE(NULLIF(college, ''), ?),
              university = COALESCE(NULLIF(university, ''), ?),
              degree = COALESCE(NULLIF(degree, ''), ?),
              department = COALESCE(NULLIF(department, ''), ?),
              graduation_year = COALESCE(NULLIF(graduation_year, ''), ?),
              phone = COALESCE(NULLIF(phone, ''), ?),
              referred_by = COALESCE(referred_by, ?),
              referral_code = COALESCE(NULLIF(referral_code, ''), ?),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(
            req.file ? `/uploads/photos/${req.file.filename}` : null,
            gender || null, college || null, university || null, degree || null,
            department || null, graduation_year || null, phone || null,
            referredByEmployeeId || null, validatedReferralCode || null,
            studentDbId
          );
        }

        // 3. Create registration with referral_code
        const chosenMode = (req.body.learning_mode || req.body.mode || courseRecord.mode || 'online').toLowerCase();
        const validMode = ['online', 'offline', 'hybrid'].includes(chosenMode) ? chosenMode : (courseRecord.mode || 'online');
        const regResult = db.prepare(`
          INSERT INTO registrations (
            registration_id, student_id, course_id, batch_name, mode,
            start_date, status, payment_plan, total_amount, paid_amount, balance_amount, referral_code
          ) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?)
        `).run(
          registrationId, studentDbId, courseRecord.id, courseRecord.batch_name || 'Batch 2026', validMode,
          course_start_date || courseRecord.start_date || new Date().toISOString().split('T')[0],
          paymentPlan, totalAmount, paidAmount, balanceAmount, validatedReferralCode || null
        );

        const regDbId = regResult.lastInsertRowid;

        // 4. Increment referral usage if applied
        if (validatedReferralCode) {
          db.prepare('UPDATE referrals SET times_used = times_used + 1, updated_at = CURRENT_TIMESTAMP WHERE code = ?').run(validatedReferralCode);
        }

        return { userId, studentDbId, regDbId, studentId: finalStudentId, registrationId };
      });

      const result = transaction();

      // Broadcast triangular sync event
      const syncService = require('../services/syncService');
      syncService.broadcast('registration:created', {
        registrationId: result.registrationId,
        studentId: result.studentId,
        studentName: `${first_name} ${last_name}`,
        course: courseRecord.title,
        referralCode: validatedReferralCode,
        message: `New student registration: ${first_name} ${last_name} enrolled in ${courseRecord.title}${validatedReferralCode ? ` (Referral: ${validatedReferralCode})` : ''}.`
      });

      if (validatedReferralCode) {
        syncService.broadcast('referral:used', {
          code: validatedReferralCode,
          studentName: `${first_name} ${last_name}`,
          message: `Referral code ${validatedReferralCode} used by ${first_name} ${last_name}.`
        });
      }

      // Send welcome email only for newly created user accounts (existing users keep their existing password)
      if (!alreadyRegisteredUser) {
        emailService.sendWelcomeEmail(
          { first_name, last_name, email, student_id: result.studentId },
          { email, password: rawPassword }
        ).catch(err => logger.error('Welcome email failed:', err));
      }

      res.status(201).json({
        success: true,
        message: alreadyRegisteredUser
          ? 'Application submitted and linked to your existing account! 🎉'
          : 'Application submitted successfully! 🎉',
        data: {
          studentId: result.studentId,
          registrationId: result.registrationId,
          alreadyRegisteredUser,
          referralCode: validatedReferralCode || null,
          credentials: alreadyRegisteredUser ? null : {
            email,
            password: rawPassword
          },
          offerLetterUrl: `/api/registrations/${result.registrationId}/offer-letter`,
          applicationPdfUrl: `/api/registrations/${result.registrationId}/application-pdf`
        }
      });
    } catch (error) {
      logger.error('Application error:', error);
      res.status(500).json({ success: false, message: error.message || 'Application failed. Please try again.' });
    }
  },

  /**
   * GET /api/registrations/:regId/application-pdf
   */
  async downloadApplicationPdf(req, res) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Application-${req.params.regId}.pdf"`);
    
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(25).text('Application Form', 100, 100);
    doc.fontSize(12).text(`Registration ID: ${req.params.regId}`, 100, 150);
    doc.end();
  },

  async getOfferLetter(req, res) {
    try {
      const registration = Registration.findByRegistrationId(req.params.regId);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      if (registration.offer_letter_path) {
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'public', registration.offer_letter_path);
        if (require('fs').existsSync(filePath)) {
          return res.download(filePath, `Offer-Letter-${registration.registration_id}.pdf`);
        }
      }

      // Generate on demand
      const student = Student.findById(registration.student_id);
      const course = Course.findById(registration.course_id);
      
      if (!student || !course) {
        return res.status(404).json({ success: false, message: 'Student or course data not found.' });
      }

      const pdf = await pdfService.generateOfferLetter(student, registration, course);

      const db = getDb();
      db.prepare('UPDATE registrations SET offer_letter_generated = 1, offer_letter_path = ? WHERE id = ?')
        .run(pdf.relativePath, registration.id);

      res.download(pdf.filePath, `Offer-Letter-${registration.registration_id}.pdf`);
    } catch (error) {
      logger.error('Offer letter error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate offer letter.' });
    }
  },

  async checkDownload(req, res) {
    try {
      const { student_id, document_type } = req.body;
      if (!student_id || !document_type) {
        return res.status(400).json({ success: false, message: 'student_id and document_type are required.' });
      }
      const db = getDb();
      const existing = db.prepare('SELECT id FROM certificate_downloads WHERE student_id = ? AND document_type = ?').get(student_id, document_type);
      return res.json({ success: true, downloaded: !!existing });
    } catch (error) {
      logger.error('Check download error:', error);
      res.status(500).json({ success: false, message: 'Failed to check download.' });
    }
  },

  async logDownload(req, res) {
    try {
      const { student_id, document_type } = req.body;
      if (!student_id || !document_type) {
        return res.status(400).json({ success: false, message: 'student_id and document_type are required.' });
      }
      const db = getDb();
      const existing = db.prepare('SELECT id FROM certificate_downloads WHERE student_id = ? AND document_type = ?').get(student_id, document_type);
      if (existing) {
        return res.json({ success: false, message: 'This document has already been downloaded for this student.' });
      }
      db.prepare('INSERT INTO certificate_downloads (student_id, document_type) VALUES (?, ?)').run(student_id, document_type);
      return res.json({ success: true, message: 'Download logged successfully.' });
    } catch (error) {
      logger.error('Log download error:', error);
      res.status(500).json({ success: false, message: 'Failed to log download.' });
    }
  },

  /**
   * PUT /api/registrations/:id
   * Admin or Employee updates internship / registration details (all fields editable)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        first_name, last_name, email, phone, college, department, degree, year_of_study,
        course_id, batch_name, start_date, end_date, mode, status,
        total_amount, paid_amount, balance_amount, referral_code, notes
      } = req.body;
      const db = getDb();
      const syncService = require('../services/syncService');
      const { logAudit } = require('../services/auditService');

      let reg = null;
      if (!isNaN(id) && Number.isInteger(Number(id))) {
        reg = db.prepare('SELECT r.*, s.id as student_db_id FROM registrations r JOIN students s ON r.student_id = s.id WHERE r.id = ?').get(parseInt(id, 10));
      }
      if (!reg) {
        reg = db.prepare('SELECT r.*, s.id as student_db_id FROM registrations r JOIN students s ON r.student_id = s.id WHERE r.registration_id = ?').get(String(id));
      }
      if (!reg) {
        return res.status(404).json({ success: false, message: 'Internship / Registration record not found.' });
      }

      const oldValues = { ...reg };

      // Referral code validation, adjustment, and usage count sync
      let finalReferralCode = reg.referral_code;
      const oldRef = reg.referral_code ? reg.referral_code.trim().toUpperCase() : null;
      const newRef = referral_code !== undefined ? (String(referral_code).trim().toUpperCase() || null) : undefined;
      let newRefRecord = null;

      if (newRef !== undefined && newRef !== oldRef) {
        if (newRef) {
          newRefRecord = db.prepare('SELECT * FROM referrals WHERE UPPER(code) = ? AND is_active = 1').get(newRef);
          if (!newRefRecord) {
            return res.status(400).json({
              success: false,
              message: `Referral code "${newRef}" is invalid or inactive. Please provide an active referral code or leave empty.`
            });
          }
          if (newRefRecord.max_uses > 0 && newRefRecord.times_used >= newRefRecord.max_uses) {
            return res.status(400).json({
              success: false,
              message: `Referral code "${newRef}" has reached its maximum usage limit.`
            });
          }
          finalReferralCode = newRefRecord.code;
        } else {
          finalReferralCode = null;
        }
      }

      // Calculate new pricing
      let newTotal = (total_amount !== undefined && total_amount !== '' && !isNaN(total_amount)) ? Math.max(0, parseFloat(total_amount)) : (Number(reg.total_amount) || 0);
      if (newRefRecord && newRefRecord.discount_percent > 0 && total_amount === undefined) {
        const base = reg.total_amount || 8999;
        const disc = Math.round(base * (newRefRecord.discount_percent / 100));
        newTotal = Math.max(0, base - disc);
      }
      const newPaid = (paid_amount !== undefined && paid_amount !== '' && !isNaN(paid_amount)) ? Math.max(0, parseFloat(paid_amount)) : (Number(reg.paid_amount) || 0);
      const newBalance = (balance_amount !== undefined && balance_amount !== '' && !isNaN(balance_amount)) ? Math.max(0, parseFloat(balance_amount)) : Math.max(0, newTotal - newPaid);

      const tx = db.transaction(() => {
        // 1. Update Student record if personal info provided
        db.prepare(`
          UPDATE students SET
            first_name = COALESCE(?, first_name),
            last_name = COALESCE(?, last_name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            college = COALESCE(?, college),
            department = COALESCE(?, department),
            degree = COALESCE(?, degree),
            year_of_study = COALESCE(?, year_of_study),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(
          first_name || null,
          last_name || null,
          email || null,
          phone || null,
          college || null,
          department || null,
          degree || null,
          year_of_study || null,
          reg.student_id
        );

        // 2. Update Registration / Internship record
        db.prepare(`
          UPDATE registrations SET
            course_id = COALESCE(?, course_id),
            batch_name = COALESCE(?, batch_name),
            start_date = COALESCE(?, start_date),
            end_date = COALESCE(?, end_date),
            mode = COALESCE(?, mode),
            status = COALESCE(?, status),
            total_amount = ?,
            paid_amount = ?,
            balance_amount = ?,
            referral_code = ?,
            notes = COALESCE(?, notes),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(
          course_id || null,
          batch_name || null,
          start_date || null,
          end_date || null,
          mode || null,
          status || null,
          newTotal,
          newPaid,
          newBalance,
          finalReferralCode,
          notes || null,
          reg.id
        );

        // 3. Update referral usage counters & referring employee attribution if changed
        if (newRef !== undefined && newRef !== oldRef) {
          if (newRef) {
            db.prepare('UPDATE referrals SET times_used = times_used + 1, updated_at = CURRENT_TIMESTAMP WHERE UPPER(code) = ?').run(newRef);
            const empRef = db.prepare(`
              SELECT COALESCE(
                (SELECT employee_id FROM referrals WHERE UPPER(code) = ? AND employee_id IS NOT NULL LIMIT 1),
                (SELECT id FROM users WHERE UPPER(referral_code) = ? AND deleted_at IS NULL LIMIT 1)
              ) as emp_id
            `).get(newRef, newRef);
            db.prepare('UPDATE students SET referral_code = ?, referred_by = ? WHERE id = ?')
              .run(finalReferralCode, empRef ? empRef.emp_id : null, reg.student_id);
          } else {
            db.prepare('UPDATE students SET referral_code = NULL, referred_by = NULL WHERE id = ?').run(reg.student_id);
          }
          if (oldRef) {
            db.prepare('UPDATE referrals SET times_used = MAX(0, times_used - 1), updated_at = CURRENT_TIMESTAMP WHERE UPPER(code) = ?').run(oldRef);
          }
        }
      });

      tx();

      if (newRef && newRef !== oldRef) {
        syncService.broadcast('referral:used', {
          code: finalReferralCode,
          studentName: `${first_name || reg.first_name} ${last_name || reg.last_name}`,
          message: `Referral code ${finalReferralCode} linked to registration #${reg.registration_id}.`
        });
      }

      logAudit(req, {
        action: 'UPDATE_INTERNSHIP',
        module: 'internships',
        entityType: 'registration',
        entityId: reg.id,
        oldValues,
        newValues: req.body
      });

      // If financial amounts were updated, broadcast payment sync event
      if (newTotal !== reg.total_amount || newPaid !== reg.paid_amount || newBalance !== reg.balance_amount) {
        syncService.broadcast('payment:updated', {
          id: reg.id,
          registrationId: reg.registration_id,
          studentId: reg.student_id,
          totalAmount: newTotal,
          paidAmount: newPaid,
          balanceAmount: newBalance,
          message: `Payment & fee details updated for ${first_name || reg.first_name} (₹${newTotal.toLocaleString('en-IN')}).`
        });
      }

      syncService.broadcast('internship:updated', {
        id: reg.id,
        registrationId: reg.registration_id,
        studentId: reg.student_id,
        message: `Internship / Registration record #${reg.registration_id} updated.`
      });

      syncService.broadcast('registration:updated', {
        id: reg.id,
        registrationId: reg.registration_id,
        studentId: reg.student_id,
        message: `Registration #${reg.registration_id} details updated.`
      });

      res.json({
        success: true,
        message: 'Internship record updated and synced successfully across all panels! ✅',
        data: { id: reg.id, registration_id: reg.registration_id }
      });
    } catch (err) {
      logger.error('Update registration error:', err);
      res.status(500).json({ success: false, message: 'Failed to update record: ' + err.message });
    }
  }
};

module.exports = registrationController;
