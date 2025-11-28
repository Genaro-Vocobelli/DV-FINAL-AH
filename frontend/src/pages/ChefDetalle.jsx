import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chefsService } from '../services/chefsService';
import RecetaCard from '../components/RecetaCard';
import './ChefDetalle.css';

function ChefDetalle() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarChef();
    cargarRecetasDelChef();
  }, [id]);

  const cargarChef = async () => {
    try {
      const data = await chefsService.getById(id);
      setChef(data);
    } catch (err) {
      setError('Error al cargar el chef');
    } finally {
      setLoading(false);
    }
  };

  const cargarRecetasDelChef = async () => {
    try {
      const data = await chefsService.getRecetasByChef(id);
      setRecetas(data.recetas || []);
    } catch (err) {
      console.error('Error al cargar recetas del chef:', err);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!chef) return <div className="error-message">Chef no encontrado</div>;

  return (
    <div className="chef-detalle-container">
      <div className="chef-detalle">
        <div className="chef-header">
          <div className="chef-foto-grande">
            <img src={chef.foto} alt={chef.nombre} />
          </div>
          
          <div className="chef-info-principal">
            <h1>{chef.nombre}</h1>
            <p className="chef-descripcion">{chef.descripcion}</p>
            
            {chef.especialidad && (
              <div className="info-item">
                <strong>Especialidad:</strong> {chef.especialidad}
              </div>
            )}
            
            {chef.experiencia && (
              <div className="info-item">
                <strong>Experiencia:</strong> {chef.experiencia}
              </div>
            )}
          </div>
        </div>

        <div className="recetas-del-chef">
          <h2>Recetas de {chef.nombre} ({recetas.length})</h2>
          
          {recetas.length === 0 ? (
            <p className="no-recetas-chef">Este chef aún no tiene recetas publicadas</p>
          ) : (
            <div className="recetas-grid">
              {recetas.map((receta) => (
                <RecetaCard key={receta._id} receta={receta} />
              ))}
            </div>
          )}
        </div>

        <div className="chef-actions">
          <Link to="/mis-chefs" className="btn-secondary">
            Volver a mis chefs
          </Link>
          <Link to="/" className="btn-secondary">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChefDetalle;