import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../../utils/config'
import './AdminDashboard.css'

const ManageUsers = () => {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/users`, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed to load users')
      setUsers(data.data || [])
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async id => {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      const res  = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed')
      setSuccess('User deleted!')
      fetchUsers()
    } catch { setError('Failed to delete') }
  }

  const toggleAdmin = async (id, currentRole) => {
    const newRole   = currentRole === 'admin' ? 'user' : 'admin'
    const action    = newRole === 'admin' ? 'Make Admin' : 'Remove Admin'
    if (!window.confirm(`${action} for this user?`)) return
    try {
      const res  = await fetch(`${BASE_URL}/users/${id}/role`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed to update role')
      setSuccess(`User is now ${newRole}!`)
      fetchUsers()
    } catch { setError('Failed to update role') }
  }

  // auto clear messages
  useEffect(() => {
    if (!success && !error) return
    const t = setTimeout(() => { setSuccess(''); setError('') }, 3000)
    return () => clearTimeout(t)
  }, [success, error])

  return (
    <div>
      <div className='admin__toolbar'>
        <h4 className='admin__section-title' style={{margin:0}}>All Users</h4>
        <span style={{fontSize:'0.85rem', color:'#888'}}>{users.length} total</span>
      </div>

      {error   && <div className='admin__error'>{error}</div>}
      {success && <div className='admin__success'>{success}</div>}

      <div className='admin__stats'>
        <div className='admin__stat-card'><h3>{users.length}</h3><p>Total Users</p></div>
        <div className='admin__stat-card'><h3>{users.filter(u => u.role === 'admin').length}</h3><p>Admins</p></div>
        <div className='admin__stat-card'><h3>{users.filter(u => u.role !== 'admin').length}</h3><p>Regular Users</p></div>
      </div>

      {loading ? (
        <div className='admin__loading'>Loading users...</div>
      ) : (
        <div className='admin__table-wrap'>
          <table className='admin__table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan='4' className='admin__empty'>No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge__role ${u.role === 'admin' ? 'badge__admin' : ''}`}>{u.role}</span></td>
                  <td style={{display:'flex', gap:'8px'}}>
                    <button
                      className={u.role === 'admin' ? 'btn__remove-admin' : 'btn__make-admin'}
                      onClick={() => toggleAdmin(u._id, u.role)}
                    >
                      {u.role === 'admin' ? '⬇ Remove Admin' : '⬆ Make Admin'}
                    </button>
                    {u.role !== 'admin' && (
                      <button className='btn__delete' onClick={() => handleDelete(u._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
