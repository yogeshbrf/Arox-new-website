/**
 * Shared 4-Step Enrollment Form Helper
 * Handles Degree -> Specialization cascading dropdowns, "Other" custom input fields,
 * clean form resets on modal close/open, and academic value resolution.
 */
(function (window) {
  'use strict';

  const DEGREE_SPECIALIZATIONS = {
    'B.E': [
      'Computer Science & Engineering',
      'Electronics & Communication Engineering (ECE)',
      'Electrical & Electronics Engineering (EEE)',
      'Mechanical Engineering',
      'Civil Engineering',
      'Information Technology',
      'Artificial Intelligence & Data Science',
      'Mechatronics Engineering',
      'Aeronautical Engineering',
      'Biomedical Engineering',
      'Other'
    ],
    'B.Tech': [
      'Information Technology',
      'Computer Science & Business Systems',
      'Artificial Intelligence & Machine Learning',
      'Data Science & Engineering',
      'Cyber Security',
      'Cloud Computing',
      'Biotechnology',
      'Chemical Engineering',
      'Other'
    ],
    'B.Sc': [
      'Computer Science',
      'Information Technology',
      'Data Science & Analytics',
      'Artificial Intelligence',
      'Mathematics',
      'Physics',
      'Electronics',
      'Visual Communication',
      'Biotechnology',
      'Other'
    ],
    'BCA': [
      'Computer Applications',
      'Cloud Computing & Cyber Security',
      'Data Analytics',
      'Full Stack Development',
      'Mobile App Development',
      'Other'
    ],
    'B.Com': [
      'Computer Applications',
      'Accounting & Finance',
      'Corporate Secretaryship',
      'Banking & Insurance',
      'E-Commerce',
      'Professional Accounting',
      'Other'
    ],
    'BBA': [
      'Business Administration',
      'Digital Marketing',
      'Human Resource Management',
      'Finance & Analytics',
      'International Business',
      'Other'
    ],
    'M.E': [
      'Computer Science & Engineering',
      'Applied Electronics',
      'VLSI Design',
      'Power Systems Engineering',
      'Structural Engineering',
      'Manufacturing Engineering',
      'Software Engineering',
      'Other'
    ],
    'M.Tech': [
      'Artificial Intelligence & Data Science',
      'Cyber Security',
      'Cloud Computing',
      'Information Technology',
      'Embedded Systems',
      'Machine Learning',
      'Other'
    ],
    'M.Sc': [
      'Computer Science',
      'Information Technology',
      'Data Science',
      'Software Systems',
      'Cyber Security',
      'Mathematics',
      'Other'
    ],
    'MCA': [
      'Computer Applications',
      'Artificial Intelligence & Machine Learning',
      'Cloud & DevOps',
      'Full Stack Engineering',
      'Cyber Security',
      'Other'
    ],
    'MBA': [
      'Business Analytics',
      'Information Technology Management',
      'Marketing & Digital Strategy',
      'Finance',
      'Human Resources',
      'Operations & Supply Chain',
      'Other'
    ],
    'Diploma': [
      'Computer Engineering',
      'Electronics & Communication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Information Technology',
      'Other'
    ],
    'Other': ['Other']
  };

  function toggleWrap(wrapEl, inputEl, show) {
    if (!wrapEl) return;
    if (show) {
      wrapEl.style.display = 'block';
      if (inputEl) setTimeout(() => inputEl.focus(), 40);
    } else {
      wrapEl.style.display = 'none';
      if (inputEl) inputEl.value = '';
    }
  }

  function populateSpecializations(degreeVal) {
    const specSelect = document.getElementById('form-spec');
    const specOtherWrap = document.getElementById('spec-other-wrap');
    const specOtherInput = document.getElementById('form-spec-other');
    if (!specSelect) return;

    specSelect.innerHTML = '';
    toggleWrap(specOtherWrap, specOtherInput, false);

    if (!degreeVal) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Select degree first...';
      opt.disabled = true;
      opt.selected = true;
      specSelect.appendChild(opt);
      specSelect.disabled = true;
      return;
    }

    specSelect.disabled = false;
    const list = DEGREE_SPECIALIZATIONS[degreeVal] || ['Other'];

    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = 'Select specialization / department...';
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    specSelect.appendChild(placeholderOpt);

    list.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item === 'Other' ? 'Other (Enter manually)' : item;
      specSelect.appendChild(opt);
    });

    if (degreeVal === 'Other') {
      specSelect.value = 'Other';
      toggleWrap(specOtherWrap, specOtherInput, true);
    }
  }

  function initAcademicCascadingSelects() {
    const univSelect = document.getElementById('form-university');
    const univOtherWrap = document.getElementById('university-other-wrap');
    const univOtherInput = document.getElementById('form-university-other');

    const degreeSelect = document.getElementById('form-degree');
    const degreeOtherWrap = document.getElementById('degree-other-wrap');
    const degreeOtherInput = document.getElementById('form-degree-other');

    const specSelect = document.getElementById('form-spec');
    const specOtherWrap = document.getElementById('spec-other-wrap');
    const specOtherInput = document.getElementById('form-spec-other');

    if (univSelect && !univSelect.dataset.boundCascade) {
      univSelect.dataset.boundCascade = '1';
      univSelect.addEventListener('change', () => {
        toggleWrap(univOtherWrap, univOtherInput, univSelect.value === 'Other');
      });
    }

    if (degreeSelect && !degreeSelect.dataset.boundCascade) {
      degreeSelect.dataset.boundCascade = '1';
      degreeSelect.addEventListener('change', () => {
        const val = degreeSelect.value;
        toggleWrap(degreeOtherWrap, degreeOtherInput, val === 'Other');
        populateSpecializations(val);
      });
    }

    if (specSelect && !specSelect.dataset.boundCascade) {
      specSelect.dataset.boundCascade = '1';
      specSelect.addEventListener('change', () => {
        toggleWrap(specOtherWrap, specOtherInput, specSelect.value === 'Other');
      });
    }

    populateSpecializations(degreeSelect ? degreeSelect.value : '');
  }

  function getAcademicValues() {
    const univSel = document.getElementById('form-university');
    const univOther = document.getElementById('form-university-other');
    const degreeSel = document.getElementById('form-degree');
    const degreeOther = document.getElementById('form-degree-other');
    const specSel = document.getElementById('form-spec');
    const specOther = document.getElementById('form-spec-other');
    const gradSel = document.getElementById('form-grad-year');

    const university = univSel && univSel.value === 'Other'
      ? (univOther ? univOther.value.trim() : '')
      : (univSel ? univSel.value : '');

    const degree = degreeSel && degreeSel.value === 'Other'
      ? (degreeOther ? degreeOther.value.trim() : '')
      : (degreeSel ? degreeSel.value : '');

    const specialization = specSel && specSel.value === 'Other'
      ? (specOther ? specOther.value.trim() : '')
      : (specSel ? specSel.value : '');

    const gradYear = gradSel ? gradSel.value : '';

    return {
      university,
      degree,
      specialization,
      gradYear,
      univRaw: univSel ? univSel.value : '',
      degreeRaw: degreeSel ? degreeSel.value : '',
      specRaw: specSel ? specSel.value : ''
    };
  }

  function resetEnrollmentModalForm() {
    ['google-form-1', 'google-form-2', 'google-form-3'].forEach((id) => {
      const f = document.getElementById(id);
      if (f) f.reset();
    });

    const clearIds = [
      'form-name',
      'form-email',
      'form-phone',
      'form-college',
      'form-university-other',
      'form-degree-other',
      'form-spec-other',
      'form-start-date',
      'form-referral-code'
    ];
    clearIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    ['form-gender', 'form-university', 'form-degree', 'form-grad-year', 'form-learning-mode', 'form-duration'].forEach((id) => {
      const sel = document.getElementById(id);
      if (sel) sel.selectedIndex = 0;
    });

    populateSpecializations('');

    ['university-other-wrap', 'degree-other-wrap', 'spec-other-wrap'].forEach((id) => {
      const wrap = document.getElementById(id);
      if (wrap) wrap.style.display = 'none';
    });

    document.querySelectorAll('input[name="req"]').forEach((cb) => {
      cb.checked = false;
    });

    const confirmCheck = document.getElementById('form-confirm-check');
    if (confirmCheck) confirmCheck.checked = false;

    ['error-step1', 'error-step2', 'error-step3', 'error-step4'].forEach((id) => {
      const err = document.getElementById(id);
      if (err) err.textContent = '';
    });

    const refInput = document.getElementById('form-referral-code');
    if (refInput) refInput.readOnly = false;
    const refBtn = document.getElementById('btn-validate-referral');
    if (refBtn) {
      refBtn.disabled = false;
      refBtn.textContent = 'Apply';
      refBtn.style.background = '';
    }
    const refMsg = document.getElementById('referral-status-msg');
    if (refMsg) {
      refMsg.style.display = 'none';
      refMsg.textContent = '';
    }

    const previewBox = document.getElementById('modal-preview-summary');
    if (previewBox) previewBox.innerHTML = '';

    const submitBtn = document.getElementById('form-btn-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Application &#10003;';
    }
  }

  window.AroxEnrollForm = {
    DEGREE_SPECIALIZATIONS,
    initAcademicCascadingSelects,
    populateSpecializations,
    getAcademicValues,
    resetEnrollmentModalForm
  };
})(window);

