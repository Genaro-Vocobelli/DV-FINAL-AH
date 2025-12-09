import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recetasService } from '../services/recetasService';
import { comentariosService } from '../services/comentariosService';
import { chefsService } from '../services/chefsService';
import { useAuth } from '../context/AuthContext';
import ColaboradoresManager from '../components/ColaboradoresManager';
import './RecetaDetalle.css';

function RecetaDetalle() {
  const { id } = useParams();
  const { isAuthenticated, usuario } = useAuth();
  const [receta, setReceta] = useState(null);
  const [chef, setChef] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarReceta();
    cargarComentarios();
  }, [id]);

  const cargarReceta = async () => {
    try {
      const data = await recetasService.getById(id);
      setReceta(data);
      
      // Cargar chef si existe
      if (data.chefId) {
        try {
          const chefData = await chefsService.getById(data.chefId);
          setChef(chefData);
        } catch (err) {
          console.error('Error al cargar chef:', err);
        }
      }
    } catch (err) {
      setError('Error al cargar la receta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async () => {
    try {
      const data = await comentariosService.getByReceta(id);
      setComentarios(data);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  };

  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    
    if (!nuevoComentario.trim()) return;

    try {
      await comentariosService.create({
        texto: nuevoComentario,
        recetaId: id
      });
      setNuevoComentario('');
      cargarComentarios();
    } catch (err) {
      alert('Error al crear comentario');
    }
  };

  const handleEliminarComentario = async (comentarioId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;

    try {
      await comentariosService.delete(comentarioId);
      cargarComentarios();
    } catch (err) {
      alert('Error al eliminar comentario');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!receta) return <div className="error-message">Receta no encontrada</div>;

  // Verificar si es propia comparando ObjectId como strings
  const esPropia = usuario && receta.userId && 
    (receta.userId === usuario._id || receta.userId.toString() === usuario._id);

  return (
    <div className="receta-detalle-container">
      <div className="receta-detalle">
        <div className="receta-header">
          <h1>{receta.name}</h1>
          <span className="receta-category">{receta.section}</span>
        </div>

        <div className="receta-imagen-grande">
          <img src={receta.img} alt={receta.name} />
        </div>

        <div className="receta-info">
          <h2>Descripción</h2>
          <p>{receta.description}</p>

          {chef && (
            <div className="chef-info">
              <h3>Chef: {chef.nombre}</h3>
              <p>{chef.descripcion}</p>
              {chef.especialidad && <p><strong>Especialidad:</strong> {chef.especialidad}</p>}
            </div>
          )}

          {receta.link && (
            <div className="video-link">
              <h3>Video de la receta</h3>
              <a href={receta.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Ver en YouTube
              </a>
            </div>
          )}
        </div>

        <div className="comentarios-section">
          <h2>Comentarios ({comentarios.length})</h2>

          {isAuthenticated() ? (
            <div className="comentario-form-container">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows="3"
              />
              <button 
                onClick={handleSubmitComentario}
                className="btn-primary"
                disabled={!nuevoComentario.trim()}
              >
                Publicar comentario
              </button>
            </div>
          ) : (
            <p className="login-message">
              <Link to="/login">Inicia sesión</Link> para comentar
            </p>
          )}

          <div className="comentarios-lista">
            {comentarios.map((comentario) => (
              <div key={comentario._id} className="comentario">
                <div className="comentario-header">
                  <strong>👤 {comentario.usuario.username}</strong>
                  <span className="comentario-fecha">
                    {new Date(comentario.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comentario-texto">{comentario.texto}</p>
                
                {usuario && comentario.usuario._id === usuario._id && (
                  <button 
                    onClick={() => handleEliminarComentario(comentario._id)}
                    className="btn-eliminar-comentario"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <ColaboradoresManager 
          receta={receta} 
          esPropia={esPropia}
          onActualizar={cargarReceta}
        />

        <div className="receta-actions">
          <Link to="/" className="btn-secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecetaDetalle;