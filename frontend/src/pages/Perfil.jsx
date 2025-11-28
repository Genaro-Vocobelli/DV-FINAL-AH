import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './Perfil.css';

function Perfil() {
  const { usuario } = useAuth();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (usuario) {
      setFormData({
        username: usuario.username || '',
        email: usuario.email || ''
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await authService.updatePerfil(formData);
      
      // Actualizar el estado local del usuario en el contexto
      if (data.usuario) {
        // Actualizar localStorage
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        // Recargar para que se actualice el contexto
        window.location.reload();
      }
      
      setSuccess('Perfil actualizado correctamente');
      setModoEdicion(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(passwordData.newPassword);
      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setCambiarPassword(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h1>Mi Perfil</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!modoEdicion ? (
          <div className="perfil-info">
            <div className="info-group">
              <label>Nombre de usuario:</label>
              <p>{usuario?.username}</p>
            </div>

            <div className="info-group">
              <label>Email:</label>
              <p>{usuario?.email}</p>
            </div>

            <div className="info-group">
              <label>Fecha de registro:</label>
              <p>{usuario?.createdAt ? new Date(usuario.createdAt).toLocaleDateString() : 'No disponible'}</p>
            </div>

            <div className="perfil-actions">
              <button 
                onClick={() => setModoEdicion(true)}
                className="btn-primary"
              >
                Editar Perfil
              </button>
              <button 
                onClick={() => setCambiarPassword(!cambiarPassword)}
                className="btn-secondary"
              >
                {cambiarPassword ? 'Cancelar cambio de contraseña' : 'Cambiar Contraseña'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="perfil-form">
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button"
                onClick={() => setModoEdicion(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}

        {cambiarPassword && (
          <div className="password-section">
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordSubmit} className="perfil-form">
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;