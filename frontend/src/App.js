import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Accueil from './pages/Accueil';
import DetailAnnonce from './pages/DetailAnnonce';
import MonCompte from './pages/MonCompte';
import NouvelleAnnonce from './pages/NouvelleAnnonce';
import Messages from './pages/Messages';
import ModifierAnnonce from './pages/ModifierAnnonce';

function App() {
  return (
    <Router>
      <nav style={{ backgroundColor: '#F97316', padding: '15px', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Connexion</Link>
        <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Inscription</Link>
        <Link to="/mon-compte" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Mon Compte</Link>
        <Link to="/nouvelle-annonce" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Publier</Link>
        <Link to="/messages" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Messages</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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