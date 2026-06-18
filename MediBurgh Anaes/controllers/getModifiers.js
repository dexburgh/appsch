const modifierMap = {
  '001': ['U1', 'U2'],
  '002': ['U3'],
  '003': ['U1', 'IMPL'],
};

module.exports = (req, res) => {
  const code = req.params.code;
  const modifiers = modifierMap[code] || [];
  res.json({ code, modifiers });
};