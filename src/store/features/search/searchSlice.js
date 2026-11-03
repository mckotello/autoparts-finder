import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  extractBrands,
  fetchByNumber,
  fetchWithBrandAndAnalogues,
  flattenOffers,
} from '../../api/priceApi';

const DEBOUNCE_MS = 400;

export const searchBrands = createAsyncThunk(
  'search/searchBrands',
  async (number, { rejectWithValue }) => {
    if (!number?.trim()) {
      return { brands: [], goods: [] };
    }
    try {
      const goods = await fetchByNumber(number);
      return { brands: extractBrands(goods), goods };
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка поиска производителей');
    }
  },
);

export const loadOffers = createAsyncThunk(
  'search/loadOffers',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      const goods = await fetchWithBrandAndAnalogues(number, brand);
      return { rows: flattenOffers(goods), brand };
    } catch (err) {
      return rejectWithValue(err.message || 'Ошибка загрузки предложений');
    }
  },
);

const initialState = {
  articleNumber: '',
  brands: [],
  previewGoods: [],
  selectedBrand: null,
  offerRows: [],
  stage: 1,
  brandsLoading: false,
  offersLoading: false,
  brandsError: null,
  offersError: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setArticleNumber(state, action) {
      state.articleNumber = action.payload;
      state.selectedBrand = null;
      state.offerRows = [];
      state.offersError = null;
      state.stage = 1;
    },
    clearBrandsError(state) {
      state.brandsError = null;
    },
    clearOffersError(state) {
      state.offersError = null;
    },
    resetSearch(state) {
      Object.assign(state, {
        ...initialState,
        articleNumber: '',
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state) => {
        state.brandsLoading = true;
        state.brandsError = null;
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.brandsLoading = false;
        state.brands = action.payload.brands;
        state.previewGoods = action.payload.goods;
        if (!action.meta.arg?.trim()) {
          state.brands = [];
          state.previewGoods = [];
        }
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.brandsLoading = false;
        state.brands = [];
        state.previewGoods = [];
        state.brandsError = action.payload;
      })
      .addCase(loadOffers.pending, (state) => {
        state.offersLoading = true;
        state.offersError = null;
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        state.offersLoading = false;
        state.selectedBrand = action.payload.brand;
        state.offerRows = action.payload.rows;
        state.stage = 2;
      })
      .addCase(loadOffers.rejected, (state, action) => {
        state.offersLoading = false;
        state.offerRows = [];
        state.offersError = action.payload;
      });
  },
});

export const {
  setArticleNumber,
  clearBrandsError,
  clearOffersError,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;

export { DEBOUNCE_MS };
