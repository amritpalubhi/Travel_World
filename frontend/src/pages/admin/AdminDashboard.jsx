import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import ManageTours from './ManageTours'
import ManageBookings from './ManageBookings'
import ManageUsers from './ManageUsers'
import ManageReviews from './ManageReviews'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('tours')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  const tabs = [
    { id: 'tours',    label: 'Manage Tours',    icon: '🗺️' },
    { id: 'bookings', label: 'Bookings',         icon: '📋' },
    { id: 'users',    label: 'Users',            icon: '👥' },
    { id: 'reviews',  label: 'Reviews',          icon: '⭐' },
  ]

  return (
    <div className='admin__layout'>
      <aside className='admin__sidebar'>
        <div className='admin__sidebar-header'>
          <h5>Admin Panel</h5>
          <small>Welcome, {user.username}</small>
        </div>
        <nav className='admin__nav'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin__nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <button className='admin__back-btn' onClick={() => navigate('/home')}>
          ← Back to Site
        </button>
      </aside>

      <main className='admin__content'>
        {activeTab === 'tours'    && <ManageTours />}
        {activeTab === 'bookings' && <ManageBookings />}
        {activeTab === 'users'    && <ManageUsers />}
        {activeTab === 'reviews'  && <ManageReviews />}
      </main>
    </div>
  )
}

export default AdminDashboard
