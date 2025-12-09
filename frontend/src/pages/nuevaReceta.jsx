import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recetasService } from '../services/recetasService';
import { chefsService } from '../services/chefsService';
import './NuevaReceta.css';

function NuevaReceta() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    section: '',
    link: '',
    img: '',
    chefId: '',
    estado: 'publicada'  
  });
  
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    cargarChefs();
  }, []);

  const cargarChefs = async () => {
    try {
      const data = await chefsService.getMisChefs();
      setChefs(data);
    } catch (err) {
      console.error('Error al cargar chefs:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.description || !formData.section || !formData.img) {
      setError('Los campos nombre, descripción, categoría e imagen son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const recetaData = {
        ...formData,
        chefId: formData.chefId || null
      };
      
      await recetasService.create(recetaData);
      navigate('/mis-recetas');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la receta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nueva-receta-container">
      <div className="form-container">
        <h1>Nueva Receta</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre de la receta *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Milanesas napolitanas"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu receta..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="section">Categoría *</label>
            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="entradas">Entradas</option>
              <option value="plato principal">Plato Principal</option>
              <option value="postres">Postres</option>
              <option value="bebidas">Bebidas</option>
              <option value="vegano">Vegano</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="chefId">Chef (opcional)</label>
            <select
              id="chefId"
              name="chefId"
              value={formData.chefId}
              onChange={handleChange}
            >
              <option value="">Sin chef asignado</option>
              {chefs.map((chef) => (
                <option key={chef._id} value={chef._id}>
                  {chef.nombre}
                </option>
              ))}
            </select>
            <small>
              ¿No tienes chefs? <a href="/mis-chefs">Crea uno aquí</a>
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="img">URL de la imagen *</label>
            <input
              type="url"
              id="img"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Video de YouTube (opcional)</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado de la receta</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="publicada">Publicada</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/mis-recetas')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Receta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevaReceta;