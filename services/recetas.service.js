import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.rovg5xk.mongodb.net/AH20232CP1?retryWrites=true&w=majority");

const db = client.db("AH20232CP1")

export async function getRecetas(filter = {}) {
  const filterMongo = { eliminado: { $ne: true } };

  if (filter.section != undefined) {
    filterMongo.section = filter.section;
  }

  // Filtro de búsqueda
  if (filter.search != undefined) {
    filterMongo.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
      { section: { $regex: filter.search, $options: 'i' } }
    ];
  }

  // Filtro por chef
  if (filter.chefId != undefined) {
    filterMongo.chefId = new ObjectId(filter.chefId);
  }

  // Filtro por usuario
  if (filter.userId != undefined) {
    filterMongo.userId = new ObjectId(filter.userId);
  }

  await client.connect();
  return db.collection("recetas").find(filterMongo).toArray();
}

export async function getRecetaById(id) {
  await client.connect();
  return db.collection("recetas").findOne({ _id: new ObjectId(id) });
}

export async function guardarReceta(receta) {
  // Convertir IDs a ObjectId
  if (receta.chefId) {
    receta.chefId = new ObjectId(receta.chefId);
  }
  
  // Guardar userId
  if (receta.userId) {
    receta.userId = new ObjectId(receta.userId);
  }
  
  // Inicializar colaboradores si no existe
  if (!receta.colaboradores) {
    receta.colaboradores = [];
  }
  
  await client.connect();
  const resultado = await db.collection("recetas").insertOne(receta);
  return await getRecetaById(resultado.insertedId);
}

export async function editarReceta(receta) {
  await client.connect();
  const { id, ...recetaData } = receta;
  
  if (recetaData.chefId) {
    recetaData.chefId = new ObjectId(recetaData.chefId);
  }
  
  if (recetaData.userId) {
    recetaData.userId = new ObjectId(recetaData.userId);
  }
  
  // Asegurar que el estado se incluya
  if (!recetaData.estado) {
    recetaData.estado = "publicada";
  }
  
  await db.collection("recetas").replaceOne({ _id: new ObjectId(id) }, recetaData);
  return await getRecetaById(id);
}

export async function borrarReceta(id) {
  await client.connect();
  await db.collection("recetas").updateOne({ _id: new ObjectId(id) }, { $set: { eliminado: true } });
  return id;
}

export async function actualizarRecipe(receta) {
  await client.connect();
  const { id, ...recetaData } = receta;
  
  if (recetaData.chefId) {
    recetaData.chefId = new ObjectId(recetaData.chefId);
  }
  
  if (recetaData.userId) {
    recetaData.userId = new ObjectId(recetaData.userId);
  }
  
  await db.collection("recetas").updateOne({ _id: new ObjectId(id) }, { $set: recetaData });
  return await getRecetaById(id);
}

export async function getProductoById(id) {
  return await getRecetaById(id);
}

export async function esRecetaDelUsuario(recetaId, userId) {
  await client.connect();
  const receta = await db.collection("recetas").findOne({ 
    _id: new ObjectId(recetaId),
    userId: new ObjectId(userId)
  });
  return receta !== null;
}

export async function getRecetasConChef() {
  await client.connect();
  return db.collection("recetas").aggregate([
    {
      $match: { eliminado: { $ne: true } }
    },
    {
      $lookup: {
        from: "chefs",
        localField: "chefId",
        foreignField: "_id",
        as: "chef"
      }
    },
    {
      $unwind: {
        path: "$chef",
        preserveNullAndEmptyArrays: true
      }
    }
  ]).toArray();
}

/**
 * Agregar colaborador a una receta
 */
export async function agregarColaborador(recetaId, colaborador) {
  await client.connect();
  
  // Verificar que el colaborador no exista ya
  const receta = await getRecetaById(recetaId);
  
  if (!receta.colaboradores) {
    receta.colaboradores = [];
  }
  
  // Verificar si ya es colaborador
  const yaExiste = receta.colaboradores.some(c => c.username === colaborador.username);
  
  if (yaExiste) {
    throw new Error('El usuario ya es colaborador de esta receta');
  }
  
  // Agregar colaborador
  await db.collection("recetas").updateOne(
    { _id: new ObjectId(recetaId) },
    { $push: { colaboradores: colaborador } }
  );
  
  return await getRecetaById(recetaId);
}

/**
 * Eliminar colaborador de una receta
 */
export async function eliminarColaborador(recetaId, username) {
  await client.connect();
  
  await db.collection("recetas").updateOne(
    { _id: new ObjectId(recetaId) },
    { $pull: { colaboradores: { username: username } } }
  );
  
  return await getRecetaById(recetaId);
}

export async function cambiarEstadoReceta(recetaId, nuevoEstado) {
  await client.connect();
  
  await db.collection("recetas").updateOne(
    { _id: new ObjectId(recetaId) },
    { $set: { estado: nuevoEstado } }
  );
  
  return await getRecetaById(recetaId);
}