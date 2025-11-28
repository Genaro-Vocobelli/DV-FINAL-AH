import express from "express";
import * as controllers from "../controllers/auth.api.controllers.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas públicas
router.post("/register", controllers.register);  // POST /api/auth/register
router.post("/login", controllers.login);        // POST /api/auth/login

// Rutas protegidas (requieren autenticación)
router.get("/perfil", verificarAutenticacion, controllers.getPerfil);              // GET /api/auth/perfil
router.get("/verificar", verificarAutenticacion, controllers.verificarToken);      // GET /api/auth/verificar
router.patch("/perfil", verificarAutenticacion, controllers.actualizarPerfil);     // PATCH /api/auth/perfil
router.patch("/cambiar-password", verificarAutenticacion, controllers.cambiarPassword); // PATCH /api/auth/cambiar-password

export default router;