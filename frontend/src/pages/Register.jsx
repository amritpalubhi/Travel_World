import React, {useState, useContext} from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Register.css'
import { assets } from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { BASE_URL } from '../utils/config'

const Register = () => {

  const [credentials, setCredentials] = useState({
    username: '',
    email: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const {dispatch} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = e => {
    setCredentials(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  const handleClick = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const result = await res.json()

      if(!res.ok) {
        // Error case
        setMessage(result.message || 'Registration failed. Please try again.')
        setMessageType('error')
        setLoading(false)
        return
      }

      // Success case
      dispatch({type: 'REGISTER_SUCCESS'})
      setMessage('Registration successful! Redirecting to login...')
      setMessageType('success')
      setLoading(false)
      
      // 2 seconds baad redirect
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      console.error('Registration error:', err)
      setMessage('Network error. Please check your connection and try again.')
      setMessageType('error')
      setLoading(false)
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' className='m-auto'>
            <div className='login__container d-flex justify-content-between'>
              <div className='login__img'>
                <img src={assets.registerImg} alt=''/>
              </div>

              <div className='login__form'>
                <div className='user'>
                  <img src={assets.userIcon} alt=''/>
                </div>
                <h2>Register</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input 
                      type='text' 
                      placeholder='Username' 
                      required 
                      id='username' 
                      value={credentials.username}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <input 
                      type='email' 
                      placeholder='Email' 
                      required 
                      id='email' 
                      value={credentials.email}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <Button 
                    className='btn secondary__btn auth__btn' 
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                {/* Show message if exists */}
                {message && (
                  <div className={messageType === 'success' ? 'success__msg' : 'error__msg'}>
                    {message}
                  </div>
                )}

                <p>Already have an account? <Link to='/login'>Login</Link></p>
                
                <p className='info__msg'>
                  <small>After registration, you'll login using OTP sent to your email.</small>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Register