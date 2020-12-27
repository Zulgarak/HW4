import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from "./pages/AuthPage";
import {UsersPage} from "./pages/UsersPage";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/users" exact>
          <UsersPage />
        </Route>
        <Redirect to="/users" />
      </Switch>
    )
  }
  return (
    <Switch>
      {/*<Route path="/" exact>*/}
        {/*<AuthPage />*/}
      {/*</Route>*/}
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Redirect to="/login" />
    </Switch>
  )
}