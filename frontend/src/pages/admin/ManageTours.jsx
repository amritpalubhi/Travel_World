import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../../utils/config'
import './AdminDashboard.css'

const emptyForm = {
  title: '', city: '', address: '', distance: '',
  photo: '', desc: '', price: '', maxGroupSize: '', featured: false
}

const ManageTours = () => {
  const [tours, setTours]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [preview, setPreview]       = useState('')

  const fetchTours = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/tours`)
      const data = await res.json()
      setTours(data.data || [])
    } catch { setError('Failed to load tours') }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetchTours() }, [])

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: val }))
  }

  // Cloudinary image upload
  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setPreview(URL.createObjectURL(file))
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res  = await fetch(`${BASE_URL}/upload`, { method: 'POST', credentials: 'include', body: formData })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Upload failed')
      setForm(prev => ({ ...prev, photo: data.url }))
      setSuccess('Image uploaded! ✅')
    } catch { setError('Image upload failed') }
    finally  { setUploading(false) }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    const url    = editId ? `${BASE_URL}/tours/${editId}` : `${BASE_URL}/tours`
    const method = editId ? 'PUT' : 'POST'
    try {
      const res  = await fetch(url, {
        method, credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, distance: Number(form.distance), price: Number(form.price), maxGroupSize: Number(form.maxGroupSize) })
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed')
      setSuccess(editId ? 'Tour updated! ✅' : 'Tour created! ✅')
      setShowForm(false); setEditId(null); setForm(emptyForm); setPreview('')
      fetchTours()
    } catch { setError('Something went wrong') }
    finally  { setSubmitting(false) }
  }

  const handleEdit = tour => {
    setForm({ title: tour.title, city: tour.city, address: tour.address, distance: tour.distance,
      photo: tour.photo, desc: tour.desc, price: tour.price, maxGroupSize: tour.maxGroupSize, featured: tour.featured })
    setPreview(tour.photo)
    setEditId(tour._id); setShowForm(true); setError(''); setSuccess('')
    window.scrollTo(0, 0)
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this tour?')) return
    try {
      const res = await fetch(`${BASE_URL}/tours/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Failed')
      setSuccess('Tour deleted!')
      fetchTours()
    } catch { setError('Failed to delete') }
  }

  const cancelForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); setPreview(''); setError('') }

  return (
    <div>
      <div className='admin__toolbar'>
        <h4 className='admin__section-title' style={{margin:0}}>Manage Tours</h4>
        <button className='btn__primary' onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setPreview('') }}>
          + Add New Tour
        </button>
      </div>

      {error   && <div className='admin__error'>{error}</div>}
      {success && <div className='admin__success'>{success}</div>}

      {showForm && (
        <div className='admin__form-card'>
          <h5>{editId ? 'Edit Tour' : 'Add New Tour'}</h5>
          <form className='admin__form' onSubmit={handleSubmit}>
            <input name='title'        placeholder='Tour title'     value={form.title}        onChange={handleChange} required />
            <input name='city'         placeholder='City'           value={form.city}         onChange={handleChange} required />
            <input name='address'      placeholder='Address'        value={form.address}      onChange={handleChange} required />
            <input name='distance'     placeholder='Distance (km)'  value={form.distance}     onChange={handleChange} required type='number' />
            <input name='price'        placeholder='Price ($)'      value={form.price}        onChange={handleChange} required type='number' />
            <input name='maxGroupSize' placeholder='Max group size' value={form.maxGroupSize} onChange={handleChange} required type='number' />

            {/* Cloudinary Image Upload */}
            <div className='full-width'>
              <label style={{fontSize:'0.85rem', color:'#555', marginBottom:'6px', display:'block'}}>
                📷 Tour Photo
              </label>
              <div className='upload__area'>
                <input type='file' accept='image/*' onChange={handleImageUpload} id='photoUpload' style={{display:'none'}} />
                <label htmlFor='photoUpload' className='upload__btn'>
                  {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                </label>
                <span style={{fontSize:'0.78rem', color:'#aaa', marginLeft:'10px'}}>or paste URL below</span>
              </div>
              {preview && <img src={preview} alt='preview' className='upload__preview' />}
              <input name='photo' placeholder='Or paste image URL' value={form.photo} onChange={handleChange} style={{marginTop:'8px'}} />
            </div>

            <textarea name='desc' placeholder='Description' value={form.desc} onChange={handleChange} required className='full-width' />
            <label className='full-width' style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'0.9rem'}}>
              <input type='checkbox' name='featured' checked={form.featured} onChange={handleChange} />
              Featured tour
            </label>
            <div className='admin__form-actions'>
              <button className='btn__primary' type='submit' disabled={submitting || uploading}>
                {submitting ? 'Saving...' : editId ? 'Update Tour' : 'Create Tour'}
              </button>
              <button className='btn__cancel' type='button' onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className='admin__loading'>Loading tours...</div>
      ) : (
        <div className='admin__table-wrap'>
          <table className='admin__table'>
            <thead>
              <tr><th>Photo</th><th>Title</th><th>City</th><th>Price</th><th>Group Size</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr><td colSpan='7' className='admin__empty'>No tours found</td></tr>
              ) : tours.map(tour => (
                <tr key={tour._id}>
                  <td><img src={tour.photo} alt={tour.title} style={{width:'50px', height:'40px', objectFit:'cover', borderRadius:'6px'}} /></td>
                  <td>{tour.title}</td>
                  <td>{tour.city}</td>
                  <td>${tour.price}</td>
                  <td>{tour.maxGroupSize}</td>
                  <td>{tour.featured ? <span className='badge__featured'>Featured</span> : '—'}</td>
                  <td>
                    <button className='btn__edit'   onClick={() => handleEdit(tour)}>Edit</button>
                    <button className='btn__delete' onClick={() => handleDelete(tour._id)}>Delete</button>
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

export default ManageTours
