import { Link } from 'react-router-dom';
import './RecetaCard.css';

function RecetaCard({ receta, esPropia = false, onEliminar }) {
  return (
    <div className="receta-card">
      <div className="receta-image">
        <img src={receta.img} alt={receta.name} />
        <span className="receta-category">{receta.section}</span>
      </div>
      
      <div className="receta-content">
        <h3>{receta.name}</h3>
        <p className="receta-description">{receta.description}</p>
        
        {receta.chef && (
          <p className="receta-chef">
            Chef: {receta.chef.nombre}
          </p>
        )}

        <div className="receta-actions">
          <Link to={`/receta/${receta._id}`} className="btn-ver">
            Ver Receta
          </Link>
          
          {esPropia && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default RecetaCard;
