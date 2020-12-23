import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const Navbar = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <nav>
      <div className="nav-wrapper teal lighten-2" style={{ padding: '0 2rem' }}>
        <span className="brand-logo">HW4</span>
        <ul id="nav-mobile" className="right">
          <li><NavLink to="/users">Users</NavLink></li>
          <li><a href="/" onClick={logoutHandler}>Exit</a></li>
        </ul>
      </div>
    </nav>
  )
}