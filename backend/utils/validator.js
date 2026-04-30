// ========== INPUT VALIDATION MIDDLEWARE ==========

// Booking Validation
export const validateBooking = (req, res, next) => {
    const { fullName, guestSize, phone, bookAt } = req.body

    // Validate full name
    if (!fullName || fullName.trim().length < 2) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name must be at least 2 characters' 
        })
    }

    // Validate guest size
    if (!guestSize || guestSize < 1 || guestSize > 100) {
        return res.status(400).json({ 
            success: false, 
            message: 'Guest size must be between 1 and 100' 
        })
    }

    // Validate phone number (10 digits)
    if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Phone must be 10 digits' 
        })
    }

    // Validate booking date (must be future date)
    if (!bookAt) {
        return res.status(400).json({ 
            success: false, 
            message: 'Booking date is required' 
        })
    }

    const bookingDate = new Date(bookAt)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (bookingDate < today) {
        return res.status(400).json({ 
            success: false, 
            message: 'Booking date must be today or in the future' 
        })
    }

    // Sanitize inputs (remove extra spaces)
    req.body.fullName = fullName.trim()
    
    next()
}

// Review Validation
export const validateReview = (req, res, next) => {
    const { reviewText, rating } = req.body

    // Validate review text
    if (!reviewText || reviewText.trim().length < 5) {
        return res.status(400).json({ 
            success: false, 
            message: 'Review must be at least 5 characters' 
        })
    }

    if (reviewText.trim().length > 500) {
        return res.status(400).json({ 
            success: false, 
            message: 'Review must be less than 500 characters' 
        })
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
            success: false, 
            message: 'Rating must be between 1 and 5' 
        })
    }

    // Sanitize review text (remove HTML tags to prevent XSS)
    req.body.reviewText = reviewText.replace(/<[^>]*>/g, '').trim()

    next()
}

// Tour Validation (for admin)
export const validateTour = (req, res, next) => {
    const { title, city, price, maxGroupSize } = req.body

    // Validate title
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ 
            success: false, 
            message: 'Tour title must be at least 3 characters' 
        })
    }

    // Validate city
    if (!city || city.trim().length < 2) {
        return res.status(400).json({ 
            success: false, 
            message: 'City name is required' 
        })
    }

    // Validate price
    if (!price || price < 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Price must be a positive number' 
        })
    }

    // Validate max group size
    if (!maxGroupSize || maxGroupSize < 1 || maxGroupSize > 100) {
        return res.status(400).json({ 
            success: false, 
            message: 'Max group size must be between 1 and 100' 
        })
    }

    // Sanitize inputs
    req.body.title = title.trim()
    req.body.city = city.trim()

    next()
}