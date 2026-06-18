const db = require('../db');

module.exports = async (req, res) => {
  const logs = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
  res.json(logs.rows);
};