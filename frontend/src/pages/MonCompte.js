import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MonCompte() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('user_role');

  useEffect(() => {
    fetchMesAnnonces();
  }, []);

  const fetchMesAnnonces = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/annonces/mes-annonces/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerAnnonce = async (id) => {
    const token = localStorage.getItem('access_token');
    if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      try {
        await fetch(`http://127.0.0.1:8000/api/annonces/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAnnonces(annonces.filter(a => a.id !== id));
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const clean = image.trim();
    if (clean.startsWith('http')) return clean;
    return `http://127.0.0.1:8000${clean}`;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
      {/* Header compte */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '60px', height: '60px', backgroundColor: '#FFF7ED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#F97316' }}>
          {username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1C1917' }}>{username}</h2>
          <span style={{ backgroundColor: role === 'vendeur' ? '#FFF7ED' : '#EFF6FF', color: role === 'vendeur' ? '#F97316' : '#3B82F6', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>
            {role === 'vendeur' ? '🏪 Vendeur' : '🛍️ Acheteur'}
          </span>
        </div>
        {role === 'vendeur' && (
          <button
            onClick={() => navigate('/nouvelle-annonce')}
            style={{ marginLeft: 'auto', padding: '10px 20px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            + Nouvelle annonce
          </button>
        )}
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1C1917', marginBottom: '16px' }}>
        Mes annonces ({annonces.length})
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#78716C' }}>
          <div style={{ fontSize: '40px' }}>⏳</div>
          <p>Chargement...</p>
        </div>
      ) : annonces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#78716C', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
          <p>Vous n'avez pas encore d'annonces.</p>
          {role === 'vendeur' && (
            <button
              onClick={() => navigate('/nouvelle-annonce')}
              style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              Publier ma première annonce
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {annonces.map((annonce) => (
            <div key={annonce.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ backgroundColor: '#F5F5F4', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {annonce.image ? (
                  <img src={getImageUrl(annonce.image)} alt={annonce.titre} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '40px' }}>🖼️</span>
                )}
              </div>
              <div style={{ padding: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: '#1C1917' }}>{annonce.titre}</h3>
                <p style={{ color: '#F97316', fontWeight: 'bold', marginBottom: '12px' }}>{Number(annonce.prix).toLocaleString()} FCFA</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/modifier-annonce/${annonce.id}`)}
                    style={{ flex: 1, padding: '8px', backgroundColor: '#1C1917', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => supprimerAnnonce(annonce.id)}
                    style={{ flex: 1, padding: '8px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MonCompte;