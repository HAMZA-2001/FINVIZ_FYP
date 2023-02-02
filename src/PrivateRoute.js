import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from './Authentication/context/AuthContext'

// create a wrapper for our current route
function PrivateRoute({children}) {

    const {currentUser} = useAuth()

  return (
    currentUser ? children : <Navigate to="/login"/>
  )
}

// function PrivateRoute({component: Component, ...rest}) {

//     const {currentUser} = useAuth()

//   return (
//     <Route
//     {...rest}
//     render = {props => {
//         return currentUser ? <Component {...props}/> : <Navigate to = "/login"/>
//     }}
//     >

//     </Route>
//   )
// }

export default PrivateRoute