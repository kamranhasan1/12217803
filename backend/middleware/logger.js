const moment = require('moment');
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    _writeLog(level, message, meta = {}) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta
        };

        const logFile = path.join(this.logDir, `${moment().format('YYYY-MM-DD')}.log`);
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    }

    info(message, meta) {
        this._writeLog('INFO', message, meta);
    }

    error(message, meta) {
        this._writeLog('ERROR', message, meta);
    }

    warn(message, meta) {
        this._writeLog('WARN', message, meta);
    }

    debug(message, meta) {
        this._writeLog('DEBUG', message, meta);
    }
}

const logger = new Logger();

const loggingMiddleware = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request processed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });

    next();
};

module.exports = { logger, loggingMiddleware };
