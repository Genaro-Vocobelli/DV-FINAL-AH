import * as services from "../../services/recetas.service.js"

export function getRecetas(req, res) {
    // Permitir filtrar por usuario desde query params
    const filter = { ...req.query };
    
    services.getRecetas(filter)
        .then(recetas => res.status(200).json(recetas))
        .catch(err => res.status(500).json({ message: "Error al obtener recetas" }))
}

export function getRecetaById(req, res) {
    const id = req.params.id
    services.getRecetaById(id)
        .then(receta => {
            if (receta) {
                res.status(200).json(receta)
            } else {
                res.status(404).json({ message: "Recurso no encontrado" })
            }
        })
        .catch(err => res.status(500).json({ message: "Error al obtener receta" }))
}

//  Obtener solo las recetas del usuario autenticado
export function getMisRecetas(req, res) {
    // req.usuario viene del middleware de autenticación
    const userId = req.usuario.id;
    
    services.getRecetas({ userId: userId })
        .then(recetas => res.status(200).json(recetas))
        .catch(err => res.status(500).json({ message: "Error al obtener tus recetas" }))
}

export function createRecipe(req, res) {
    //  Agregar userId del usuario autenticado
    const receta = {
        name: req.body.name,
        description: req.body.description,
        section: req.body.section,
        link: req.body.link,
        img: req.body.img,
        chefId: req.body.chefId,
        userId: req.usuario.id 
    }
    
    // Validaciones
    if (!receta.name || !receta.description || !receta.section || !receta.img) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    
    services.guardarReceta(receta)
        .then((nuevoReceta) => res.status(201).json(nuevoReceta))
        .catch(err => res.status(500).json({ message: "Error al crear receta" }))
}

export async function deleteRecipe(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        //  Verificar que la receta pertenece al usuario
        const esDelUsuario = await services.esRecetaDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para eliminar esta receta" 
            });
        }
        
        await services.borrarReceta(id);
        res.status(202).json({ message: `La receta se eliminó correctamente.` });
        
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar receta" });
    }
}

export async function reemplazarRecipe(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        //  Verificar que la receta pertenece al usuario
        const esDelUsuario = await services.esRecetaDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para editar esta receta" 
            });
        }
        
        const receta = {
            id: id,
            name: req.body.name,
            description: req.body.description,
            section: req.body.section,
            link: req.body.link,
            img: req.body.img,
            chefId: req.body.chefId,
            userId: userId
        }
        
        const recetaEditado = await services.editarReceta(receta);
        res.status(202).json(recetaEditado);
        
    } catch (err) {
        res.status(500).json({ message: "No se pudo actualizar." });
    }
}

export async function actualizarRecipe(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        //  Verificar que la receta pertenece al usuario
        const esDelUsuario = await services.esRecetaDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para editar esta receta" 
            });
        }
        
        const receta = {
            id: id,
            name: req.body.name,
            description: req.body.description,
            section: req.body.section,
            link: req.body.link,
            img: req.body.img,
            chefId: req.body.chefId
        }
        
        const recetaEditado = await services.actualizarRecipe(receta);
        res.status(202).json(recetaEditado);
        
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar" });
    }
}

export function getRecetasConChef(req, res) {
    services.getRecetasConChef()
        .then(recetas => res.status(200).json(recetas))
        .catch(err => res.status(500).json({ message: "Error al obtener recetas con chef" }))
}