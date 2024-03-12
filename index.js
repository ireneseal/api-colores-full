require("dotenv").config();
const express = require("express");
const servidor = express();
const { json } = require("body-parser");
const cors = require("cors");
const { getColores, borrarColor, crearColor } = require("./mongodb");

servidor.use(cors());

servidor.use("/cualquiercosa", express.static("./pruebas")); // Si en la url escribo "cualquiercosa", entonces mostrará el index estático que está dentro de la carpeta pruebas

servidor.use(json());

servidor.get("/colores", async (peticion, respuesta) => {
  try {
    let colores = await getColores();
    respuesta.json(colores.map(({ _id, r, g, b }) => ({ id: _id, r, g, b })));
  } catch (error) {
    respuesta.status(500);
    respuesta.json(error);
  }
});

servidor.post("/colores/nuevo", async (peticion, respuesta, siguiente) => {
  let { r, g, b } = peticion.body;
  let valido = true;

  [r, g, b].forEach((n) => (valido = valido && n >= 0 && n <= 255));

  if (valido) {
    try {
      let resultado = await crearColor({ r, g, b });
      return respuesta.json(resultado);
    } catch (error) {
      respuesta.status(500);
      respuesta.json(error);
    }
  }

  siguiente({ error: "el valor introducido no es válido" });
});

servidor.delete("/colores/borrar/:id([a-f0-9]{24})", async (peticion, respuesta) => {

  try{
    let deletedCount = await borrarColor(peticion.params.id)
    return respuesta.json({ resultado: deletedCount ? "fulfill" : "reject" });

  }catch(error){
    respuesta.status(500);
    respuesta.json(error);
  }
  
});

servidor.use((error, peticion, respuesta, siguiente) => {
  respuesta.status(400);
  respuesta.json({ error: "error en la peticion" });
});
servidor.use((peticion, respuesta) => {
  respuesta.status(404);
  respuesta.json({ error: "recurso no encontrado" });
});

servidor.listen(process.env.PORT);
