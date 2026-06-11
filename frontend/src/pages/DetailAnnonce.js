import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DetailAnnonce() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/annonces/${id}/`)
      .then(res => res.json())
      .then(data => setAnnonce(data));
  }, [id]);

  const envoyerMessage = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Connectez-vous pour contacter le vendeur !');
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
        alert('Message envoyé au vendeur !');
        setMessage('');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!annonce) return <p style={{ padding: '20px' }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <div style={{ border: '1px solid #E7E5E4', borderRadius: '8px', overflow: 'hidden' }}>
        {annonce.image ? (
          <img src={annonce.image} alt={annonce.titre} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
        ) : (
          <div style={{ backgroundColor: '#F5F5F4', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#A8A29E' }}>Pas d'image</span>
          </div>
        )}
        <div style={{ padding: '20px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>{annonce.titre}</h1>
          <p style={{ color: '#F97316', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{annonce.prix} FCFA</p>
          <p style={{ color: '#78716C', margin: '0 0 15px 0' }}>📍 {annonce.localisation}</p>
          <p style={{ margin: '0 0 20px 0' }}>{annonce.description}</p>

          <div style={{ backgroundColor: '#FFF7ED', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Contacter le vendeur</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrire votre message..."
              style={{ width: '100%', padding: '10px', height: '100px', borderRadius: '5px', border: '1px solid #E7E5E4', marginBottom: '10px' }}
            />
            <button
              onClick={envoyerMessage}
              style={{ width: '100%', padding: '10px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
            >
              Envoyer le message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailAnnonce;