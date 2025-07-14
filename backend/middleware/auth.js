const { logger } = require('./logger');

const validateAccessCode = (req, res, next) => {
    const accessCode = req.headers['x-access-code'];

    if (!accessCode || accessCode !== 'CZypQK') {
        logger.error('Invalid or missing access code', {
            ip: req.ip,
            path: req.path
        });
        return res.status(401).json({ error: 'Invalid or missing access code' });
    }

    next();
};

module.exports = validateAccessCode; 