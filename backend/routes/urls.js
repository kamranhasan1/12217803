const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const geoip = require('geoip-lite');
const Url = require('../models/url');
const { logger } = require('../middleware/logger');
const validateAccessCode = require('../middleware/auth');

// Apply access code validation to POST and GET /shorturls endpoints
router.post('/shorturls', validateAccessCode, async (req, res) => {
    try {
        const { url, validity = 30, shortcode } = req.body;

        // Validate URL
        try {
            new URL(url);
        } catch (err) {
            logger.error('Invalid URL format', { url });
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Generate or validate shortcode
        let finalShortcode = shortcode;
        if (!finalShortcode) {
            finalShortcode = nanoid(6);
        } else {
            // Validate shortcode format
            if (!/^[a-zA-Z0-9]+$/.test(finalShortcode)) {
                logger.error('Invalid shortcode format', { shortcode });
                return res.status(400).json({ error: 'Shortcode must be alphanumeric' });
            }

            // Check if shortcode exists
            const existing = await Url.findOne({ shortCode: finalShortcode });
            if (existing) {
                logger.error('Shortcode already exists', { shortcode });
                return res.status(409).json({ error: 'Shortcode already exists' });
            }
        }

        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + validity);

        const shortUrl = new Url({
            originalUrl: url,
            shortCode: finalShortcode,
            expiryDate
        });

        await shortUrl.save();

        logger.info('Short URL created', { shortCode: finalShortcode });
        res.status(201).json({
            shortLink: `${process.env.BASE_URL}/${finalShortcode}`,
            expiry: expiryDate.toISOString()
        });
    } catch (error) {
        logger.error('Error creating short URL', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

// Get URL statistics - requires access code
router.get('/shorturls/:shortcode', validateAccessCode, async (req, res) => {
    try {
        const { shortcode } = req.params;
        const url = await Url.findOne({ shortCode: shortcode });

        if (!url) {
            logger.error('URL not found', { shortcode });
            return res.status(404).json({ error: 'URL not found' });
        }

        logger.info('URL statistics retrieved', { shortcode });
        res.json({
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            expiryDate: url.expiryDate,
            totalClicks: url.clicks.length,
            clicks: url.clicks
        });
    } catch (error) {
        logger.error('Error retrieving URL statistics', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all URLs statistics - requires access code
router.get('/shorturls', validateAccessCode, async (req, res) => {
    try {
        const urls = await Url.find({});
        const stats = urls.map(url => ({
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            expiryDate: url.expiryDate,
            totalClicks: url.clicks.length,
            clicks: url.clicks
        }));

        logger.info('All URL statistics retrieved');
        res.json(stats);
    } catch (error) {
        logger.error('Error retrieving all URL statistics', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

// Redirect to original URL - public endpoint, no access code required
router.get('/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        const url = await Url.findOne({ shortCode: shortcode });

        if (!url) {
            logger.error('URL not found', { shortcode });
            return res.status(404).json({ error: 'URL not found' });
        }

        // Check if URL has expired
        if (new Date() > url.expiryDate) {
            logger.error('URL has expired', { shortcode });
            return res.status(410).json({ error: 'URL has expired' });
        }

        // Record click
        const geo = geoip.lookup(req.ip);
        url.clicks.push({
            referrer: req.get('referer') || '',
            geo: geo ? `${geo.country}, ${geo.region}, ${geo.city}` : 'Unknown'
        });
        await url.save();

        logger.info('URL accessed', { shortcode });
        res.redirect(url.originalUrl);
    } catch (error) {
        logger.error('Error redirecting to URL', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
