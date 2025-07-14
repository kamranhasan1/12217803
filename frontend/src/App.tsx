import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import UrlShortener from './components/UrlShortener';
import UrlStatistics from './components/UrlStatistics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              URL Shortener Service
            </Typography>
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            sx={{ bgcolor: 'primary.main' }}
          >
            <Tab label="Shorten URLs" />
            <Tab label="Statistics" />
          </Tabs>
        </AppBar>
        <Container>
          {currentTab === 0 && <UrlShortener />}
          {currentTab === 1 && <UrlStatistics />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
