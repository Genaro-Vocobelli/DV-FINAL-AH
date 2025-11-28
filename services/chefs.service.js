import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.rovg5xk.mongodb.net/AH20232CP1?retryWrites=true&w=majority");

const db = client.db("AH20232CP1")

export async function getChefs(filter = {}) {
  const filterMongo = { eliminado: { $ne: true } };

  //  Filtro por usuario
  if (filter.userId != undefined) {
    filterMongo.userId = new ObjectId(filter.userId);
  }

  await client.connect();
  return db.collection("chefs").find(filterMongo).toArray();
}

export async function getChefById(id) {
  await client.connect();
  return db.collection("chefs").findOne({ _id: new ObjectId(id) });
}

export async function guardarChef(chef) {
  //  Guardar userId
  if (chef.userId) {
    chef.userId = new ObjectId(chef.userId);
  }
  
  await client.connect();
  const resultado = await db.collection("chefs").insertOne(chef);
  return await getChefById(resultado.insertedId);
}

export async function editarChef(chef) {
  await client.connect();
  const { id, ...chefData } = chef;
  
  //  Convertir userId
  if (chefData.userId) {
    chefData.userId = new ObjectId(chefData.userId);
  }
  
  await db.collection("chefs").replaceOne({ _id: new ObjectId(id) }, chefData);
  return await getChefById(id);
}

export async function borrarChef(id) {
  await client.connect();
  await db.collection("chefs").updateOne({ _id: new ObjectId(id) }, { $set: { eliminado: true } });
  return id;
}

export async function actualizarChef(chef) {
  await client.connect();
  const { id, ...chefData } = chef;
  
  if (chefData.userId) {
    chefData.userId = new ObjectId(chefData.userId);
  }
  
  await db.collection("chefs").updateOne({ _id: new ObjectId(id) }, { $set: chefData });
  return await getChefById(id);
}

//  Verificar si el usuario es dueño del chef
export async function esChefDelUsuario(chefId, userId) {
  await client.connect();
  const chef = await db.collection("chefs").findOne({ 
    _id: new ObjectId(chefId),
    userId: new ObjectId(userId)
  });
  return chef !== null;
}

export async function getRecetasByChefId(chefId) {
  await client.connect();
  return db.collection("recetas").find({ 
    chefId: new ObjectId(chefId),
    eliminado: { $ne: true } 
  }).toArray();
}