const db = require('../db');

module.exports = async (req, res) => {
  const { providerId, procedureCode, modifiers, units } = req.body;
  await db.query(
    'INSERT INTO submissions (provider_id, procedure_code, modifiers, units) VALUES ($1, $2, $3, $4)',
    [providerId, procedureCode, JSON.stringify(modifiers), units]
  );
  res.json({ status: 'submitted' });
};