import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";



export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, cleanError} = useHttp()
  const [form, setForm] = useState({
    email: '', password: '', dateLogin: new Date()
  })


  useEffect( () => {
    message(error)
    cleanError()
  }, [error, message, cleanError])
  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
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
        <h1>AuthPage</h1>
        {/*<div className="card blue-grey darken-1">*/}
        <div className="card grey lighten-3">
          <div className="card-content black-text">
            <span className="card-title">Authorization</span>
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
            <button
              className="btn cyan lighten-2 waves-effect mr-1"
              onClick={loginHandler}
              disabled={loading}
            >Login</button>
            <button
              className="btn teal lighten-2 waves-effect"
              onClick={registerHandler}
              disabled={loading}
            >Registration</button>
          </div>
        </div>
      </div>
    </div>
  )
}