import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../../utils/config'
import './AdminDashboard.css'

const ManageReviews = () => {
  const [reviews, setReviews]  = useState([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState('')
  const [success, setSuccess]  = useState('')

  const fetchReviews = async () => {
    try {
      const res  = await fetch(`${BASE_URL}/review`, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed to load reviews')
      setReviews(data.data || [])
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleDelete = async id => {
    if (!window.confirm('Delete this review?')) return
    try {
      const res  = await fetch(`${BASE_URL}/review/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed')
      setSuccess('Review deleted!')
      fetchReviews()
    } catch {
      setError('Failed to delete')
    }
  }

  const stars = rating => '⭐'.repeat(Math.round(rating))

  return (
    <div>
      <div className='admin__toolbar'>
        <h4 className='admin__section-title' style={{margin:0}}>All Reviews</h4>
        <span style={{fontSize:'0.85rem', color:'#888'}}>{reviews.length} total</span>
      </div>

      {error   && <div className='admin__error'>{error}</div>}
      {success && <div className='admin__success'>{success}</div>}

      <div className='admin__stats'>
        <div className='admin__stat-card'>
          <h3>{reviews.length}</h3><p>Total Reviews</p>
        </div>
        <div className='admin__stat-card'>
          <h3>
            {reviews.length
              ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
              : '—'}
          </h3>
          <p>Avg Rating</p>
        </div>
        <div className='admin__stat-card'>
          <h3>{reviews.filter(r => r.rating >= 4).length}</h3><p>Positive (4★+)</p>
        </div>
      </div>

      {loading ? (
        <div className='admin__loading'>Loading reviews...</div>
      ) : (
        <div className='admin__table-wrap'>
          <table className='admin__table'>
            <thead>
              <tr>
                <th>User</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan='4' className='admin__empty'>No reviews found</td></tr>
              ) : (
                reviews.map(r => (
                  <tr key={r._id}>
                    <td>{r.username}</td>
                    <td style={{maxWidth:'300px'}}>{r.reviewText}</td>
                    <td>{stars(r.rating)} ({r.rating})</td>
                    <td>
                      <button className='btn__delete' onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageReviews
