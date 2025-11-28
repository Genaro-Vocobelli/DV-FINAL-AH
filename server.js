

import express from "express";
import cors from "cors";
import RecetasRoute from "./routes/recetas.routes.js"
import RecetasApiRoute from "./api/routes/recetas.api.routes.js"
import ChefsApiRoute from "./api/routes/chefs.api.routes.js"
import ChefsRoute from "./routes/chefs.routes.js"
import AuthApiRoute from "./api/routes/auth.api.routes.js"
import ComentariosApiRoute from "./api/routes/comentarios.api.routes.js"

const app = express();

// CORS DEBE IR PRIMERO
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use( express.urlencoded({extended: true}) )
app.use( express.json() )

// Rutas web (HTML)
app.use(RecetasRoute)
app.use(ChefsRoute)

// Rutas API
app.use("/api/auth", AuthApiRoute)
app.use("/api/recetas", RecetasApiRoute)
app.use("/api/chefs", ChefsApiRoute)
app.use("/api/comentarios", ComentariosApiRoute) 

app.use(express.static("public"));
app.listen(3333, () => console.log("Servidor funcionando en puerto 3333"));