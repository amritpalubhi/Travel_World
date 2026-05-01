import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../../utils/config'
import './AdminDashboard.css'

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/booking`, { credentials: 'include' })
        const data = await res.json()
        if (!res.ok) return setError(data.message || 'Failed to load bookings')
        setBookings(data.data || [])
      } catch {
        setError('Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const formatDate = dateStr => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div>
      <div className='admin__toolbar'>
        <h4 className='admin__section-title' style={{margin:0}}>All Bookings</h4>
        <span style={{fontSize:'0.85rem', color:'#888'}}>{bookings.length} total</span>
      </div>

      {error && <div className='admin__error'>{error}</div>}

      {loading ? (
        <div className='admin__loading'>Loading bookings...</div>
      ) : (
        <>
          <div className='admin__stats'>
            <div className='admin__stat-card'>
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
            <div className='admin__stat-card'>
              <h3>{new Set(bookings.map(b => b.userEmail)).size}</h3>
              <p>Unique Customers</p>
            </div>
            <div className='admin__stat-card'>
              <h3>{bookings.reduce((acc, b) => acc + (b.guestSize || 0), 0)}</h3>
              <p>Total Guests</p>
            </div>
          </div>

          <div className='admin__table-wrap'>
            <table className='admin__table'>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Tour</th>
                  <th>Guests</th>
                  <th>Phone</th>
                  <th>Book Date</th>
                  <th>Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan='7' className='admin__empty'>No bookings yet</td></tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.fullName}</td>
                      <td>{booking.userEmail || '—'}</td>
                      <td>{booking.tourName}</td>
                      <td>{booking.guestSize}</td>
                      <td>{booking.phone}</td>
                      <td>{formatDate(booking.bookAt)}</td>
                      <td>{formatDate(booking.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default ManageBookings
