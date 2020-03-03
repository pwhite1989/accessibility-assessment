const router = require('express').Router();

router.use('/status', require('./status'));
router.use('/page', require('./page'));
router.use('/report', require('./report'));
router.use('/logs', require('./logs'))

module.exports = router;
