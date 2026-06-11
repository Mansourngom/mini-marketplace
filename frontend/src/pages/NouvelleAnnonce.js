import React, { useState } from 'react';

function NouvelleAnnonce() {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: '',
    localisation: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Connectez-vous pour publier une annonce !');
      return;
    }
    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('description', formData.description);
      data.append('prix', formData.prix);
      data.append('categorie', formData.categorie);
      data.append('localisation', formData.localisation);
      if (image) data.append('image', image);

      const response = await fetch('http://127.0.0.1:8000/api/annonces/creer/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        alert('Annonce publiée avec succès !');
        setFormData({ titre: '', description: '', prix: '', categorie: '', localisation: '' });
        setImage(null);
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
      <h2 style={{ marginBottom: '20px' }}>Publier une annonce</h2>
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
        <div style={{ marginBottom: '15px' }}>
          <label>Image</label>
          <input type="file" onChange={handleImage} accept="image/*"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit"
          style={{ width: '100%', padding: '12px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          Publier l'annonce
        </button>
      </form>
    </div>
  );
}

export default NouvelleAnnonce;