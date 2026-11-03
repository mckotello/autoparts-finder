import { useDispatch, useSelector } from 'react-redux';
import { clearBrandsError } from '../store/features/search/searchSlice';
import { useArticleInput } from '../hooks/useDebouncedBrandSearch';
import ErrorAlert from './ErrorAlert';
import Loader from './Loader';

export default function ArticleSearchStep() {
  const dispatch = useDispatch();
  const { articleNumber, onChange } = useArticleInput();
  const { brands, brandsLoading, brandsError } = useSelector((state) => state.search);

  const showHint =
    articleNumber.trim().length > 0 && !brandsLoading && !brandsError;

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 card-title">Этап 1 — поиск по артикулу</h2>
        <p className="text-muted small mb-3">
          Введите номер детали. После паузы в вводе выполняется запрос к API для списка
          производителей.
        </p>
        <label htmlFor="article-input" className="form-label">
          Артикул (номер детали)
        </label>
        <input
          id="article-input"
          type="text"
          className="form-control form-control-lg"
          placeholder="Например, 7160500039S"
          value={articleNumber}
          onChange={onChange}
          autoComplete="off"
        />

        {brandsLoading && <Loader message="Ищем производителей…" />}
        <ErrorAlert
          message={brandsError}
          onDismiss={() => dispatch(clearBrandsError())}
        />

        {showHint && brands.length === 0 && (
          <p className="text-muted mt-3 mb-0">По этому артикулу производители не найдены.</p>
        )}

        {brands.length > 0 && (
          <p className="mt-3 mb-0 small text-success">
            Найдено производителей: <strong>{brands.length}</strong>. Выберите бренд ниже.
          </p>
        )}
      </div>
    </section>
  );
}
