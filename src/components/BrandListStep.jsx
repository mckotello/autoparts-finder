import { useDispatch, useSelector } from 'react-redux';
import { loadOffers } from '../store/features/search/searchSlice';
import Loader from './Loader';

export default function BrandListStep() {
  const dispatch = useDispatch();
  const { articleNumber, brands, brandsLoading, selectedBrand, offersLoading } =
    useSelector((state) => state.search);

  if (!articleNumber.trim() || brands.length === 0) {
    return null;
  }

  const onSelectBrand = (brand) => {
    dispatch(loadOffers({ number: articleNumber.trim(), brand }));
  };

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 card-title">Выбор производителя</h2>
        <p className="text-muted small">
          Этап 2 начнётся после выбора бренда — будут загружены аналоги и предложения.
        </p>
        <div className="d-flex flex-wrap gap-2">
          {brands.map((brand) => {
            const isActive = selectedBrand === brand;
            const isBusy = offersLoading && isActive;
            return (
              <button
                key={brand}
                type="button"
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline-primary'}`}
                disabled={brandsLoading || offersLoading}
                onClick={() => onSelectBrand(brand)}
              >
                {brand}
                {isBusy && (
                  <span
                    className="spinner-border spinner-border-sm ms-2"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
        {offersLoading && !selectedBrand && (
          <Loader message="Загрузка предложений…" />
        )}
      </div>
    </section>
  );
}
