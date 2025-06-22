import { useState, useEffect, useContext } from "react";
import "./RandomArticle.css";
import { Article } from "../../domain/Article";
import { ArticleRepositoryContext } from "../../domain/ArticleRepositoryContext";
import { useAuth } from "../../domain/AuthContext";
import { GetRandomArticleForUser } from "../../application/GetRandomArticleForUser";

export function RandomArticle() {
  // Estados para manejar el artículo seleccionado y el estado de carga
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  const repository = useContext(ArticleRepositoryContext);
  const { user } = useAuth();

  const fetchAndSetRandomArticle = async () => {
    if (!repository || !user) return;
    setLoading(true);
    try {
      const useCase = new GetRandomArticleForUser(repository);
      const randomArticle = await useCase.execute(user.id);
      setArticle(randomArticle); // Puede ser un artículo o null
    } catch (error) {
      console.error("Error al obtener artículo aleatorio:", error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetRandomArticle();
  }, [user, repository]);

  const handleGetRandomArticle = () => {
    fetchAndSetRandomArticle();
  };

  return (
    <div className="random-article-container">
      <div className="article-container">
        <div
          className={`content-card random-article-card ${
            article ? "card-animated" : ""
          }`}
        >
          {article ? (
            <>
              <h4 className="article-title">{article.title}</h4>
              <div className="article-links-container">
                {article.url === "#" ? (
                  <>
                    <div className="url-not-available">
                      🚫 No URL disponible.
                    </div>
                    <a
                      href={
                        "https://google.com/search?q=" +
                        encodeURIComponent(article.title)
                      }
                      className="article-link"
                    >
                      🔎 Buscar en Google
                    </a>
                  </>
                ) : (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    🔗 Leer artículo
                  </a>
                )}
              </div>
              <p className="article-date">
                Guardado el: {article.dateAdded.toLocaleDateString()}
              </p>
            </>
          ) : loading ? (
            <div className="loading-state">🔄 Buscando en tus artículos...</div>
          ) : (
            <div className="no-articles-state">
              <p>¡No tienes artículos!</p>
              <p>Añade uno para empezar.</p>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleGetRandomArticle}
        disabled={loading}
        className="modern-button button-primary random-article-button"
      >
        {loading ? "🔄 Buscando..." : "Dame otro 🎲"}
      </button>
    </div>
  );
}
