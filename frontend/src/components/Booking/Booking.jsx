import React, { useContext, useState } from 'react'
import './Booking.css'
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { BASE_URL } from '../../utils/config'

// 👇 Replace this with your actual Razorpay test Key ID
const RAZORPAY_KEY = 'rzp_test_Sk3SbGUvfvrMT0'

const loadRazorpayScript = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true) // already loaded
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

const Booking = ({ tour, avgRating }) => {
  const { price, reviews = [], title } = tour || {}
  const navigate = useNavigate()
  const { user }  = useContext(AuthContext)

  const [booking, setBooking] = useState({
    userId:    user?._id   || '',
    userEmail: user?.email || '',
    tourName:  title       || '',
    fullName:  '',
    phone:     '',
    guestSize: 1,
    bookAt:    '',
  })
  const [paying, setPaying] = useState(false)

  const serviceFee  = 10
  const totalAmount = Number(price) * Number(booking.guestSize) + serviceFee

  const handleChange = e =>
    setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }))

  const saveBooking = async () => {
    const res = await fetch(`${BASE_URL}/booking`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify({ ...booking, totalAmount }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
  }

  const handleClick = async e => {
    e.preventDefault()

    if (!user) return alert('Please sign in first!')

    // Validate fields
    if (!booking.fullName || !booking.phone || !booking.bookAt || !booking.guestSize) {
      return alert('Please fill in all fields!')
    }

    setPaying(true)

    try {
      // Step 1 — Create Razorpay order on backend
      const orderRes = await fetch(`${BASE_URL}/payment/create-order`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ amount: totalAmount }),
      })
      const orderData = await orderRes.json()
      if (!orderData.success) {
        setPaying(false)
        return alert('Could not initiate payment. Try again.')
      }

      // Step 2 — Load Razorpay checkout script
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setPaying(false)
        return alert('Razorpay failed to load. Check your internet connection.')
      }

      // Step 3 — Open Razorpay payment popup
      const options = {
        key:         RAZORPAY_KEY,
        amount:      orderData.data.amount,
        currency:    'INR',
        name:        'Travel World',
        description: `Booking: ${title}`,
        order_id:    orderData.data.id,

        handler: async response => {
          // Step 4 — Verify payment signature on backend
          const verifyRes = await fetch(`${BASE_URL}/payment/verify`, {
            method:      'POST',
            headers:     { 'Content-Type': 'application/json' },
            credentials: 'include',
            body:        JSON.stringify(response),
          })
          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            // Step 5 — Save booking to database
            try {
              await saveBooking()
              navigate('/thank-you')
            } catch (err) {
              alert('Payment done but booking save failed: ' + err.message)
            }
          } else {
            alert('Payment verification failed! Contact support.')
          }
        },

        prefill: {
          name:    booking.fullName,
          email:   user?.email || '',
          contact: booking.phone,
        },

        theme: { color: '#faa935' },

        modal: {
          ondismiss: () => {
            setPaying(false)
            alert('Payment cancelled.')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      alert('Something went wrong: ' + err.message)
      setPaying(false)
    }
  }

  return (
    <div className='booking'>
      <div className='booking__top d-flex align-items-center justify-content-between'>
        <h3>${price}<span>/per person</span></h3>
        <span className='tour__rating d-flex align-item-center'>
          <i className='ri-star-s-fill'> </i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      {/* Booking Form */}
      <div className='booking__form'>
        <h5>Information</h5>
        <Form className='booking__info-form' onSubmit={handleClick}>
          <FormGroup>
            <input type='text'   placeholder='Full Name' id='fullName' required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type='tel'    placeholder='Phone'     id='phone'    required onChange={handleChange} />
          </FormGroup>
          <FormGroup className='d-flex align-item-center gap-3'>
            <input type='date'   id='bookAt'    required onChange={handleChange} />
            <input type='number' placeholder='Guests' id='guestSize' required min={1} onChange={handleChange} />
          </FormGroup>
        </Form>
      </div>

      {/* Booking Summary */}
      <div className='booking__bottom'>
        <ListGroup>
          <ListGroupItem className='border-0 px-0'>
            <h5>${price} × {booking.guestSize} person(s)</h5>
            <span>${Number(price) * Number(booking.guestSize)}</span>
          </ListGroupItem>
          <ListGroupItem className='border-0 px-0'>
            <h5>Service charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className='border-0 px-0 total'>
            <h5>Total</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
        </ListGroup>

        <Button
          className='btn primary__btn w-100 mt-4'
          onClick={handleClick}
          disabled={paying}
        >
          {paying ? '⏳ Processing...' : '💳 Pay & Book Now'}
        </Button>
      </div>
    </div>
  )
}

export default Booking
