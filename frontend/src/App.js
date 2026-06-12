import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Accueil from './pages/Accueil';
import DetailAnnonce from './pages/DetailAnnonce';
import MonCompte from './pages/MonCompte';
import NouvelleAnnonce from './pages/NouvelleAnnonce';
import Messages from './pages/Messages';
import ModifierAnnonce from './pages/ModifierAnnonce';

const navLinkStyle = {
  color: 'rgba(255,255,255,0.92)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '0.4px',
  padding: '6px 4px',
  borderBottom: '2px solid transparent',
  transition: 'color 0.2s, border-color 0.2s',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

function NavLink({ to, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        ...navLinkStyle,
        color: hovered ? 'white' : 'rgba(255,255,255,0.88)',
        borderBottom: hovered ? '2px solid white' : '2px solid transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

function Navbar() {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  const username = localStorage.getItem('username');
  const [logoutHovered, setLogoutHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <>
      {/* Barre supérieure fine */}
      <div style={{
        backgroundColor: '#ea6a0a',
        padding: '5px 20px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '16px',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontFamily: "'Segoe UI', sans-serif", letterSpacing: '0.3px' }}>
          📍 Dakar, Sénégal
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontFamily: "'Segoe UI', sans-serif" }}>
          Service client : +221 33 000 00 00
        </span>
      </div>

      {/* Navbar principale */}
      <nav style={{
        background: 'linear-gradient(135deg, #F97316 0%, #fb8c2f 100%)',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 3px 12px rgba(249,115,22,0.35)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>

          {/* Logo */}
          <Link to="/" style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}>
              🛒
            </div>
            <div>
              <div style={{
                fontSize: '17px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                lineHeight: '1.1',
              }}>
                Mini Marché
              </div>
              <div style={{
                fontSize: '9px',
                letterSpacing: '2px',
                color: 'rgba(255,255,255,0.75)',
                textTransform: 'uppercase',
                fontWeight: '600',
              }}>
                Marketplace
              </div>
            </div>
          </Link>

          {/* Menu */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <NavLink to="/">Accueil</NavLink>

            {token ? (
              <>
                {role === 'vendeur' && (
                  <NavLink to="/nouvelle-annonce">
                    ✦ Publier
                  </NavLink>
                )}
                <NavLink to="/mon-compte">
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                    }}>
                      {username?.[0]?.toUpperCase() || 'U'}
                    </span>
                    {username}
                  </span>
                </NavLink>
                <NavLink to="/messages">💬 Messages</NavLink>
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => setLogoutHovered(true)}
                  onMouseLeave={() => setLogoutHovered(false)}
                  style={{
                    backgroundColor: logoutHovered ? 'white' : 'rgba(0,0,0,0.18)',
                    color: logoutHovered ? '#F97316' : 'white',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    padding: '7px 18px',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '0.3px',
                    fontFamily: "'Segoe UI', sans-serif",
                    transition: 'all 0.2s',
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Connexion</NavLink>
                <Link
                  to="/register"
                  style={{
                    backgroundColor: 'white',
                    color: '#F97316',
                    textDecoration: 'none',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    fontWeight: '800',
                    letterSpacing: '0.3px',
                    fontFamily: "'Segoe UI', sans-serif",
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    transition: 'transform 0.15s',
                  }}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
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