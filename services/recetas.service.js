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

  //  Filtro por usuario
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
  
  //  Guardar userId
  if (receta.userId) {
    receta.userId = new ObjectId(receta.userId);
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
  
  //  Convertir userId
  if (recetaData.userId) {
    recetaData.userId = new ObjectId(recetaData.userId);
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

//  Verificar si el usuario es dueño de la receta
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