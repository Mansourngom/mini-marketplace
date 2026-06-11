import { CATEGORIES, VILLES } from "../mocks/annonces";

export default function SearchBar({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">

        {/* Barre de recherche par mot-clé */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Rechercher une annonce..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full
                       text-sm focus:outline-none focus:ring-2 focus:ring-orange-400
                       bg-white text-gray-900"
          />
          {filters.search && (
            <button
              onClick={() => set("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                         hover:text-gray-600 text-lg leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres catégorie */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => set("categorie", "")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              !filters.categorie
                ? "bg-orange-600 text-white border-orange-600"
                : "text-gray-600 border-gray-200 hover:border-orange-300 bg-white"
            }`}
          >
            Tout
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                set("categorie", filters.categorie === cat.slug ? "" : cat.slug)
              }
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5
                          rounded-full text-sm border transition-colors ${
                filters.categorie === cat.slug
                  ? "bg-orange-600 text-white border-orange-600"
                  : "text-gray-600 border-gray-200 hover:border-orange-300 bg-white"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.nom}</span>
            </button>
          ))}
        </div>

        {/* Filtre ville + bouton reset */}
        <div className="flex items-center gap-3">
          <select
            value={filters.localisation || ""}
            onChange={(e) => set("localisation", e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
                       focus:outline-none focus:ring-2 focus:ring-orange-400
                       bg-white text-gray-700"
          >
            <option value="">📍 Toutes les villes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {(filters.search || filters.categorie || filters.localisation) && (
            <button
              onClick={() => onChange({ search: "", categorie: "", localisation: "" })}
              className="text-xs text-orange-600 hover:underline"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      </div>
    </div>
  );
}