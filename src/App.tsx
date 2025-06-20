import { ListOfArticles } from "./ui/ListOfArticles/ListOfArticles";
import { RandomArticle } from "./ui/RandomArticle/RandomArticle";

function App() {
  return (
    <>
      <header className="app-header">
        <h1>📚 ¿Qué leo?</h1>
        <p>Menos decisiones, más lectura.</p>
      </header>
      <RandomArticle />
      <ListOfArticles />
    </>
  );
}

export default App;
