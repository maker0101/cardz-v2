import { useState, useMemo, Dispatch, SetStateAction } from 'react';

interface UseSearchProps<T> {
  items: readonly T[];
  searchableValue: (item: T) => string | string[];
  initialSearchQuery?: string;
}

interface UseSearchResult<T> {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  filteredItems: readonly T[];
}

export function useSearch<T>({
  items,
  searchableValue,
  initialSearchQuery = '',
}: UseSearchProps<T>): UseSearchResult<T> {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const filteredItems = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return items;
    }

    const lowerCaseQuery = trimmedQuery.toLowerCase();

    return items.filter((item) => {
      const valueOrValues = searchableValue(item);
      if (typeof valueOrValues === 'string') {
        return valueOrValues.toLowerCase().includes(lowerCaseQuery);
      }
      if (Array.isArray(valueOrValues)) {
        return valueOrValues.some((value) =>
          value.toLowerCase().includes(lowerCaseQuery),
        );
      }
      return false; // Should not happen if type is enforced, but good for safety
    });
  }, [items, searchQuery, searchableValue]);

  return { searchQuery, setSearchQuery, filteredItems };
}
