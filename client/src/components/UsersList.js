import React, {useCallback, useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const UsersList = ({users}) => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {request} = useHttp()
  const [userPicked, setUserPicked] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCheckedArray, setIsCheckedArray] = useState([])

  const putHandler = async (e, a) => {
    const action = a
    const updateUser = isCheckedArray;
    const length = updateUser.length
    if (action ==='block') {

      if (length === 0) {
        return
      }
      if (length === 1) {
        try {
          const userBack = updateUser[0]
          userBack.status = false
          const data = await request('/api/users', 'PUT', {...userBack})
          const bool = auth.userId === userBack._id
          if (bool && !userBack.status) {
            auth.logout()
            return
          }
        } catch (e) {
        }
      }
      if(length > 1) {
        const userBack = updateUser
        let needLogout = false
        userBack.map(
          function (item, i) {
          item.status = false
          const bool = auth.userId === item._id
          if (bool && !item.status) {
            needLogout = true
          }

          return item
          })
        const data = await request('/api/users', 'PUT', {...userBack})
        if (needLogout) {
          auth.logout()
        }
      }
    }
    if (action ==='unblock') {
      if (length === 0) {
        return
      }
      if (length === 1) {
        try {
          const userBack = updateUser[0]
          userBack.status = true
          const data = await request('/api/users', 'PUT', {...userBack})
        } catch (e) {
        }
      }
      if(length > 1) {
        const userBack = updateUser
        userBack.map(
          function (item, i) {
            item.status = true
            return item
          })
        const data = await request('/api/users', 'PUT', {...userBack})
      }
    }

    if (action ==='delete') {
      if (length === 0) {
        return
      }
      if (length === 1) {
        try {
          const userBack = updateUser[0]
          const data = await request('/api/users', 'DELETE', {...userBack})
          const bool = auth.userId === userBack._id
          if (bool) {
            auth.logout()
            return
          }
           history.push('/auth')
        } catch (e) {
        }
      }
      if(length > 1) {
        const userBack = updateUser
        const data = await request('/api/users', 'DELETE', {...userBack})
      }
    }
  }


  useEffect(() => {
    setUserPicked(users)
  });

  useEffect(() => {
    const x = new Array(users.length)
    x.fill(false)
    setIsChecked(x)
  }, [users]);

  const checkedHandler =(e) => {
    const x = isChecked
    x.fill(e.target.checked)
    setIsChecked(x)
    let f
    let y
    if (e.target.checked){
      f = userPicked
      y = [...f]
      setIsCheckedArray(y)
    } else {
      f = []
      y = [...f]
      setIsCheckedArray(y)
    }
  }

  const onItemHintClick = (index, e) => {
    const value = e.target.value
    const checked = e.target.checked
    const checkedArray = isChecked
    checkedArray[index] = checked
    setIsChecked(checkedArray)

    const filterUsers = userPicked
    let f
    let x
    if (checked){
      f = userPicked.filter((item)=> {return item._id === value})
      x = [...isCheckedArray, ...f]
      setIsCheckedArray(x)
    } else {
      f = isCheckedArray.filter((item)=> {return item._id !== value})
      x = [...f]
      setIsCheckedArray(x)
    }
  }

  return (
    <>
      <nav>
        <div className="nav-wrapper cyan lighten-2" style={{ padding: '0 2rem', marginTop: '1rem' }}>
          <span className="brand-logo">Tools</span>
          <ul id="nav-mobile" className="right hide-on-med-and-down df">
            <li className="cursor-pointer">
              <i
                className="material-icons"
                title="block"
                onClick={(e)=> {putHandler(e, 'block')}}
              >block</i>
            </li>
            <li className="cursor-pointer">
              <i
                className="material-icons"
                title="unblock"
                onClick={(e)=> {putHandler(e, 'unblock')}}
              >add</i>
            </li>
            <li className="cursor-pointer">
              <i
                className="material-icons"
                title="delete"
                onClick={(e)=> {putHandler(e, 'delete')}}
              >delete</i>
            </li>
          </ul>
        </div>
      </nav>

      <table>
        <thead>
        <tr>
          <th>
            <label className="df">
              <input type="checkbox" className="filled-in" onChange={(e)=> {checkedHandler(e)}} />
              <span></span>
            </label>
          </th>
          <th>№</th>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Date registration</th>
          <th>Last login</th>
          <th>Status</th>
        </tr>
        </thead>

        <tbody>
        { users.map((user, index) => {
          return (
            <tr key={user._id}>
              <td>
                  <label className="df">
                    <input checked={isChecked[index]} value={user._id} onChange={(e)=> {onItemHintClick(index, e)}} type="checkbox"  className="filled-in" />
                    <span></span>
                  </label>
              </td>
              <td>{index + 1}</td>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.date).toLocaleDateString('ru')}</td>
              <td>{new Date(user.dateLogin).toLocaleDateString('ru', {hour: 'numeric', minute: 'numeric'})} </td>
              <td>{user.status ? 'active' : 'blocked'}</td>
            </tr>
          )
        }) }
        </tbody>
      </table>
    </>
  )
}
