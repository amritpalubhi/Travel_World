import React, { useState } from 'react'
import { BASE_URL } from '../../utils/config'
import './WeatherWidget.css'

const WeatherWidget = () => {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [data, setData]     = useState(null)

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError('')
    setData(null)

    try {
      const res = await fetch(
        `${BASE_URL.replace('/api/v1', '')}/api/v1/weather?city=${encodeURIComponent(city)}`
      )

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.message || 'Failed to fetch weather')
        return
      }

      setData(json.data) // { city, days: [...] }
    } catch (err) {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="service__item weather-card">
      <h5 className="service__subtitle">Calculate Weather</h5>
      <h6 className="service__title">
        See the next few days and plan your trip with confidence.
      </h6>

      <form onSubmit={handleCheck} className="weather-form">
        <input
          type="text"
          placeholder="Enter city (e.g. Manali)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="weather-input"
        />
        <button type="submit" className="weather-btn" disabled={loading || !city.trim()}>
          {loading ? 'Checking...' : 'Check weather'}
        </button>
      </form>

      {error && <div className="weather-error">{error}</div>}

      {data && (
        <div className="weather-result">
          <h5 style={{ marginBottom: '0.5rem' }}>{data.city}</h5>
          <div className="weather-days">
            {data.days.map((day) => (
              <div key={day.date} className="weather-day-card">
                <div className="weather-day-date">
                  {new Date(day.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="weather-day-temps">
                  {day.min}°C – {day.max}°C
                </div>
                <div className="weather-day-desc">
                  {day.desc.charAt(0).toUpperCase() + day.desc.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherWidget