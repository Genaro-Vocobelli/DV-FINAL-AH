import express from "express"
import * as controllers from "../controllers/comentarios.api.controllers.js"
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js"

const router = express.Router()

// Ruta pública - Ver comentarios de una receta
router.get("/receta/:recetaId", controllers.getComentariosByReceta)

// Rutas protegidas - Crear, editar y eliminar comentarios
router.post("/", verificarAutenticacion, controllers.crearComentario)
router.patch("/:id", verificarAutenticacion, controllers.editarComentario)
router.delete("/:id", verificarAutenticacion, controllers.borrarComentario)

export default router