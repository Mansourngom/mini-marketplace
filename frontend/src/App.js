import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <nav style={{ backgroundColor: '#F97316', padding: '15px', display: 'flex', gap: '20px' }}>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Connexion</Link>
        <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Inscription</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;