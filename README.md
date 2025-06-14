# Weather Dashboard

A full-stack weather application that provides current weather conditions, hourly forecasts, and weekly forecasts with a beautiful user interface.

## Features

- Real-time weather data
- Current weather conditions
- Hourly forecast
- Weekly forecast
- Search for any location
- Beautiful animations and icons
- Responsive design
- Unit conversion (Celsius/Fahrenheit)

## Tech Stack

### Frontend
- React.js
- Vite
- CSS3 for styling
- Lottie for animations

### Backend
- Node.js
- Express.js
- Weather API integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/deep020206/FUTURE_FS_02.git
cd Weather-dashboard
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Environment Variables Setup

1. Backend Environment Variables
Create a `.env` file in the `backend` directory with the following content:
```
PORT=5000
WEATHER_API_KEY=your_weather_api_key_here
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1
CORS_ORIGIN=http://localhost:5173
```

2. Frontend Environment Variables
Create a `.env` file in the `frontend` directory with the following content:
```
VITE_API_URL=http://localhost:5000/api
```

> Note: Replace `your_weather_api_key_here` with your actual Weather API key from [WeatherAPI.com](https://www.weatherapi.com/)

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```
The backend server will start on http://localhost:5000

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend development server will start on http://localhost:5173

## API Endpoints

- `GET /api/weather/current/:location` - Get current weather
- `GET /api/weather/forecast/:location` - Get weather forecast
- `GET /api/weather/search/:query` - Search locations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
