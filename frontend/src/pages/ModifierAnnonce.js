import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ModifierAnnonce() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: '',
    localisation: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    fetch(`http://127.0.0.1:8000/api/annonces/${id}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFormData({
        titre: data.titre,
        description: data.description,
        prix: data.prix,
        categorie: data.categorie,
        localisation: data.localisation,
      }));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/annonces/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Annonce modifiée avec succès !');
      } else {
        const err = await response.json();
        alert('Erreur : ' + JSON.stringify(err));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Modifier l'annonce</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Titre</label>
          <input type="text" name="titre" value={formData.titre} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #E7E5E4' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '100px', borderRadius: '5px', border: '1px solid #E7E5E4' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Prix (FCFA)</label>
          <input type="number" name="prix" value={formData.prix} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #E7E5E4' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Catégorie</label>
          <select name="categorie" value={formData.categorie} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #E7E5E4' }}>
            <option value="">Choisir une catégorie</option>
            <option value="1">Électronique</option>
            <option value="2">Habillement</option>
            <option value="3">Services</option>
            <option value="4">Immobilier</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Localisation</label>
          <input type="text" name="localisation" value={formData.localisation} onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #E7E5E4' }} required />
        </div>
        <button type="submit"
          style={{ width: '100%', padding: '12px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          Modifier l'annonce
        </button>
      </form>
    </div>
  );
}

export default ModifierAnnonce;