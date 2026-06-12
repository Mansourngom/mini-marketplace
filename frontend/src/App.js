import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Accueil from './pages/Accueil';
import DetailAnnonce from './pages/DetailAnnonce';
import MonCompte from './pages/MonCompte';
import NouvelleAnnonce from './pages/NouvelleAnnonce';
import Messages from './pages/Messages';
import ModifierAnnonce from './pages/ModifierAnnonce';

function Navbar() {
  
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <nav style={{ backgroundColor: '#F97316', padding: '0 20px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

        {/* Logo */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>
          🛒 Mini Marketplace
        </Link>

        {/* Menu */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Accueil</Link>
          {token ? (
            <>
              {role === 'vendeur' && (
                <Link to="/nouvelle-annonce" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Publier</Link>
              )}
              <Link to="/mon-compte" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                👤 {username}
              </Link>
              <Link to="/messages" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Messages</Link>
              <button onClick={handleLogout} style={{ backgroundColor: '#1C1917', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Connexion</Link>
              <Link to="/register" style={{ backgroundColor: '#1C1917', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Accueil /> : <Login />} />
        <Route path="/login" element={token ? <Accueil /> : <Login />} />
        <Route path="/register" element={token ? <Accueil /> : <Register />} />
        <Route path="/annonce/:id" element={<DetailAnnonce />} />
        <Route path="/mon-compte" element={<MonCompte />} />
        <Route path="/nouvelle-annonce" element={<NouvelleAnnonce />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/modifier-annonce/:id" element={<ModifierAnnonce />} />
      </Routes>
    </Router>
  );
}

export default App;