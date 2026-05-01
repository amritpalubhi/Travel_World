import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { AuthContext } from '../context/AuthContext'
import { BASE_URL } from '../utils/config'
import { useNavigate } from 'react-router-dom'
import '../styles/UserProfile.css'

const UserProfile = () => {
  const { user }          = useContext(AuthContext)
  const navigate          = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!user) return navigate('/login')
    const fetchBookings = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/booking/my/${user.email}`, { credentials: 'include' })
        const data = await res.json()
        if (!res.ok) return setError(data.message || 'Failed to load bookings')
        setBookings(data.data || [])
      } catch { setError('Failed to fetch bookings') }
      finally  { setLoading(false) }
    }
    fetchBookings()
  }, [user, navigate])

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'

  return (
    <section className='profile__section'>
      <Container>
        <Row>
          {/* Left - Profile Card */}
          <Col lg='3' md='4' className='mb-4'>
            <div className='profile__card'>
              <div className='profile__avatar'>
                {user?.photo
                  ? <img src={user.photo} alt='avatar' />
                  : <div className='profile__initials'>{user?.username?.charAt(0).toUpperCase()}</div>
                }
              </div>
              <h5 className='profile__name'>{user?.username}</h5>
              <p className='profile__email'>{user?.email}</p>
              <span className={`profile__badge ${user?.role === 'admin' ? 'admin' : ''}`}>
                {user?.role === 'admin' ? '👑 Admin' : '🧳 Traveller'}
              </span>
              <div className='profile__stats'>
                <div className='profile__stat'>
                  <strong>{bookings.length}</strong>
                  <span>Trips Booked</span>
                </div>
              </div>
              {user?.role === 'admin' && (
                <button className='profile__admin-btn' onClick={() => navigate('/admin')}>
                  Go to Admin Panel →
                </button>
              )}
            </div>
          </Col>

          {/* Right - My Bookings */}
          <Col lg='9' md='8'>
            <h4 className='profile__section-title'>My Bookings</h4>

            {error   && <div className='profile__error'>{error}</div>}
            {loading && <div className='profile__loading'>Loading your bookings...</div>}

            {!loading && bookings.length === 0 && (
              <div className='profile__empty'>
                <span>🌍</span>
                <p>No bookings yet! <a href='/tours'>Explore tours</a> and book your first trip.</p>
              </div>
            )}

            <div className='booking__cards'>
              {bookings.map(b => (
                <div className='booking__card' key={b._id}>
                  <div className='booking__card-header'>
                    <h5>🗺️ {b.tourName}</h5>
                    <span className='booking__status'>Confirmed ✅</span>
                  </div>
                  <div className='booking__card-body'>
                    <div className='booking__info-item'><span>👤 Name</span><strong>{b.fullName}</strong></div>
                    <div className='booking__info-item'><span>👥 Guests</span><strong>{b.guestSize}</strong></div>
                    <div className='booking__info-item'><span>📅 Travel Date</span><strong>{formatDate(b.bookAt)}</strong></div>
                    <div className='booking__info-item'><span>📞 Phone</span><strong>{b.phone}</strong></div>
                    <div className='booking__info-item'><span>🕐 Booked On</span><strong>{formatDate(b.createdAt)}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default UserProfile
