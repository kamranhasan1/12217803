# URL Shortener Microservice - 12217803

A robust HTTP URL Shortener Microservice that provides core URL shortening functionality along with basic analytical capabilities for shortened links.

## Project Structure
```
12217803Project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── logger.js (Pre-test logging middleware)
│   ├── models/
│   │   └── url.js
│   ├── routes/
│   │   └── urls.js
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UrlShortener.tsx
    │   │   └── UrlStatistics.tsx
    │   ├── utils/
    │   │   └── api.ts
    │   └── App.tsx
    └── package.json
```

## Features

- Shorten up to 5 URLs concurrently
- Optional custom shortcodes
- Configurable validity periods
- Click tracking with geo-location
- Detailed analytics for each shortened URL
- Material UI-based responsive frontend
- Custom logging middleware integration
- Access code protection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. Backend Setup:
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/url-shortener
   # BASE_URL=http://localhost:5000
   npm start
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Create Short URL
- **POST** `/shorturls`
- Requires X-Access-Code header
- Request Body:
  ```json
  {
    "url": "https://example.com/long-url",
    "validity": 30,
    "shortcode": "custom123"
  }
  ```

### Get URL Statistics
- **GET** `/shorturls/:shortcode`
- Requires X-Access-Code header

### Redirect to Original URL
- **GET** `/:shortcode`
- Public endpoint

## Security Features

- Access code protection for sensitive endpoints
- Input validation
- Error handling
- Rate limiting
- Secure headers

## Logging

The application uses a custom logging middleware (from pre-test setup) that tracks:
- Request processing
- URL creation/access
- Error events
- Performance metrics

## Author
- Roll Number: 12217803 