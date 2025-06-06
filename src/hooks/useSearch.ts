import { FullTextSearchArticles } from '@/api/article';
import { FullTextSearchItem } from '@/api/article/type';
import { useRequest } from '@umijs/max';
import { useCallback, useState } from 'react';

export const useSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<FullTextSearchItem[]>([]);

  const { loading, run: searchArticles } = useRequest(FullTextSearchArticles, {
    manual: true,
    onSuccess: (response: any) => {
      if (response.list && response.list.length > 0) {
        setResults(response.list);
      } else {
        setResults([]);
      }
    },
    onError: () => {
      setResults([]);
    },
  });

  const handleSearch = useCallback(
    (searchKeyword: string) => {
      setKeyword(searchKeyword);
      if (searchKeyword.trim()) {
        searchArticles({
          page: 1,
          page_size: 10,
          keyword: searchKeyword.trim(),
        });
      } else {
        setResults([]);
      }
    },
    [searchArticles],
  );

  const clearSearch = useCallback(() => {
    setKeyword('');
    setResults([]);
  }, []);

  return {
    keyword,
    results,
    loading,
    handleSearch,
    clearSearch,
  };
};
