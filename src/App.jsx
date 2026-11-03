import { useDispatch } from 'react-redux';
import ArticleSearchStep from './components/ArticleSearchStep';
import BrandListStep from './components/BrandListStep';
import OffersTableStep from './components/OffersTableStep';
import { useDebouncedBrandSearch } from './hooks/useDebouncedBrandSearch';
import { resetSearch } from './store/features/search/searchSlice';

export default function App() {
  const dispatch = useDispatch();
  useDebouncedBrandSearch();

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-primary text-white py-4 mb-4 shadow-sm">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h1 className="h3 mb-1">Подбор автозапчастей</h1>
              <p className="mb-0 opacity-75 small">
                Web-сервис «Проценка» Favorit Parts — производители и аналоги
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => dispatch(resetSearch())}
            >
              Сбросить
            </button>
          </div>
        </div>
      </header>

      <main className="container pb-5">
        <ArticleSearchStep />
        <BrandListStep />
        <OffersTableStep />
      </main>

      <footer className="container pb-4 text-muted small">
        Укажите ключ <code>VITE_API_KEY</code> в файле <code>.env</code>. В режиме разработки
        запросы идут через прокси Vite (<code>/api/hsprice</code>).
      </footer>
    </div>
  );
}
