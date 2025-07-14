const mongoose = require('mongoose');
const { logger } = require('../middleware/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        logger.info('MongoDB Connected', {
            host: conn.connection.host,
            name: conn.connection.name
        });
    } catch (error) {
        logger.error('MongoDB connection error', { error: error.message });
        process.exit(1);
    }
};

module.exports = connectDB;
