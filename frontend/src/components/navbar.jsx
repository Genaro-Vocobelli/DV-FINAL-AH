import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Recetas del Chef
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Inicio
          </Link>

          {isAuthenticated() ? (
            <>
              <Link to="/mis-recetas" className="navbar-link">
                Mis Recetas
              </Link>
              <Link to="/mis-chefs" className="navbar-link">
                Mis Chefs
              </Link>
              <div className="navbar-user">
                <Link to="/perfil" className="user-name-link">
                  {usuario?.username}
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-register">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;