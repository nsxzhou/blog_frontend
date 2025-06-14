import { FullTextSearchArticles } from '@/api/article';
import { FullTextSearchItem } from '@/api/article/type';
import { create } from 'zustand';

interface SearchState {
  keyword: string;
  results: FullTextSearchItem[];
  loading: boolean;

  // Actions
  setKeyword: (keyword: string) => void;
  setResults: (results: FullTextSearchItem[]) => void;
  setLoading: (loading: boolean) => void;
  search: (searchKeyword: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  keyword: '',
  results: [],
  loading: false,

  setKeyword: (keyword) => set({ keyword }),
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),

  search: async (searchKeyword) => {
    const trimmedKeyword = searchKeyword.trim();
    set({ keyword: trimmedKeyword, loading: true });

    if (!trimmedKeyword) {
      set({ results: [], loading: false });
      return;
    }

    try {
      const response = await FullTextSearchArticles({
        page: 1,
        page_size: 10,
        keyword: trimmedKeyword,
      });

      if (response.code === 0 && response.data) {
        set({ results: response.data.list || [] });
      } else {
        set({ results: [] });
      }
    } catch (error) {
      console.error('搜索失败:', error);
      set({ results: [] });
    } finally {
      set({ loading: false });
    }
  },

  clearSearch: () => {
    set({
      keyword: '',
      results: [],
      loading: false,
    });
  },
}));
