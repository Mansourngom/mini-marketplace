import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function DetailAnnonce() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/annonces/${id}/`)
      .then(res => res.json())
      .then(data => { setAnnonce(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Connectez-vous pour contacter le vendeur !');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages/envoyer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          annonce: id,
          destinataire: annonce.vendeur,
          contenu: message
        })
      });
      if (response.ok) {
        setSent(true);
        setMessage('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '40px' }}>⏳</div>
      <p>Chargement...</p>
    </div>
  );

  if (!annonce) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <p style={{ fontSize: '40px' }}>😕</p>
      <h2>Annonce introuvable</h2>
      <Link to="/" style={{ color: '#F97316' }}>Retour à l'accueil</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: '#78716C', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#F97316', textDecoration: 'none' }}>Accueil</Link>
        <span> / </span>
        <span>{annonce.titre}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Image */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {annonce.image ? (
            <img src={annonce.image.trim().startsWith('http') ? annonce.image.trim() : `http://127.0.0.1:8000${annonce.image.trim()}`} alt={annonce.titre}
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
              onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', backgroundColor: '#F5F5F4' }}>🖼️</div>
          )}
        </div>

        {/* Détails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Catégorie */}
          <span style={{ backgroundColor: '#FFF7ED', color: '#F97316', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', width: 'fit-content', fontWeight: '500' }}>
            {annonce.categorie_nom || 'Autre'}
          </span>

          {/* Titre */}
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1C1917', margin: 0 }}>{annonce.titre}</h1>

          {/* Prix */}
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#F97316', margin: 0 }}>
            {Number(annonce.prix).toLocaleString()} FCFA
          </p>

          {/* Localisation + date */}
          <div style={{ display: 'flex', gap: '12px', color: '#78716C', fontSize: '14px' }}>
            <span>📍 {annonce.localisation}</span>
            <span>·</span>
            <span>{new Date(annonce.date_publication).toLocaleDateString('fr-SN')}</span>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#1C1917' }}>Description</h3>
            <p style={{ color: '#78716C', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{annonce.description}</p>
          </div>

          {/* Vendeur */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#FFF7ED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#F97316', fontSize: '18px' }}>
              {annonce.vendeur_nom?.[0]?.toUpperCase() || 'V'}
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#78716C', margin: 0 }}>Vendeur</p>
              <p style={{ fontWeight: '600', color: '#1C1917', margin: 0 }}>{annonce.vendeur_nom}</p>
            </div>
          </div>

          {/* Succès message */}
          {sent && (
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
              ✅ Votre message a été envoyé au vendeur !
            </div>
          )}

          {/* Bouton contacter */}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ width: '100%', padding: '14px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            💬 Contacter le vendeur
          </button>

          {/* Formulaire contact */}
          {showForm && (
            <form onSubmit={handleContact} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1C1917' }}>Envoyer un message</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                style={{ width: '100%', border: '1.5px solid #E7E5E4', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button type="submit"
                  style={{ flex: 1, padding: '10px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Envoyer
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '10px 16px', backgroundColor: 'white', color: '#F97316', border: '1.5px solid #F97316', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailAnnonce;