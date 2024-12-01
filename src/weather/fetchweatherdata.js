const axios = require('axios');
require('dotenv').config()
const apiKey = process.env.WEATHER_API_KEY;

const weather = async (req, res) => {
    const { lat, lon } = req.params;
    console.log('Fetching weather data for:', lat, lon);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather`;
    try {
        const response = await axios.get(weatherUrl,{
            params: {
            lat,
            lon,
            appid: apiKey,
            units: 'metric',
        }});
        const weatherData = response.data;
        res.status(200).json({
            success: true,
            data: weatherData,
            msgCode: 1000,
            msg: 'Weather data fetched successfully.'
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,    
            msgCode: 500,
            msg: 'Error fetching weather data.',
        });
    }
}
module.exports = weather ;