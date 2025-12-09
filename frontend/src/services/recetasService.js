import api from "./api";

export const recetasService = {
  // Obtener todas las recetas (público)
  getAll: async () => {
    const response = await api.get("/recetas");
    return response.data;
  },

  // Obtener receta por ID
  getById: async (id) => {
    const response = await api.get(`/recetas/${id}`);
    return response.data;
  },

  // Obtener MIS recetas (requiere auth)
  getMisRecetas: async () => {
    const response = await api.get("/recetas/mis-recetas");
    return response.data;
  },

  // Crear receta (requiere auth)
  create: async (recetaData) => {
    const response = await api.post("/recetas", recetaData);
    return response.data;
  },

  // Actualizar receta (requiere auth)
  update: async (id, recetaData) => {
    const response = await api.put(`/recetas/${id}`, recetaData);
    return response.data;
  },

  // Eliminar receta (requiere auth)
  delete: async (id) => {
    const response = await api.delete(`/recetas/${id}`);
    return response.data;
  },

  // Buscar recetas
  search: async (query) => {
    const response = await api.get(`/recetas?search=${query}`);
    return response.data;
  },
  // Agregar colaborador
  agregarColaborador: async (recetaId, username) => {
    const response = await api.post(`/recetas/${recetaId}/colaboradores`, {
      username,
    });
    return response.data;
  },

  // Eliminar colaborador
  eliminarColaborador: async (recetaId, username) => {
    const response = await api.delete(
      `/recetas/${recetaId}/colaboradores/${username}`
    );
    return response.data;
  },
  cambiarEstado: async (id, estado) => {
    const response = await api.patch(`/recetas/${id}/estado`, { estado });
    return response.data;
  }
};
