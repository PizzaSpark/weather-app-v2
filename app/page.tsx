'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Thermometer, Wind, MapPin, Cloud, AlertCircle } from 'lucide-react'
import { getWeatherForCity } from "./actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Add these interfaces at the top of the file
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
  const [city, setCity] = useState("")

  // Update the error handling
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data: WeatherResponse = await getWeatherForCity(city)
    
    if ('error' in data) {
      setError(data.error)
      setWeather(null)
    } else {
      setWeather(data)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>City Weather Lookup</CardTitle>
          <CardDescription>Enter a city name to get current weather</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Get Weather"}
            </Button>
          </form>
        </CardContent>
      </Card>

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

