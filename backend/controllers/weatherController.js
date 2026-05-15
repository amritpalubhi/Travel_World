import dotenv from 'dotenv'

dotenv.config()

export const getWeather = async (req, res) => {
  try {
    const { city } = req.query
    if (!city) {
      return res.status(400).json({ success: false, message: 'City is required' })
    }

    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Weather API key not configured' })
    }

    // 1) Call 5-day / 3-hour forecast API
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || 'Failed to fetch weather'
      })
    }

    // 2) Group by calendar date
    const byDate = {}

    for (const entry of data.list) {
      const date = entry.dt_txt.split(' ')[0] // "YYYY-MM-DD"
      if (!byDate[date]) {
        byDate[date] = {
          temps: [],
          descriptions: []
        }
      }
      byDate[date].temps.push(entry.main.temp)
      byDate[date].descriptions.push(entry.weather[0].description)
    }

    // 3) Build 5-day summary (today + next 4 days)
    const days = Object.keys(byDate)
      .slice(0, 5)
      .map((date) => {
        const temps = byDate[date].temps
        const min = Math.round(Math.min(...temps))
        const max = Math.round(Math.max(...temps))
        // pick the most common description
        const descCounts = {}
        for (const d of byDate[date].descriptions) {
          descCounts[d] = (descCounts[d] || 0) + 1
        }
        const desc = Object.entries(descCounts).sort((a, b) => b[1] - a[1])[0][0]

        return { date, min, max, desc }
      })

    return res.status(200).json({
      success: true,
      data: {
        city: data.city.name,
        days
      }
    })
  } catch (err) {
    console.error('Weather error:', err.message)
    return res.status(500).json({
      success: false,
      message: 'Server error fetching weather'
    })
  }
}