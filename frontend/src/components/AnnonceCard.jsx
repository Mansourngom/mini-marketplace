import { Link } from "react-router-dom";

function formatPrix(prix) {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(prix);
}

function formatDate(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return `Il y a ${diff} j`;
}

export default function AnnonceCard({ annonce }) {
  return (
    <Link
      to={`/annonce/${annonce.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100
                 hover:shadow-md transition-all duration-200 block overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={annonce.image}
          alt={annonce.titre}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=Image";
          }}
        />
        {/* Badge catégorie */}
        <span className="absolute top-2 left-2 bg-white/90 text-xs font-medium
                         px-2 py-0.5 rounded-full text-gray-700 shadow-sm">
          {annonce.categorie?.icon} {annonce.categorie?.nom}
        </span>
      </div>

      {/* Infos */}
      <div className="p-3">
        {/* Titre */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-snug mb-1">
          {annonce.titre}
        </h3>
        {/* Prix */}
        <p className="text-orange-600 font-bold text-base">
          {formatPrix(annonce.prix)}
        </p>
        {/* Ville + date */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1.5">
          <span>📍 {annonce.localisation}</span>
          <span>{formatDate(annonce.date_publication)}</span>
        </div>
      </div>
    </Link>
  );
}