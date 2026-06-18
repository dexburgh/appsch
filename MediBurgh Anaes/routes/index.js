const express = require('express');
const router = express.Router();
const { submitCase, getAuditLog, getModifiers } = require('../controllers');

router.post('/submit', submitCase);
router.get('/audit', getAuditLog);
router.get('/modifiers/:code', getModifiers);

module.exports = router;