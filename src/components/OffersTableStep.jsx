import { useDispatch, useSelector } from 'react-redux';
import { formatPrice, getOfferStats } from '../api/priceApi';
import { clearOffersError } from '../store/features/search/searchSlice';
import ErrorAlert from './ErrorAlert';
import Loader from './Loader';

export default function OffersTableStep() {
  const dispatch = useDispatch();
  const { selectedBrand, offerRows, offersLoading, offersError, stage } = useSelector(
    (state) => state.search,
  );

  if (stage < 2 && !offersLoading && !offersError) {
    return null;
  }

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 card-title">
          Аналоги и предложения
          {selectedBrand && (
            <span className="text-muted fw-normal">
              {' '}
              — {selectedBrand}
            </span>
          )}
        </h2>

        {offersLoading && <Loader message="Загружаем аналоги и цены…" />}
        <ErrorAlert
          message={offersError}
          onDismiss={() => dispatch(clearOffersError())}
        />

        {!offersLoading && !offersError && offerRows.length === 0 && selectedBrand && (
          <p className="text-muted mb-0">Нет данных по выбранному производителю.</p>
        )}

        {!offersLoading && offerRows.length > 0 && (
          <div className="table-responsive mt-2">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Наименование</th>
                  <th scope="col">Производитель</th>
                  <th scope="col">Артикул</th>
                  <th scope="col" className="text-end">
                    Цена
                  </th>
                  <th scope="col" className="text-end">
                    Остаток
                  </th>
                  <th scope="col">Тип</th>
                </tr>
              </thead>
              <tbody>
                {offerRows.map((row) => {
                  const { minPrice, stock } = getOfferStats(row);
                  const key = `${row.goodsID || row.number}-${row.brand}-${row.isAnalogue}`;
                  return (
                    <tr key={key}>
                      <td>{row.name || '—'}</td>
                      <td>{row.brand || '—'}</td>
                      <td>
                        <code>{row.number || '—'}</code>
                      </td>
                      <td className="text-end">{formatPrice(minPrice)}</td>
                      <td className="text-end">{stock}</td>
                      <td>
                        {row.isAnalogue ? (
                          <span className="badge text-bg-secondary">Аналог</span>
                        ) : (
                          <span className="badge text-bg-primary">Оригинал запроса</span>
                        )}
                        {row.notRefund && (
                          <span className="badge text-bg-warning ms-1">Без возврата</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
