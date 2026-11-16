const { Review } = require('../../models');
const logger = require('../../utils/logger');

exports.index = (req, res) => {
  try {
    const { status, user_type } = req.query;
    const reviews = Review.findAll({ status, user_type });

    // Review statistics
    const allReviews = Review.findAll();
    const stats = {
      total: allReviews.length,
      pending: allReviews.filter(r => r.status === 'pending').length,
      acknowledged: allReviews.filter(r => r.status === 'acknowledged').length,
      avgRating: allReviews.length > 0 
        ? (allReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / allReviews.length).toFixed(1)
        : '5.0'
    };

    res.render('admin/reviews/index', {
      layout: 'layouts/admin',
      title: 'Reviews & Feedback | AROX ERP',
      pageTitle: 'Reviews & Ratings',
      currentPath: '/admin/reviews',
      user: req.user,
      reviews,
      stats,
      filters: { status, user_type }
    });
  } catch (error) {
    logger.error('Admin Reviews Index Error:', error);
    res.status(500).render('website/error', {
      layout: 'layouts/admin',
      title: 'Error - AROX ERP',
      code: 500,
      message: 'Failed to load reviews page.',
      user: req.user
    });
  }
};

