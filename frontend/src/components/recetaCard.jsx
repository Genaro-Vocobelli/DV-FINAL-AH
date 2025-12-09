import { useState } from "react";
import { Link } from "react-router-dom";
import { recetasService } from "../services/recetasService";
import "./RecetaCard.css";

function RecetaCard({ receta, esPropia = false, onEliminar, onActualizar }) {
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  
  const estadoTexto = {
    publicada: "Publicada",
    borrador: "Borrador",
    archivada: "Archivada"
  };

  const puedeEditar = receta.estado !== "archivada";

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!window.confirm(`¿Cambiar estado a "${estadoTexto[nuevoEstado]}"?`)) {
      return;
    }

    setCambiandoEstado(true);
    
    try {
      await recetasService.cambiarEstado(receta._id, nuevoEstado);
      
      // Si hay función de actualización, llamarla
      if (onActualizar) {
        onActualizar();
      } else {
        // Si no, recargar la página
        window.location.reload();
      }
    } catch (err) {
      alert("Error al cambiar el estado");
    } finally {
      setCambiandoEstado(false);
    }
  };

  return (
    <div className={`receta-card ${receta.estado === 'archivada' ? 'receta-archivada' : ''}`}>
      <div className="receta-image">
        <img src={receta.img} alt={receta.name} />
        <span className="receta-category">{receta.section}</span>
        {receta.estado && (
          <span className={`estado-badge estado-${receta.estado}`}>
            {estadoTexto[receta.estado] || receta.estado}
          </span>
        )}
      </div>

      <div className="receta-content">
        <h3>{receta.name}</h3>
        <p className="receta-description">{receta.description}</p>

        {receta.chef && (
          <p className="receta-chef">👨‍🍳 Chef: {receta.chef.nombre}</p>
        )}

        {/* Selector de estado para recetas propias */}
        {esPropia && (
          <div className="cambiar-estado-section">
            <label>Estado actual: <strong>{estadoTexto[receta.estado]}</strong></label>
            <div className="estado-buttons">
              {receta.estado !== "publicada" && (
                <button 
                  onClick={() => handleCambiarEstado("publicada")}
                  className="btn-estado btn-estado-publicada"
                  disabled={cambiandoEstado}
                >
                  ✓ Publicar
                </button>
              )}
              {receta.estado !== "borrador" && (
                <button 
                  onClick={() => handleCambiarEstado("borrador")}
                  className="btn-estado btn-estado-borrador"
                  disabled={cambiandoEstado}
                >
                  📝 Borrador
                </button>
              )}
              {receta.estado !== "archivada" && (
                <button 
                  onClick={() => handleCambiarEstado("archivada")}
                  className="btn-estado btn-estado-archivada"
                  disabled={cambiandoEstado}
                >
                  📦 Archivar
                </button>
              )}
            </div>
          </div>
        )}

        {receta.estado === 'archivada' && esPropia && (
          <div className="alerta-archivada">
            ⚠️ Receta archivada - Cambia el estado para poder editarla
          </div>
        )}

        <div className="receta-actions">
          <Link to={`/receta/${receta._id}`} className="btn-ver">
            Ver Receta
          </Link>

          {esPropia && (
            <>
              {puedeEditar ? (
                <>
                  <Link to={`/editar-receta/${receta._id}`} className="btn-editar">
                    Editar
                  </Link>
                  <button
                    onClick={() => onEliminar(receta._id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <span className="texto-bloqueado">
                  ⚠️ Edición bloqueada (archivada)
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecetaCard;