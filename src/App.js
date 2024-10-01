import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import BusMap from './components/BusMap/BusMap';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Login from './components/Auth/Login';
import { auth } from './config/firebaseConfig';
import Settings from './components/Settings/Settings';

const ProtectedRoute = ({ element }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return;
  }

  return isLoggedIn ? element : <Navigate to="/login" />;
};

const UnprotectedRoute = ({ element }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setIsEmailVerified(user.emailVerified);
      } else {
        setIsLoggedIn(false);
        setIsEmailVerified(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return;
  }

  return <element.type {...element.props} emailVerified={isEmailVerified} />;
};

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ height: "calc(100vh - 60px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UnprotectedRoute element={<Login />} />} />
          <Route path="/bus" element={<UnprotectedRoute element={<BusMap />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
