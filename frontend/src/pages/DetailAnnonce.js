import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ANNONCES_MOCK } from "../mocks/annonces";

const USE_MOCK = true;

function formatPrix(prix) {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(prix);
}

export default function AnnonceDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [annonce, setAnnonce]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent]         = useState(false);

  useEffect(() => {
    if (USE_MOCK) {
      setTimeout(() => {
        setAnnonce(ANNONCES_MOCK.find((a) => a.id === parseInt(id)) || null);
        setLoading(false);
      }, 300);
    } else {
      import("../services/annonceService").then(({ annonceService }) => {
        annonceService.getById(id).then((data) => {
          setAnnonce(data);
          setLoading(false);
        });
      });
    }
  }, [id]);

  const handleContact = (e) => {
    e.preventDefault();
    // TODO : appeler messageService.send() quand le backend est prêt
    setSent(true);
    setMessage("");
    setShowForm(false);
  };

  // ── Chargement ──
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600
                        rounded-full animate-spin" />
      </div>
    );
  }

  // ── Introuvable ──
  if (!annonce) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-lg font-semibold text-gray-700">Annonce introuvable</h2>
        <Link to="/" className="text-orange-600 hover:underline mt-2 block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-orange-600">Accueil</Link>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{annonce.titre}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── Image ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <img
            src={annonce.image}
            alt={annonce.titre}
            className="w-full aspect-square object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/600?text=Pas+d+image";
            }}
          />
        </div>

        {/* ── Détails ── */}
        <div className="flex flex-col gap-4">

          {/* Catégorie */}
          <span className="inline-block text-xs bg-orange-100 text-orange-700
                           px-2 py-1 rounded-full font-medium w-fit">
            {annonce.categorie?.icon} {annonce.categorie?.nom}
          </span>

          {/* Titre */}
          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            {annonce.titre}
          </h1>

          {/* Prix */}
          <p className="text-3xl font-bold text-orange-600">
            {formatPrix(annonce.prix)}
          </p>

          {/* Ville + date */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>📍 {annonce.localisation}</span>
            <span>·</span>
            <span>
              {new Date(annonce.date_publication).toLocaleDateString("fr-SN")}
            </span>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {annonce.description}
            </p>
          </div>

          {/* Vendeur */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4
                          flex items-center gap-3">
            <div className="w-11 h-11 bg-orange-100 rounded-full flex items-center
                            justify-center flex-shrink-0">
              <span className="text-orange-700 font-bold text-lg">
                {annonce.vendeur?.username?.[0]?.toUpperCase() || "V"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Vendeur</p>
              <p className="font-semibold text-gray-800">
                {annonce.vendeur?.username}
              </p>
            </div>
          </div>

          {/* Message de succès */}
          {sent && (
            <div className="bg-green-50 border border-green-300 text-green-700
                            text-sm px-4 py-3 rounded-lg">
              ✅ Votre message a été envoyé au vendeur !
            </div>
          )}

          {/* Bouton contacter */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium
                       py-3 w-full rounded-lg transition-colors text-base"
          >
            💬 Contacter le vendeur
          </button>

          {/* Formulaire de contact */}
          {showForm && (
            <form
              onSubmit={handleContact}
              className="bg-white rounded-xl border border-gray-100 shadow-sm
                         p-4 flex flex-col gap-3"
            >
              <h3 className="font-semibold text-gray-800">Envoyer un message</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-orange-400
                           text-sm resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium
                             py-2 flex-1 rounded-lg transition-colors text-sm"
                >
                  Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-orange-600 text-orange-600 hover:bg-orange-50
                             font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
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