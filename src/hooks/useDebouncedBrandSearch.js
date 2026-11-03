import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEBOUNCE_MS,
  searchBrands,
  setArticleNumber,
} from '../store/features/search/searchSlice';

export function useDebouncedBrandSearch() {
  const dispatch = useDispatch();
  const articleNumber = useSelector((state) => state.search.articleNumber);

  useEffect(() => {
    const trimmed = articleNumber.trim();
    if (!trimmed) {
      dispatch(searchBrands(''));
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      dispatch(searchBrands(trimmed));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timerId);
    };
  }, [articleNumber, dispatch]);
}

export function useArticleInput() {
  const dispatch = useDispatch();
  const articleNumber = useSelector((state) => state.search.articleNumber);

  const onChange = (event) => {
    dispatch(setArticleNumber(event.target.value));
  };

  return { articleNumber, onChange };
}
