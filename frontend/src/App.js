import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import { AuthProvider } from "./context/auth";
import Register from "./views/Register/Register";
import history from "./context/history";
import Profile from "./views/Profile/Profile";
import Forum from "./views/Forum/Forum";
import CreateForum from "./views/CreateForum/CreateForum";
import Search from "./views/SearchPage/Search";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import ResetKode from "./views/ResetKode/ResetKode";
import { useContext, useEffect } from "react";
import PrivateRoute from "./components/RouteGuard/PrivateRoute";
import { AuthContext } from "./context/auth";
import Admin from "./views/Admin/Admin";
import AdminUsers from "./views/AdminUsers/AdminUsers";

function App() {
  return (
    <AuthProvider>
      <Router history={history}>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/glemtkode">
          <ForgotPassword />
        </Route>
        <Route exact path="/reset/:token">
          <ResetKode />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <PrivateRoute isAuthenticated={true} exact path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={true} exact path="/search">
          <Search />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={true} path="/profile/:id">
          <Profile />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={true} path="/forum/:id">
          <Forum />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={true} exact path="/opretforum">
          <CreateForum />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={true} exact path="/admin">
          <Admin />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={true} exact path="/adminusers">
          <AdminUsers />
        </PrivateRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
