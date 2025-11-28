import * as services from "../../services/comentarios.service.js"

/**
 * GET /api/comentarios/receta/:recetaId - Obtener comentarios de una receta
 */
export function getComentariosByReceta(req, res) {
    const recetaId = req.params.recetaId;
    
    services.getComentariosByReceta(recetaId)
        .then(comentarios => res.status(200).json(comentarios))
        .catch(err => res.status(500).json({ message: "Error al obtener comentarios" }))
}

/**
 * POST /api/comentarios - Crear comentario (requiere autenticación)
 */
export function crearComentario(req, res) {
    const { texto, recetaId } = req.body;
    const userId = req.usuario.id; 
    
    if (!texto || !recetaId) {
        return res.status(400).json({ message: "Texto y recetaId son obligatorios" });
    }
    
    if (texto.trim().length < 3) {
        return res.status(400).json({ message: "El comentario debe tener al menos 3 caracteres" });
    }
    
    const comentario = {
        texto: texto,
        recetaId: recetaId,
        userId: userId
    };
    
    services.crearComentario(comentario)
        .then(nuevoComentario => res.status(201).json(nuevoComentario))
        .catch(err => res.status(500).json({ message: "Error al crear comentario" }))
}

/**
 * PATCH /api/comentarios/:id - Editar comentario
 */
export async function editarComentario(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    const { texto } = req.body;
    
    if (!texto || texto.trim().length < 3) {
        return res.status(400).json({ message: "El comentario debe tener al menos 3 caracteres" });
    }
    
    try {
        // Verificar que el comentario pertenece al usuario
        const esDelUsuario = await services.esComentarioDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para editar este comentario" 
            });
        }
        
        const comentarioEditado = await services.editarComentario(id, texto);
        res.status(200).json(comentarioEditado);
        
    } catch (err) {
        res.status(500).json({ message: "Error al editar comentario" });
    }
}

/**
 * DELETE /api/comentarios/:id - Eliminar comentario
 */
export async function borrarComentario(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        // Verificar que el comentario pertenece al usuario
        const esDelUsuario = await services.esComentarioDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para eliminar este comentario" 
            });
        }
        
        await services.borrarComentario(id);
        res.status(202).json({ message: "Comentario eliminado correctamente" });
        
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar comentario" });
    }
}