import {useState} from 'react';
import {ComboboxOption} from '@/frontend/components/combobox/combobox.types';
import {EMPTY_COMBOBOX_VALUE} from '@/frontend/components/combobox/combobox.core';
import {useSearch} from '@/frontend/hooks/use-search';

export interface UseComboboxProps {
  options: ComboboxOption[];
  defaultValue?: string[];
  onSelect: (values: string[]) => void;
  onCreate: (labelName: string) => Promise<string | undefined>;
}

export const useCombobox = (props: UseComboboxProps) => {
  const {options, defaultValue = [], onSelect, onCreate} = props;

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>(defaultValue);

  const {
    searchQuery: search,
    setSearchQuery: setSearch,
    filteredItems: filteredOptions,
  } = useSearch<ComboboxOption>({
    items: options,
    searchableValue: option => option.label,
  });

  const handleSelect = async (selectedValue: string) => {
    const isNew =
      selectedValue === EMPTY_COMBOBOX_VALUE && search.trim() !== '';

    if (isNew) {
      setOpen(false);
      const newValueId = await onCreate(search);
      if (!newValueId) return;
      const newValues = [...values, newValueId];
      setValues(newValues);
      onSelect(newValues);
      setSearch('');
    } else {
      const valueExists = values.includes(selectedValue);
      const newValues = valueExists
        ? values.filter(v => v !== selectedValue)
        : [...values, selectedValue];
      setValues(newValues);
      onSelect(newValues);
    }
  };

  return {
    open,
    setOpen,
    values,
    search,
    setSearch,
    options,
    filteredOptions,
    handleSelect,
  };
};
