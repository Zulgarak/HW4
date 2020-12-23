import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

import {UsersList} from '../components/UsersList'

export const UsersPage = () => {

  const [users, setUsers] = useState([])
  const {request} = useHttp()
  // console.log(request);

  const {token} = useContext(AuthContext)

  const fetchUsers = useCallback(async () => {
    try {
      const fetched = await request('/api/users', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setUsers(fetched)
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])


  return (
    <>
      <UsersList users={users}/>
    </>
  )
}