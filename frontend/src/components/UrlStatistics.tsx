import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    Alert
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import moment from 'moment';
import api from '../utils/api';

interface Click {
    timestamp: string;
    referrer: string;
    geo: string;
}

interface UrlStats {
    originalUrl: string;
    shortCode: string;
    createdAt: string;
    expiryDate: string;
    totalClicks: number;
    clicks: Click[];
}

const Row: React.FC<{ row: UrlStats }> = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.shortCode}
                </TableCell>
                <TableCell>{row.originalUrl}</TableCell>
                <TableCell>{moment(row.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                <TableCell>{moment(row.expiryDate).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                <TableCell>{row.totalClicks}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Click History
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Referrer</TableCell>
                                        <TableCell>Location</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.clicks.map((click, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {moment(click.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
                                            </TableCell>
                                            <TableCell>{click.referrer || 'Direct'}</TableCell>
                                            <TableCell>{click.geo || 'Unknown'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const UrlStatistics: React.FC = () => {
    const [stats, setStats] = useState<UrlStats[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/shorturls');
                setStats(response.data);
                setError('');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                URL Statistics
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Short Code</TableCell>
                            <TableCell>Original URL</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Expires At</TableCell>
                            <TableCell>Total Clicks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.map((stat) => (
                            <Row key={stat.shortCode} row={stat} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UrlStatistics;
