module.exports = function requireFields(fields = []) {
  return function (req, res, next) {
    const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null);
    if (missing.length) return res.status(400).json({ error: 'missing fields', fields: missing });
    next();
  };
};
