import React, { startTransition } from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Group, Pagination as Pg, Text } from '@mantine/core';

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage = 10 }) => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  return (
    <Group justify="space-between">
      <Text>
        Showing {itemsPerPage * (page - 1) + 1} - {Math.min(itemsPerPage * page, totalItems)} of{' '}
        {totalItems} entries.
      </Text>
      <Pg
        value={page}
        onChange={handlePageChange}
        total={Math.ceil(totalItems / itemsPerPage)}
        siblings={1}
      />
    </Group>
  );
};

export default Pagination;
