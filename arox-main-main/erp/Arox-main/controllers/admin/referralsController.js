const { Referral } = require('../../models');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const referrals = Referral.findAll();
    res.render('admin/referrals/index', {
      layout: 'layouts/admin',
      title: 'Referral Management | AROX ERP',
      pageTitle: 'Referral Management',
      currentPath: '/admin/referrals',
      user: req.user,
      referrals
    });
  } catch (error) {
    logger.error('Admin Referrals Index Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/admin',
      title: 'Error - AROX ERP',
      code: 500,
      message: 'Failed to load referral management page.',
      user: req.user
    });
  }
};

