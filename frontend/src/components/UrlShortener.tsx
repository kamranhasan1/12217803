import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert
} from '@mui/material';
import moment from 'moment';
import api from '../utils/api';

interface ShortenedUrl {
    shortLink: string;
    expiry: string;
    originalUrl: string;
}

const UrlShortener: React.FC = () => {
    const [urls, setUrls] = useState<Array<{ url: string; validity?: number; shortcode?: string }>>([{ url: '' }]);
    const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
    const [error, setError] = useState<string>('');

    const handleUrlChange = (index: number, field: string, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        setUrls(newUrls);
    };

    const addUrlField = () => {
        if (urls.length < 5) {
            setUrls([...urls, { url: '' }]);
        }
    };

    const removeUrlField = (index: number) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
    };

    const handleSubmit = async () => {
        try {
            const results = await Promise.all(
                urls.map(async ({ url, validity, shortcode }) => {
                    if (!url) return null;
                    const response = await api.post('/shorturls', {
                        url,
                        validity: validity || 30,
                        shortcode
                    });
                    return { ...response.data, originalUrl: url };
                })
            );

            setShortenedUrls(results.filter((result): result is ShortenedUrl => result !== null));
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                URL Shortener
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                {urls.map((url, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="URL to shorten"
                            value={url.url}
                            onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Validity (minutes)"
                                type="number"
                                defaultValue={30}
                                onChange={(e) => handleUrlChange(index, 'validity', e.target.value)}
                                sx={{ width: '200px' }}
                            />
                            <TextField
                                label="Custom shortcode (optional)"
                                onChange={(e) => handleUrlChange(index, 'shortcode', e.target.value)}
                                sx={{ width: '200px' }}
                            />
                            {index > 0 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeUrlField(index)}
                                >
                                    Remove
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))}

                {urls.length < 5 && (
                    <Button variant="outlined" onClick={addUrlField} sx={{ mt: 2 }}>
                        Add Another URL
                    </Button>
                )}

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ mt: 2, ml: urls.length < 5 ? 2 : 0 }}
                >
                    Shorten URLs
                </Button>
            </Paper>

            {shortenedUrls.length > 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Shortened URLs
                    </Typography>
                    <List>
                        {shortenedUrls.map((shortened, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={
                                        <a href={shortened.shortLink} target="_blank" rel="noopener noreferrer">
                                            {shortened.shortLink}
                                        </a>
                                    }
                                    secondary={
                                        <>
                                            Original: {shortened.originalUrl}
                                            <br />
                                            Expires: {moment(shortened.expiry).format('MMMM Do YYYY, h:mm:ss a')}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UrlShortener;
