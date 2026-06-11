import React, { useState, useEffect } from 'react';

function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Connectez-vous pour voir vos messages !');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/messages/recus/', {
        headers: { 'Authorization': Bearer ${token} }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Mes messages reçus</h2>
      {messages.length === 0 ? (
        <p>Aucun message reçu pour le moment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ border: '1px solid #E7E5E4', borderRadius: '8px', padding: '15px', backgroundColor: msg.lu ? 'white' : '#FFF7ED' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#F97316' }}>De : {msg.expediteur_nom}</span>
                <span style={{ color: '#78716C', fontSize: '13px' }}>{new Date(msg.date_envoi).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: '0', color: '#1C1917' }}>{msg.contenu}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;