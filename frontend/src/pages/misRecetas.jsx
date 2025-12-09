import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recetasService } from '../services/recetasService';
import RecetaCard from '../components/recetaCard';
import './MisRecetas.css';

function MisRecetas() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMisRecetas();
  }, []);

  const cargarMisRecetas = async () => {
    try {
      setLoading(true);
      const data = await recetasService.getMisRecetas();
      setRecetas(data);
    } catch (err) {
      setError('Error al cargar tus recetas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta receta?')) {
      return;
    }

    try {
      await recetasService.delete(id);
      setRecetas(recetas.filter(r => r._id !== id));
    } catch (err) {
      alert('Error al eliminar la receta');
    }
  };

  if (loading) {
    return <div className="loading">Cargando tus recetas...</div>;
  }

  return (
    <div className="mis-recetas-container">
      <div className="header">
        <h1>Mis Recetas</h1>
        <Link to="/nueva-receta" className="btn-primary">
          + Nueva Receta
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {recetas.length === 0 ? (
        <div className="empty-state">
          <h2>Aún no tienes recetas</h2>
          <p>Crea tu primera receta para empezar a compartir tus creaciones culinarias</p>
          <Link to="/nueva-receta" className="btn-primary">
            Crear mi primera receta
          </Link>
        </div>
      ) : (
        <div className="recetas-grid">
          {recetas.map((receta) => (
            <RecetaCard 
              key={receta._id} 
              receta={receta}
              esPropia={true}
              onEliminar={handleEliminar}
              onActualizar={cargarMisRecetas}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MisRecetas;