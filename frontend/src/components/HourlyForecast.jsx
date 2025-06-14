import React, { useRef, useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import '../styles/HourlyForecast.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HourlyForecast = ({ hourlyData }) => {
  const [activeTab, setActiveTab] = useState('temperature');
  const [chartData, setChartData] = useState(null);
  const scrollContainerRef = useRef(null);
  const chartRef = useRef(null);
  
  if (!hourlyData || hourlyData.length === 0) return null;
  
  // Handle scroll buttons
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Prepare chart data whenever hourlyData or activeTab changes
  useEffect(() => {
    if (!hourlyData) return;
    
    const hours = hourlyData.map(hour => formatDate(new Date(hour.dt * 1000), 'hour'));
    let values, label, borderColor, backgroundColor;
    
    switch (activeTab) {
      case 'temperature':
        values = hourlyData.map(hour => hour.temperature);
        label = 'Temperature (°C)';
        borderColor = 'rgba(255, 99, 132, 1)';
        backgroundColor = 'rgba(255, 99, 132, 0.2)';
        break;
      case 'precipitation':
        values = hourlyData.map(hour => hour.precipitation || 0);
        label = 'Precipitation (%)';
        borderColor = 'rgba(54, 162, 235, 1)';
        backgroundColor = 'rgba(54, 162, 235, 0.2)';
        break;
      case 'humidity':
        values = hourlyData.map(hour => hour.humidity || 0);
        label = 'Humidity (%)';
        borderColor = 'rgba(75, 192, 192, 1)';
        backgroundColor = 'rgba(75, 192, 192, 0.2)';
        break;
      case 'wind':
        values = hourlyData.map(hour => hour.windSpeed || 0);
        label = 'Wind Speed (km/h)';
        borderColor = 'rgba(153, 102, 255, 1)';
        backgroundColor = 'rgba(153, 102, 255, 0.2)';
        break;
      default:
        values = hourlyData.map(hour => hour.temperature);
        label = 'Temperature (°C)';
        borderColor = 'rgba(255, 99, 132, 1)';
        backgroundColor = 'rgba(255, 99, 132, 0.2)';
    }
    
    setChartData({
      labels: hours,
      datasets: [
        {
          label,
          data: values,
          borderColor,
          backgroundColor,
          borderWidth: 2,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: borderColor,
          tension: 0.4, // Smooth curve
          fill: true
        }
      ]
    });
    
  }, [hourlyData, activeTab]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        beginAtZero: activeTab !== 'temperature'
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: 'rgba(200, 200, 200, 0.75)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        usePointStyle: true
      }
    }
  };
  
  return (
    <div className="hourly-forecast card">
      <div className="card-header">
        <h3>Hourly Forecast</h3>
        
        <div className="forecast-tabs">
          <button 
            className={`tab-button ${activeTab === 'temperature' ? 'active' : ''}`}
            onClick={() => setActiveTab('temperature')}
            aria-label="Show temperature forecast"
          >
            <span className="tab-icon">🌡️</span>
            <span className="tab-text">Temperature</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'precipitation' ? 'active' : ''}`}
            onClick={() => setActiveTab('precipitation')}
            aria-label="Show precipitation forecast"
          >
            <span className="tab-icon">💧</span>
            <span className="tab-text">Precipitation</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'humidity' ? 'active' : ''}`}
            onClick={() => setActiveTab('humidity')}
            aria-label="Show humidity forecast"
          >
            <span className="tab-icon">💦</span>
            <span className="tab-text">Humidity</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'wind' ? 'active' : ''}`}
            onClick={() => setActiveTab('wind')}
            aria-label="Show wind forecast"
          >
            <span className="tab-icon">🌬️</span>
            <span className="tab-text">Wind</span>
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        {chartData && <Line ref={chartRef} data={chartData} options={chartOptions} />}
      </div>
      
      <div className="scroll-controls">
        <button 
          className="scroll-button scroll-left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="hourly-container" ref={scrollContainerRef}>
          {hourlyData.map((hour, index) => (
            <div key={index} className="hourly-item">
              <p className="time">{formatDate(new Date(hour.dt * 1000), 'hour')}</p>
              <div className="weather-icon-container">
                {hour.condition && <img src={hour.icon} alt={hour.description} className="weather-icon" loading="lazy" />}
              </div>
              <p className="temperature numeric-data">{Math.round(hour.temperature)}°</p>
              <p className="precipitation">
                <span className="precipitation-icon">💧</span> 
                {hour.precipitation || '0'}%
              </p>
            </div>
          ))}
        </div>
        
        <button 
          className="scroll-button scroll-right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HourlyForecast;