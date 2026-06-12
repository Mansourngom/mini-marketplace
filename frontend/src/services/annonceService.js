import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const annonceService = {
  // GET toutes les annonces avec filtres
  getAll: async (params = {}) => {
    const res = await api.get("/annonces/", { params });
    return res.data;
  },

  // GET une annonce par ID
  getById: async (id) => {
    const res = await api.get(`/annonces/${id}/`);
    return res.data;
  },
};