import Booking from '../models/Booking.js'
//create new booking
export const createBooking = async (req,res) => {
    const newBooking = new Booking(req.body)
    try {
        const savedBooking = await newBooking.save()
        res.status(200)
        .json({
            success:true,
            message:'Your tour is booked',
            data:savedBooking
        })
        
    } catch (err) {
        // console.error(err);
        res.status(500)
        .json({
        success:false,
        message:'Internal server error'
        })
        
    }

}
//get single booking
export const getBooking = async(req,res) =>{
    const id = req.params.id 
    try {
        const book = await Booking.findById(id)

        res
        .status(200)
        .json({
            success:true,
            message:'successful',
            data:book
        })
        
    } catch (err) {
        res
        .status(404)
        .json({
        success:true,
        message:'not found'
        })
    }
}

/// Get all bookings (admin) or filter by user email for profile page
export const getAllBooking = async (req, res) => {
  try {
    const { email } = req.query

    // If email is provided → filter by userEmail
    const filter = email ? { userEmail: email } : {}

    const bookings = await Booking.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Bookings found',
      data: bookings
    })
  } catch (err) {
    console.error('Get bookings error:', err.message)
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' })
  }
}
// Get bookings for currently logged-in user (profile page)
export const getUserBookings = async (req, res) => {
  try {
    // Prefer query param; fall back to token if present
    const userEmail = req.query.email || req.user?.email

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email not found' })
    }

    const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'User bookings found',
      data: bookings
    })
  } catch (err) {
    console.error('Get user bookings error:', err.message)
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings' })
  }
}