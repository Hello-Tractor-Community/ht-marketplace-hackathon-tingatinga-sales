import { CloseButton, Input } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';
import React, { useState } from 'react';

const SearchInput = () => {
  const [query, setQuery] = useQueryState('q', { defaultValue: '', clearOnDefault: true });
  const [value, setValue] = useState(query);

  const debounceSetQuery = useDebouncedCallback((newValue: string) => {
    setQuery(newValue);
  }, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    setValue(newValue);
    debounceSetQuery(newValue);
  };

  const handleClear = () => {
    setValue('');
    debounceSetQuery('');
  };

  return (
    <Input
      maw={200}
      mt="md"
      placeholder="Search"
      value={value}
      onChange={handleChange}
      rightSectionPointerEvents="all"
      leftSection={<IconSearch size={16} />}
      rightSection={
        <CloseButton
          aria-label="Clear search input"
          onClick={handleClear}
          style={{ display: query ? undefined : 'none' }}
        />
      }
      className="border"
    />
  );
};

export default SearchInput;
