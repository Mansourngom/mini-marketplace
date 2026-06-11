import React, { useState, useEffect } from 'react';

function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/annonces/');
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleRecherche = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/annonces/?search=${recherche}&categorie=${categorie}`
      );
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {/* Barre de recherche */}
      <div style={{ backgroundColor: '#F97316', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', marginBottom: '15px' }}>Mini Marketplace</h1>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: 'none' }}
          />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
          >
            <option value="">Toutes les catégories</option>
            <option value="electronique">Électronique</option>
            <option value="habillement">Habillement</option>
            <option value="services">Services</option>
            <option value="immobilier">Immobilier</option>
          </select>
          <button
            onClick={handleRecherche}
            style={{ padding: '10px 20px', backgroundColor: '#1C1917', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Listing annonces */}
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Dernières annonces</h2>
        {annonces.length === 0 ? (
          <p>Aucune annonce disponible pour le moment.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {annonces.map((annonce) => (
              <div key={annonce.id} style={{ border: '1px solid #E7E5E4', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ backgroundColor: '#F5F5F4', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {annonce.image ? (
                    <img src={annonce.image} alt={annonce.titre} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#A8A29E' }}>Pas d'image</span>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{annonce.titre}</h3>
                  <p style={{ color: '#F97316', fontWeight: 'bold', margin: '0 0 5px 0' }}>{annonce.prix} FCFA</p>
                  <p style={{ color: '#78716C', fontSize: '13px', margin: '0' }}>📍 {annonce.localisation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Accueil;