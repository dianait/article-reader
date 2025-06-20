import { useState, useEffect } from "react";
import { GetAllArticles } from "../../application/GetAllArticles";
import { JsonArticleRepository } from "../../infrastructure/repositories/JSONArticleRepository";
import { Article } from "../../domain/Article";

export function ListOfArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  // Sidebar abierto por defecto
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (sidebarOpen && articles.length === 0) {
      setLoading(true);
      const fetchArticles = async () => {
        try {
          const repository = new JsonArticleRepository();
          const useCase = new GetAllArticles(repository);
          const result = await useCase.execute();
          setArticles(result);
        } catch (error) {
          console.error("Error al cargar artículos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    }
  }, [sidebarOpen, articles.length]);

  return (
    <>
      <button
        className={`sidebar-toggle${sidebarOpen ? " hidden" : ""}`}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar${sidebarOpen ? " open" : ""}`}
        style={{ minWidth: 340, maxWidth: 420 }}
      >
        <div className="sidebar-header">
          <h2>Articles ({articles.length})</h2>
          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        {loading ? (
          <div className="sidebar-loading">Loading...</div>
        ) : (
          <ul className="sidebar-list">
            {articles.map((article) => (
              <li key={article.id} className="sidebar-list-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
                <div className="sidebar-date">
                  {article.dateAdded.toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
