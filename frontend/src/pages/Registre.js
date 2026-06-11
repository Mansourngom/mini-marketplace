import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'acheteur',
    telephone: '',
    ville: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie ! Vous pouvez vous connecter.');
      } else {
        alert('Erreur : ' + JSON.stringify(data));
      }
    } catch (error) {
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nom d'utilisateur</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mot de passe</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Rôle</label>
          <select name="role" value={formData.role} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="acheteur">Acheteur</option>
            <option value="vendeur">Vendeur</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Téléphone</label>
          <input type="text" name="telephone" value={formData.telephone} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Ville</label>
          <input type="text" name="ville" value={formData.ville} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#F97316', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;