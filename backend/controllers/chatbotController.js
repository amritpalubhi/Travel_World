import Groq from 'groq-sdk'
import Tour from '../models/Tour.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const getLiveTourContext = async () => {
  try {
    const tours = await Tour.find({}).populate('reviews').limit(30)
    if (!tours.length) return 'No tours currently available in the database.'

    return tours.map(t => {
      const avgRating = t.reviews.length
        ? (t.reviews.reduce((sum, r) => sum + r.rating, 0) / t.reviews.length).toFixed(1)
        : 'No ratings yet'
      return `- "${t.title}" | City: ${t.city} | Price: $${t.price}/person | Group size: up to ${t.maxGroupSize} | Distance: ${t.distance}km | Rating: ${avgRating} (${t.reviews.length} reviews) | Featured: ${t.featured ? 'Yes' : 'No'} | Description: ${t.desc}`
    }).join('\n')
  } catch {
    return 'Tour data temporarily unavailable.'
  }
}

export const chat = async (req, res) => {
  try {
    const { message } = req.body
    if (!message)
      return res.status(400).json({ success: false, message: 'Message is required' })

    const tourContext = await getLiveTourContext()

    const systemPrompt = `
You are TravelWorld AI — a smart, friendly, and knowledgeable travel assistant built into the TripNest travel booking website.

=== ABOUT TRAVELWORLD ===
TravelWorld is a travel booking platform where users can:
- Browse and search tours by city, distance, and group size
- View tour details including price, description, ratings, and reviews
- Book tours securely with online payment via Razorpay
- Leave reviews and ratings after their trip
- Login securely using OTP (no password needed)
- View all their bookings in their profile

=== WEBSITE PAGES ===
- Home (/home): Featured tours, stats, testimonials, newsletter
- Tours (/tours): Full tour listing with pagination
- Tour Details (/tours/:id): Full info + booking form for a specific tour
- Search (/tours/search): Search by city, distance, max group size
- Login (/login): OTP-based secure login
- Register (/register): Create new account (username + email only)
- Profile (/profile): View past bookings
- Thank You (/thank-you): Shown after successful booking

=== HOW BOOKING WORKS ===
1. User browses tours and clicks a tour
2. On the Tour Details page, fills in: Full Name, Phone, Travel Date, Number of Guests
3. Clicks "Pay & Book Now" — Razorpay payment window opens
4. After successful payment, booking is confirmed
5. User sees the Thank You page
6. Booking appears in their Profile page

=== HOW LOGIN WORKS ===
- No password needed — TripNest uses OTP login
- User enters their email → receives a 6-digit OTP → enters OTP → logged in
- OTP is valid for 10 minutes
- Register requires only username and email

=== LIVE TOUR DATA (from database, updated in real time) ===
${tourContext}

=== YOUR BEHAVIOR RULES ===
1. Keep ALL replies under 3 sentences unless user specifically asks to list tours
2. When recommending tours DO NOT list all of them — pick the TOP 2-3 most relevant ones only
3. Format a tour recommendation in ONE line like this: 🏔️ "Tour Name" — $price/person ⭐rating
4. Never use markdown bold (**text**) — plain text only
5. Never number list all tours unprompted — only show relevant matches
6. For booking/login questions, give a 1-2 sentence answer with the page link
7. Be warm and short — like a helpful friend texting you, not a brochure
8. If user says "show all tours" or "list all" ONLY THEN show the full list, max 5 per message
9. If asked something unrelated to travel redirect in one sentence
10. End responses with ONE relevant emoji max — not multiple
11. Never say "We have X tours available" as an opener — just get to the point
`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: message },
      ],
      max_tokens: 300,
      temperature: 0.65,
    })

    const reply = completion.choices[0]?.message?.content
      || "Sorry, I couldn't generate a response. Please try again!"

    res.status(200).json({ success: true, reply })

  } catch (err) {
    console.error('Chatbot error:', err.message)
    res.status(500).json({
      success: false,
      reply: "Sorry, I'm having a little trouble right now. Please try again in a moment! 🙏",
    })
  }
}