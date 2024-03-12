const { MongoClient, ObjectId } = require("mongodb");

function conectar() {
  return MongoClient.connect(process.env.URL_MONGO);
}

//conectar().then(conexion => console.log("conectado")).catch(error => console.log("error de autenticación")) Para comprobar que funciona

function getColores() {
  return new Promise(async (fulfill, reject) => {
    try {
      let conexion = await conectar();

      let coleccion = conexion.db("colores").collection("colores");
      let colores = await coleccion.find({}).toArray(); //otro await porque es una promesa
      conexion.close();

      fulfill(colores);
    } catch (error) {
      reject({ error: "error en la BBDD" });
    }
  });
}

//getColores().then(colores => console.log(colores)).catch(colores => console.log(colores)) //--> Para comprobar que llegan a la consola del terminal

function crearColor(color) {
  return new Promise(async (fulfill, reject) => {
    try {
      let conexion = await conectar();

      let coleccion = conexion.db("colores").collection("colores");
      let {insertedId} = await coleccion.insertOne(color);
      conexion.close();

      fulfill({id : insertedId});
    } catch (error) {
      reject({ error: "error en la BBDD" });
    }
  });
}

//crearColor({r:200, g:200, b:200}).then(algo => console.log(algo)) --> Para comprobar que llegan a la consola del terminal

function borrarColor(id) {
  return new Promise(async (fulfill, reject) => {
    try {
      let conexion = await conectar();

      let coleccion = conexion.db("colores").collection("colores");
      let {deletedCount} = await coleccion.deleteOne({_id : new ObjectId(id)}); //Aunque lo tache, no es un error, sino que asume que el id que viene es un numero. El primer _id es porque MONGODB lo crea asi directamente
      conexion.close();

      fulfill(deletedCount);//deletedCount viene siempre un 0 o un 1
    } catch (error) {
      reject({ error: "error en la BBDD" });
    }
  });
}

//borrarColor("65eef3003ab3030826fd3b32").then(algo => console.log(algo))// --> Para comprobar que llegan a la consola del terminal


module.exports = {
  getColores,
  crearColor,
  borrarColor
};
