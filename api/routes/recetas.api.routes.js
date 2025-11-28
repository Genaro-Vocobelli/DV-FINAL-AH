import express from "express"
import * as controllers from "../controllers/recetas.api.controllers.js"
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js"

const router = express.Router()

// Rutas públicas (sin autenticación)
router.get("/", controllers.getRecetas)                    // GET /api/recetas - Ver todas

// RUTAS ESPECÍFICAS DEBEN IR ANTES DE /:id
router.get("/mis-recetas", verificarAutenticacion, controllers.getMisRecetas)  // GET /api/recetas/mis-recetas

// Rutas con parámetro ID (van después de rutas específicas)
router.get("/:id", controllers.getRecetaById)             // GET /api/recetas/:id - Ver una

// Rutas protegidas (requieren autenticación)
router.post("/", verificarAutenticacion, controllers.createRecipe)             // POST /api/recetas
router.delete("/:id", verificarAutenticacion, controllers.deleteRecipe)        // DELETE /api/recetas/:id
router.put("/:id", verificarAutenticacion, controllers.reemplazarRecipe)       // PUT /api/recetas/:id
router.patch("/:id", verificarAutenticacion, controllers.actualizarRecipe)     // PATCH /api/recetas/:id

export default router