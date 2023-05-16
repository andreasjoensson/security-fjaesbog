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
        <Route exact path="/resetkode/:token">
          <ForgotPassword />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>
        <Route path="/profile/:id">
          <Profile />
        </Route>
        <Route path="/forum/:id">
          <Forum />
        </Route>
        <Route exact path="/opretforum">
          <CreateForum />
        </Route>
      </Router>
    </AuthProvider>
  );
}

export default App;
