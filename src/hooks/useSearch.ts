import { useSearchStore } from '@/stores/searchStore';
import { useCallback } from 'react';

export const useSearch = () => {
  const { keyword, results, loading, search, clearSearch } = useSearchStore();

  const handleSearch = useCallback(
    (searchKeyword: string) => {
      search(searchKeyword);
    },
    [search],
  );

  return {
    keyword,
    results,
    loading,
    handleSearch,
    clearSearch,
  };
};
