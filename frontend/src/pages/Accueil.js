import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';

function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch(`${API_URL}/api/annonces/`);
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecherche = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/annonces/?search=${recherche}&categorie=${categorie}`
      );
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
  if (!image) return null;
  const cleanImage = image.trim();
  if (cleanImage.startsWith('http')) return cleanImage;
  return `${API_URL}${cleanImage}`;
};

  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
          Trouvez ce que vous cherchez
        </h1>
        <p style={{ color: '#FED7AA', fontSize: '16px', marginBottom: '30px' }}>
          Des milliers d'annonces près de chez vous
        </p>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher une annonce..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRecherche()}
            style={{ flex: 1, minWidth: '200px', padding: '14px 20px', borderRadius: '30px', border: 'none', fontSize: '15px', outline: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            style={{ padding: '14px 20px', borderRadius: '30px', border: 'none', fontSize: '15px', outline: 'none', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <option value="">Toutes catégories</option>
            <option value="electronique">Électronique</option>
            <option value="habillement">Habillement</option>
            <option value="services">Services</option>
            <option value="immobilier">Immobilier</option>
          </select>
          <button
            onClick={handleRecherche}
            style={{ padding: '14px 28px', backgroundColor: '#1C1917', color: 'white', border: 'none', borderRadius: '30px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Annonces */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1C1917' }}>
            Dernières annonces
          </h2>
          <span style={{ color: '#78716C', fontSize: '14px' }}>{annonces.length} annonce(s)</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#78716C' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            <p>Chargement des annonces...</p>
          </div>
        ) : annonces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#78716C' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
            <p>Aucune annonce disponible pour le moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {annonces.map((annonce) => (
              <div
                key={annonce.id}
                onClick={() => navigate(`/annonce/${annonce.id}`)}
                style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
              >
                <div style={{ backgroundColor: '#F5F5F4', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {annonce.image ? (
                    <img
                      src={getImageUrl(annonce.image)}
                      alt={annonce.titre}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <span style={{ fontSize: '40px', display: annonce.image ? 'none' : 'flex' }}>🖼️</span>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {annonce.titre}
                  </h3>
                  <p style={{ color: '#F97316', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                    {Number(annonce.prix).toLocaleString()} FCFA
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#78716C', fontSize: '13px' }}>📍 {annonce.localisation}</span>
                    <span style={{ backgroundColor: '#FFF7ED', color: '#F97316', fontSize: '11px', padding: '3px 8px', borderRadius: '10px', fontWeight: '500' }}>
                      {annonce.categorie_nom || 'Autre'}
                    </span>
                  </div>
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