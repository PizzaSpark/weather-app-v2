'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Wind, MapPin, Cloud, AlertCircle } from 'lucide-react'
import { getWeatherForCity } from "./actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WeatherData {
  city: string;
  temperature: number;
  windSpeed: number;
  weatherDescription: string;
}

interface WeatherError {
  error: string;
}

type WeatherResponse = WeatherData | WeatherError;

export default function WeatherApp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)

  async function fetchWeather() {
    setLoading(true)
    setError(null)

    const data: WeatherResponse = await getWeatherForCity("Bayombong")
    
    if ('error' in data) {
      setError(data.error)
      setWeather(null)
    } else {
      setWeather(data)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  if (loading) {
    return <div className="min-h-screen p-4 max-w-md mx-auto">Loading...</div>
  }

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {weather && !error && (
        <Card>
          <CardHeader>
            <CardTitle>{weather.city}</CardTitle>
            <CardDescription>Current Weather</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Location: {weather.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <span>Temperature: {weather.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>Wind Speed: {weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span>Weather: {weather.weatherDescription}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}