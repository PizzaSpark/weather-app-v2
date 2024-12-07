'use server'

import { z } from 'zod'

const weatherCodeMap: { [key: number]: string } = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  95: 'Thunderstorm',
  // Add more weather codes as needed
}

const weatherSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  current: z.object({
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
    weather_code: z.number()
  })
})

type WeatherData = z.infer<typeof weatherSchema>

export async function getWeatherForCity(cityName: string) {
  try {
    // Step 1: Get coordinates using Nominatim API
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (!geocodeData || geocodeData.length === 0) {
      return { error: `City '${cityName}' not found!` }
    }

    const topResult = geocodeData[0]
    const latitude = parseFloat(topResult.lat)
    const longitude = parseFloat(topResult.lon)
    const city = topResult.display_name

    // Step 2: Fetch weather using Open-Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    const parsedWeather = weatherSchema.parse(weatherData)

    return {
      city,
      temperature: parsedWeather.current.temperature_2m,
      windSpeed: parsedWeather.current.wind_speed_10m,
      weatherCode: parsedWeather.current.weather_code,
      weatherDescription: weatherCodeMap[parsedWeather.current.weather_code] || 'Unknown'
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return { error: 'Failed to fetch weather data. Please try again.' }
  }
}

