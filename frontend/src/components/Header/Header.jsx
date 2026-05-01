import React, { useRef, useEffect, useContext } from 'react'
import './Header.css'
import { Container, Row, Button } from 'reactstrap'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AuthContext } from './../../context/AuthContext'

function Header() {
  const nav__links = [
    { path: '/home',  display: 'Home'  },
    { path: '/tours', display: 'Tours' },
  ]

  const headerRef = useRef(null)
  const menuRef   = useRef(null)
  const navigate  = useNavigate()
  const { user, dispatch } = useContext(AuthContext)

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header')
      } else {
        headerRef.current.classList.remove('sticky__header')
      }
    })
  }

  useEffect(() => {
    stickyHeaderFunc()
    return window.removeEventListener('scroll', stickyHeaderFunc)
  })

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu')

  return (
    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className='nav__wrapper d-flex align-item-center justify-content-between'>

            {/* Logo */}
            <div className='logo'>
              <img src={assets.logo} alt='logo' />
            </div>

            {/* Nav Links */}
            <div className='navigation' ref={menuRef} onClick={toggleMenu}>
              <ul className='menu d-flex align-item-center gap-5'>
                {nav__links.map((item, index) => (
                  <li className='nav__item' key={index}>
                    <NavLink to={item.path} className={navClass => navClass.isActive ? 'active__link' : ''}>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side */}
            <div className='nav__right d-flex align-items-center gap-4'>
              <div className='nav__btns d-flex align-items-center gap-4'>
                {user ? (
                  <>
                    {/* Profile link with avatar initial */}
                    <Link to='/profile' className='nav__profile'>
                      <div className='nav__avatar'>{user.username?.charAt(0).toUpperCase()}</div>
                      <span className='nav__username'>{user.username}</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Button className='btn btn-warning btn-sm' onClick={() => navigate('/admin')}>
                        Admin
                      </Button>
                    )}
                    <Button className='btn btn-dark' onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                    <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>
                  </>
                )}
              </div>
              <div className='mobile__menu' onClick={toggleMenu}>
                <i className='ri-menu-line'></i>
              </div>
            </div>

          </div>
        </Row>
      </Container>
    </header>
  )
}

export default Header
