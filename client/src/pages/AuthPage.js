import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {Link} from "react-router-dom";

export const AuthPage = (props) => {
  const isLogin = props.match.path === '/login'
  const pageTitle = isLogin ? 'Sign In' : 'Sign Up'
  const descriptionLink = isLogin ? '/register' : '/login'
  const descriptionText = isLogin ? 'Need an account?' : 'Have an account?'
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, cleanError} = useHttp()
  const [form, setForm] = useState({
    email: '', password: '', name: '',  dateLogin: new Date()
  })

  useEffect( () => {
    message(error)
    cleanError()
  }, [error, message, cleanError])
  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
    console.log(form);
  }
  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      message(data.message)
      loginHandler()
    } catch (e) {
    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId)
      message(data.message)
    } catch (e) {
    }
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>{pageTitle}</h1>
        <div className="card grey lighten-3">
          <div className="card-content black-text">
            {/*<span className="card-title">Enter your credentials</span>*/}
            <Link to={descriptionLink} className="card-title">{descriptionText}</Link>
            {!isLogin &&
            <div className="input-field">
              <input
                id="email"
                name ="name"
                type="text"
                className="validate"
                onChange={changeHandler}
              />
              <label htmlFor="name">Name</label>
            </div> }


            <div className="input-field">
              <input
                id="email"
                name ="email"
                type="text"
                className="validate"
                onChange={changeHandler}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field">
              <input
                id="password"
                name="password"
                type="password"
                className="validate"
                onChange={changeHandler}
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <div className="card-action">
            {isLogin ? <button
              className="btn cyan lighten-2 waves-effect mr-1"
              onClick={loginHandler}
              disabled={loading}
            >Sign in</button> :             <button
              className="btn teal lighten-2 waves-effect"
              onClick={registerHandler}
              disabled={loading}
            >Sign Up</button> }


          </div>
        </div>
      </div>
    </div>
  )
}