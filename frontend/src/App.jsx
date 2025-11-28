import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import MisRecetas from './pages/MisRecetas';
import NuevaReceta from './pages/NuevaReceta';
import EditarReceta from './pages/EditarReceta';
import MisChefs from './pages/MisChefs';
import NuevoChef from './pages/NuevoChef';
import EditarChef from './pages/EditarChef';
import RecetaDetalle from './pages/RecetaDetalle';
import ChefDetalle from './pages/ChefDetalle';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/receta/:id" element={<RecetaDetalle />} />
            <Route path="/chef/:id" element={<ChefDetalle />} />

            {/* Rutas protegidas - Usuario */}
            <Route 
              path="/perfil" 
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              } 
            />

            {/* Rutas protegidas - Recetas */}
            <Route 
              path="/mis-recetas" 
              element={
                <PrivateRoute>
                  <MisRecetas />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/nueva-receta" 
              element={
                <PrivateRoute>
                  <NuevaReceta />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/editar-receta/:id" 
              element={
                <PrivateRoute>
                  <EditarReceta />
                </PrivateRoute>
              } 
            />

            {/* Rutas protegidas - Chefs */}
            <Route 
              path="/mis-chefs" 
              element={
                <PrivateRoute>
                  <MisChefs />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/nuevo-chef" 
              element={
                <PrivateRoute>
                  <NuevoChef />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/editar-chef/:id" 
              element={
                <PrivateRoute>
                  <EditarChef />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;