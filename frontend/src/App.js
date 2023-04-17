import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import { AuthProvider } from './context/auth';
import Register from './Register';
import history from './context/history';
import Profile from './Profile';
import Forum from './Forum';
import CreateForum from './Register/CreateForum';
import Search from './Search';

function App() {
  return (
    <AuthProvider>
<Router history={history}>
  <Route exact path="/">
    <Login/>
  </Route>
  <Route exact path="/register">
    <Register/>
  </Route>
  <Route exact path="/dashboard">
    <Dashboard/>
  </Route>
  <Route exact path="/search">
<Search/>
    </Route>
  <Route path="/profile/:id">
    <Profile/>
  </Route>
  <Route path="/forum/:id">
    <Forum/>
  </Route>
  <Route exact path="/opretforum">
    <CreateForum/>
  </Route>
</Router>
</AuthProvider>
  );
}

export default App;
