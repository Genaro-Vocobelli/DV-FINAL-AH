import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recetasService } from "../services/recetasService";
import RecetaCard from "../components/RecetaCard";
import "./Home.css";

function Home() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const data = await recetasService.getAll();
      
      const recetasPublicadas = data.filter(
        (r) => r.estado === "publicada" || !r.estado
      );
      setRecetas(recetasPublicadas);
    } catch (err) {
      setError("Error al cargar las recetas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      cargarRecetas();
      return;
    }

    try {
      setLoading(true);
      const data = await recetasService.search(searchQuery);
      setRecetas(data);
    } catch (err) {
      setError("Error al buscar recetas");
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCategoria = async (categoria) => {
    try {
      setLoading(true);
      const data = await recetasService.getAll();
      const filtradas = categoria
        ? data.filter(
            (r) => r.section.toLowerCase() === categoria.toLowerCase()
          )
        : data;
      setRecetas(filtradas);
    } catch (err) {
      setError("Error al filtrar recetas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando recetas...</div>;
  }

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Bienvenido a Recetas del Chef</h1>
        <p>Descubre y comparte las mejores recetas</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">
            Buscar
          </button>
        </form>
      </div>

      <div className="categories">
        <button
          onClick={() => filtrarPorCategoria("")}
          className="category-btn"
        >
          Todas
        </button>
        <button
          onClick={() => filtrarPorCategoria("entradas")}
          className="category-btn"
        >
          Entradas
        </button>
        <button
          onClick={() => filtrarPorCategoria("plato principal")}
          className="category-btn"
        >
          Plato Principal
        </button>
        <button
          onClick={() => filtrarPorCategoria("postres")}
          className="category-btn"
        >
          Postres
        </button>
        <button
          onClick={() => filtrarPorCategoria("bebidas")}
          className="category-btn"
        >
          Bebidas
        </button>
        <button
          onClick={() => filtrarPorCategoria("vegano")}
          className="category-btn"
        >
          Vegano
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="recetas-grid">
        {recetas.length === 0 ? (
          <div className="no-recetas">
            <p>No se encontraron recetas</p>
            <Link to="/mis-recetas" className="btn-primary">
              Crear mi primera receta
            </Link>
          </div>
        ) : (
          recetas.map((receta) => (
            <RecetaCard key={receta._id} receta={receta} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
