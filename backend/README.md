# URL Shortener Microservice

A robust HTTP URL Shortener Microservice that provides core URL shortening functionality along with basic analytical capabilities for the shortened links.

## Features

- Shorten up to 5 URLs concurrently
- Optional custom shortcodes
- Configurable validity periods
- Click tracking with geo-location
- Detailed analytics for each shortened URL
- Material UI-based responsive frontend
- Custom logging middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Project Structure

```
url-shortener/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── logger.js
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
    │   ├── App.tsx
    │   └── index.tsx
    └── package.json
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Backend Setup:
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Update with your MongoDB URI
   npm start
   ```

3. Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Create Short URL
- **POST** `/shorturls`
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
- Returns click statistics and URL details

### Redirect to Original URL
- **GET** `/:shortcode`
- Redirects to the original URL if valid

## Environment Variables

Backend:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:5000
```

## Error Handling

The service includes comprehensive error handling for:
- Invalid URL formats
- Non-existent shortcodes
- Expired links
- Shortcode collisions
- Server errors

## Logging

Custom logging middleware tracks:
- Request processing
- URL creation
- Access statistics
- Error events

Logs are stored in the `logs` directory with daily rotation.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 