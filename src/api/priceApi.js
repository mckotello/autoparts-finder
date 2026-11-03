const DEFAULT_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api/hsprice/' : 'http://api.favorit-parts.ru/hs/hsprice/');

function getApiKey() {
  const key = import.meta.env.VITE_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'Не задан ключ API. Скопируйте .env.example в .env и укажите VITE_API_KEY.',
    );
  }
  return key;
}

function buildUrl(params) {
  const search = new URLSearchParams();
  search.set('key', getApiKey());
  Object.entries(params).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(name, String(value));
    }
  });
  const base = DEFAULT_BASE.endsWith('/') ? DEFAULT_BASE : `${DEFAULT_BASE}/`;
  return `${base}?${search.toString()}`;
}

function isEmptyGood(item) {
  if (!item || typeof item !== 'object') return true;
  return !item.goodsID && !item.brand && !item.number && !item.name;
}

export function parsePriceResponse(data) {
  if (!data) {
    return { goods: [], error: 'Пустой ответ сервера' };
  }
  if (data.error) {
    return { goods: [], error: String(data.error) };
  }
  const raw = Array.isArray(data.goods) ? data.goods : [];
  const goods = raw.filter((item) => !isEmptyGood(item));
  return { goods, error: null };
}

export async function fetchByNumber(number) {
  const url = buildUrl({ number: number.trim() });
  return requestPrice(url);
}

export async function fetchWithBrandAndAnalogues(number, brand) {
  const url = buildUrl({
    number: number.trim(),
    brand: brand.trim(),
    analogues: 'on',
    info: 'on',
  });
  return requestPrice(url);
}

async function requestPrice(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Сбой сети. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    throw new Error(`Ошибка HTTP ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Не удалось разобрать ответ сервера (ожидался JSON).');
  }

  const { goods, error } = parsePriceResponse(data);
  if (error) {
    throw new Error(error);
  }
  return goods;
}

/** Уникальные производители из списка позиций */
export function extractBrands(goods) {
  const seen = new Set();
  const brands = [];
  goods.forEach((item) => {
    const brand = item.brand?.trim();
    if (brand && !seen.has(brand.toUpperCase())) {
      seen.add(brand.toUpperCase());
      brands.push(brand);
    }
  });
  return brands.sort((a, b) => a.localeCompare(b, 'ru'));
}

/** Минимальная цена и остаток по складам (price из goods не используем по документации) */
export function getOfferStats(item) {
  const warehouses = Array.isArray(item.warehouses) ? item.warehouses : [];
  let minPrice = null;
  let stockFromWarehouses = 0;

  warehouses.forEach((wh) => {
    const stock = Number(wh.stock) || 0;
    stockFromWarehouses += stock;
    if (stock > 0 && wh.price != null) {
      const price = Number(wh.price);
      if (!Number.isNaN(price) && (minPrice === null || price < minPrice)) {
        minPrice = price;
      }
    }
  });

  const totalStock =
    typeof item.count === 'number' ? item.count : stockFromWarehouses;

  return {
    minPrice,
    stock: totalStock,
  };
}

/** Основная позиция + аналоги в плоский список для таблицы */
export function flattenOffers(goods) {
  const rows = [];
  goods.forEach((item) => {
    rows.push({ ...item, isAnalogue: false });
    const analogues = Array.isArray(item.analogues) ? item.analogues : [];
    analogues.filter((a) => !isEmptyGood(a)).forEach((a) => {
      rows.push({ ...a, isAnalogue: true });
    });
  });
  return rows;
}

export function formatPrice(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  }).format(value);
}
