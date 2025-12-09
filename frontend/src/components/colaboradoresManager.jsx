import { useState } from 'react';
import { recetasService } from '../services/recetasService';
import './colaboradoresManager.css';

function ColaboradoresManager({ receta, esPropia, onActualizar }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAgregarColaborador = async () => {
    setError('');
    setSuccess('');
    
    if (!username.trim()) {
      setError('Debes ingresar un nombre de usuario');
      return;
    }

    setLoading(true);

    try {
      await recetasService.agregarColaborador(receta._id, username);
      setSuccess(`Colaborador ${username} agregado correctamente`);
      setUsername('');
      
      if (onActualizar) {
        onActualizar();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar colaborador');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarColaborador = async (usernameEliminar) => {
    if (!window.confirm(`¿Eliminar a ${usernameEliminar} como colaborador?`)) {
      return;
    }

    try {
      await recetasService.eliminarColaborador(receta._id, usernameEliminar);
      setSuccess(`Colaborador ${usernameEliminar} eliminado`);
      
      if (onActualizar) {
        onActualizar();
      }
    } catch (err) {
      setError('Error al eliminar colaborador');
    }
  };

  const colaboradores = receta.colaboradores || [];

  return (
    <div className="colaboradores-manager">
      <h3>👥 Colaboradores ({colaboradores.length})</h3>

      {colaboradores.length === 0 ? (
        <p className="no-colaboradores">Esta receta no tiene colaboradores aún</p>
      ) : (
        <div className="colaboradores-lista">
          {colaboradores.map((colab, index) => (
            <div key={index} className="colaborador-item">
              <span className="colaborador-username">👤 {colab.username}</span>
              {esPropia && (
                <button 
                  onClick={() => handleEliminarColaborador(colab.username)}
                  className="btn-eliminar-colaborador"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {esPropia && (
        <div className="agregar-colaborador-section">
          <h4>Agregar Colaborador</h4>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              disabled={loading}
            />
            <button 
              onClick={handleAgregarColaborador}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColaboradoresManager;