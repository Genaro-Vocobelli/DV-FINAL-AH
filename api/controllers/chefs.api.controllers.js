import * as services from "../../services/chefs.service.js"

export function getChefs(req, res) {
    const filter = { ...req.query };
    
    services.getChefs(filter)
        .then(chefs => res.status(200).json(chefs))
        .catch(err => res.status(500).json({ message: "Error al obtener chefs" }))
}

//  Obtener solo los chefs del usuario autenticado
export function getMisChefs(req, res) {
    const userId = req.usuario.id;
    
    services.getChefs({ userId: userId })
        .then(chefs => res.status(200).json(chefs))
        .catch(err => res.status(500).json({ message: "Error al obtener tus chefs" }))
}

export function getChefById(req, res) {
    const id = req.params.id
    services.getChefById(id)
        .then(chef => {
            if (chef) {
                res.status(200).json(chef)
            } else {
                res.status(404).json({ message: "Chef no encontrado" })
            }
        })
        .catch(err => res.status(500).json({ message: "Error al obtener el chef" }))
}

export function createChef(req, res) {
    const chef = {
        nombre: req.body.nombre,
        foto: req.body.foto,
        descripcion: req.body.descripcion,
        especialidad: req.body.especialidad || "",
        experiencia: req.body.experiencia || "",
        userId: req.usuario.id
    }
    
    if (!chef.nombre || !chef.foto || !chef.descripcion) {
        return res.status(400).json({ message: "Los campos nombre, foto y descripción son obligatorios" });
    }
    
    services.guardarChef(chef)
        .then((nuevoChef) => res.status(201).json(nuevoChef))
        .catch(err => res.status(500).json({ message: "Error al crear el chef" }))
}

export async function deleteChef(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        const esDelUsuario = await services.esChefDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para eliminar este chef" 
            });
        }
        
        await services.borrarChef(id);
        res.status(202).json({ message: `El chef se eliminó correctamente.` });
        
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar chef" });
    }
}

export async function reemplazarChef(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        const esDelUsuario = await services.esChefDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para editar este chef" 
            });
        }
        
        const chef = {
            id: id,
            nombre: req.body.nombre,
            foto: req.body.foto,
            descripcion: req.body.descripcion,
            especialidad: req.body.especialidad || "",
            experiencia: req.body.experiencia || "",
            userId: userId
        }
        
        if (!chef.nombre || !chef.foto || !chef.descripcion) {
            return res.status(400).json({ message: "Los campos nombre, foto y descripción son obligatorios" });
        }
        
        const chefEditado = await services.editarChef(chef);
        res.status(202).json(chefEditado);
        
    } catch (err) {
        res.status(500).json({ message: "No se pudo actualizar el chef." });
    }
}

export async function actualizarChef(req, res) {
    const id = req.params.id;
    const userId = req.usuario.id;
    
    try {
        const esDelUsuario = await services.esChefDelUsuario(id, userId);
        
        if (!esDelUsuario) {
            return res.status(403).json({ 
                message: "No tienes permiso para editar este chef" 
            });
        }
        
        const chef = { id: id };
        
        if (req.body.nombre !== undefined) chef.nombre = req.body.nombre;
        if (req.body.foto !== undefined) chef.foto = req.body.foto;
        if (req.body.descripcion !== undefined) chef.descripcion = req.body.descripcion;
        if (req.body.especialidad !== undefined) chef.especialidad = req.body.especialidad;
        if (req.body.experiencia !== undefined) chef.experiencia = req.body.experiencia;
        
        const chefEditado = await services.actualizarChef(chef);
        res.status(202).json(chefEditado);
        
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el chef" });
    }
}

export function getRecetasByChef(req, res) {
    const chefId = req.params.id
    services.getRecetasByChefId(chefId)
        .then(recetas => {
            res.status(200).json({
                chefId: chefId,
                totalRecetas: recetas.length,
                recetas: recetas
            })
        })
        .catch(err => res.status(500).json({ message: "Error al obtener las recetas del chef" }))
}