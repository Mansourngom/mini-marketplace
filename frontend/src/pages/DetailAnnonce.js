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
  const [selectedImg, setSelectedImg] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 15, s: 0 });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/annonces/${id}/`)
      .then(res => res.json())
      .then(data => { setAnnonce(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');

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

  const getImageUrl = (img) => {
    if (!img) return null;
    const trimmed = img.trim();
    return trimmed.startsWith('http') ? trimmed : `http://127.0.0.1:8000${trimmed}`;
  };

  const imageUrl = getImageUrl(annonce.image);
  // Crée un tableau de miniatures (même image répétée si une seule dispo)
  const thumbnails = imageUrl ? [imageUrl, imageUrl, imageUrl] : [];

  // Prix fictif barré (+30%)
  const prixOriginal = Math.round(Number(annonce.prix) * 1.3);
  const reduction = 23;

  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', paddingBottom: '40px' }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'white', padding: '10px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', fontSize: '13px', color: '#888' }}>
          <Link to="/" style={{ color: '#F97316', textDecoration: 'none' }}>Accueil</Link>
          <span> &gt; </span>
          <span style={{ color: '#888' }}>{annonce.categorie_nom || 'Autre'}</span>
          <span> &gt; </span>
          <span style={{ color: '#333' }}>{annonce.titre}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '16px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '16px', alignItems: 'start' }}>

        {/* ── Colonne gauche : galerie ── */}
        <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '16px' }}>
          {/* Image principale */}
          <div style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', minHeight: '360px' }}>
            {imageUrl ? (
              <img
                src={thumbnails[selectedImg]}
                alt={annonce.titre}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{ fontSize: '80px' }}>🖼️</div>
            )}
          </div>

          {/* Miniatures */}
          {thumbnails.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {thumbnails.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  style={{
                    width: '70px', height: '70px', border: selectedImg === i ? '2px solid #F97316' : '1px solid #ddd',
                    borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Colonne centre : infos produit ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Badge catégorie */}
          <div>
            <span style={{ backgroundColor: '#FFF3E0', color: '#F97316', fontSize: '12px', padding: '3px 10px', borderRadius: '2px', fontWeight: '600', border: '1px solid #F97316' }}>
              {annonce.categorie_nom || 'Autre'}
            </span>
          </div>

          {/* Titre */}
          <h1 style={{ fontSize: '20px', fontWeight: '400', color: '#212121', margin: 0, lineHeight: '1.4' }}>
            {annonce.titre}
          </h1>

          {/* Vendeur + localisation */}
          <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>Vendu par <strong style={{ color: '#F97316' }}>{annonce.vendeur_nom}</strong></span>
            <span>📍 {annonce.localisation}</span>
            <span>📅 {new Date(annonce.date_publication).toLocaleDateString('fr-SN')}</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

          {/* Ventes Flash + countdown */}
          <div style={{ backgroundColor: '#C8232C', borderRadius: '4px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>Ventes Flash</span>
            </div>
            <div style={{ color: 'white', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Temps restant :</span>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '3px', fontWeight: '700', fontFamily: 'monospace', fontSize: '15px' }}>
                {pad(timeLeft.h)}h : {pad(timeLeft.m)}m : {pad(timeLeft.s)}s
              </span>
            </div>
          </div>

          {/* Prix */}
          <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: '#C8232C' }}>
                {Number(annonce.prix).toLocaleString()} FCFA
              </span>
              <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through' }}>
                {prixOriginal.toLocaleString()} FCFA
              </span>
              <span style={{ backgroundColor: '#C8232C', color: 'white', fontSize: '13px', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
                -{reduction}%
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0' }}>
              Prix TTC. Frais de livraison non inclus.
            </p>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#212121', marginTop: 0, marginBottom: '10px' }}>
              Description du produit
            </h3>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              {annonce.description}
            </p>
          </div>

          {/* Infos vendeur */}
          <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#FFF3E0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#F97316', fontSize: '20px', flexShrink: 0 }}>
              {annonce.vendeur_nom?.[0]?.toUpperCase() || 'V'}
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 2px' }}>Vendeur officiel</p>
              <p style={{ fontWeight: '700', color: '#212121', margin: 0, fontSize: '15px' }}>{annonce.vendeur_nom}</p>
              <p style={{ fontSize: '12px', color: '#F97316', margin: '2px 0 0', cursor: 'pointer' }}>Voir toutes ses annonces →</p>
            </div>
          </div>
        </div>

        {/* ── Colonne droite : livraison + CTA ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Livraison */}
          <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#212121', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Livraison & Retours
            </h3>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🚚</span>
              <div>
                <p style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 2px', color: '#212121' }}>Livraison Express</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Recevez votre commande sous 24h à Dakar</p>
                <p style={{ fontSize: '13px', color: '#F97316', fontWeight: '600', margin: '4px 0 0' }}>2 000 FCFA</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>📦</span>
              <div>
                <p style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 2px', color: '#212121' }}>Point relais</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Retrait dans un point relais près de chez vous</p>
                <p style={{ fontSize: '13px', color: '#F97316', fontWeight: '600', margin: '4px 0 0' }}>250 FCFA</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>↩️</span>
              <div>
                <p style={{ fontWeight: '600', fontSize: '13px', margin: '0 0 2px', color: '#212121' }}>Retours gratuits</p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Retour accepté sous 7 jours</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {sent && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', padding: '10px 12px', borderRadius: '4px', fontSize: '13px' }}>
                ✅ Votre message a été envoyé !
              </div>
            )}

            <button
              onClick={() => setShowForm(!showForm)}
              style={{ width: '100%', padding: '14px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.3px' }}
            >
              💬 Contacter le vendeur
            </button>

            <button
              style={{ width: '100%', padding: '14px', backgroundColor: 'white', color: '#F97316', border: '2px solid #F97316', borderRadius: '4px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
            >
              ♡ Ajouter aux favoris
            </button>
          </div>

          {/* Formulaire contact */}
          {showForm && (
            <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#212121', margin: '0 0 12px' }}>Envoyer un message</h3>
              <form onSubmit={handleContact}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', padding: '10px', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button type="submit"
                    style={{ flex: 1, padding: '10px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                    Envoyer
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    style={{ padding: '10px 14px', backgroundColor: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Paiement sécurisé */}
          <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px', padding: '12px 16px' }}>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paiement sécurisé</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['💳 Carte', '📱 Wave', '🟠 Orange Money'].map(p => (
                <span key={p} style={{ fontSize: '11px', backgroundColor: '#F5F5F5', padding: '4px 8px', borderRadius: '3px', color: '#555' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailAnnonce;