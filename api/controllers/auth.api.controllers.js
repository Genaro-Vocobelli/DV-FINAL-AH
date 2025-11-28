import * as usuariosService from "../../services/usuarios.service.js";
import { generarToken } from "../../utils/jwt.js";

/**
 * POST /api/auth/register - Registro de nuevo usuario
 */
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'El formato del email no es válido' 
      });
    }
    
    // Crear usuario
    const nuevoUsuario = await usuariosService.crearUsuario({
      username,
      email,
      password
    });
    
    // Generar token
    const token = generarToken({
      id: nuevoUsuario._id,
      email: nuevoUsuario.email,
      username: nuevoUsuario.username
    });
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario,
      token: token
    });
    
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
}

/**
 * POST /api/auth/login - Inicio de sesión
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son obligatorios' 
      });
    }
    
    // Verificar credenciales
    const usuario = await usuariosService.verificarCredenciales(email, password);
    
    // Generar token
    const token = generarToken({
      id: usuario._id,
      email: usuario.email,
      username: usuario.username
    });
    
    res.status(200).json({
      message: 'Login exitoso',
      usuario: usuario,
      token: token
    });
    
  } catch (error) {
    res.status(401).json({ 
      message: error.message 
    });
  }
}

/**
 * GET /api/auth/perfil - Obtener perfil del usuario autenticado
 */
export async function getPerfil(req, res) {
  try {
    // req.usuario viene del middleware de autenticación
    const usuario = await usuariosService.getUserById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }
    
    delete usuario.password;
    
    res.status(200).json(usuario);
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener el perfil',
      error: error.message 
    });
  }
}

/**
 * GET /api/auth/verificar - Verificar si el token es válido
 */
export function verificarToken(req, res) {
  // Si llegó aquí, el token es válido (pasó por el middleware)
  res.status(200).json({
    valido: true,
    usuario: req.usuario
  });
}

/**
 * PATCH /api/auth/perfil - Actualizar perfil del usuario
 */
export async function actualizarPerfil(req, res) {
  try {
    const userId = req.usuario.id;
    const { username, email } = req.body;
    
    // Validaciones
    if (!username && !email) {
      return res.status(400).json({ 
        message: 'Debes proporcionar al menos un campo para actualizar' 
      });
    }
    
    // Actualizar usuario
    const usuarioActualizado = await usuariosService.actualizarUsuario(userId, {
      username,
      email
    });
    
    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado
    });
    
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
}

/**
 * PATCH /api/auth/cambiar-password - Cambiar contraseña
 */
export async function cambiarPassword(req, res) {
  try {
    const userId = req.usuario.id;
    const { newPassword } = req.body;
    
    // Validaciones
    if (!newPassword) {
      return res.status(400).json({ 
        message: 'Debes proporcionar la nueva contraseña' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Cambiar contraseña
    await usuariosService.actualizarUsuario(userId, {
      password: newPassword
    });
    
    res.status(200).json({
      message: 'Contraseña actualizada correctamente'
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al cambiar la contraseña',
      error: error.message 
    });
  }
}