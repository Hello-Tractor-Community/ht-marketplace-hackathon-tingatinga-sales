import React, { ReactNode, useState } from "react";
import { Button, Checkbox, Flex, Menu, Table } from "@mantine/core";
import SearchInput from "./search-input";
import Pagination from "./pagination";

interface Column<T> {
  header: string;
  accessor?: string;
  cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => number;
  actions?: ((row: T) => ReactNode)[];
  itemsPerPage?: number;
  disableSearch?: boolean;
  disablePagination?: boolean;
  disableSelect?: boolean;
}

const DataTable = <T,>({
  data,
  columns,
  getRowId,
  itemsPerPage = 10,
  actions = [],
  disablePagination = false,
  disableSearch = false,
  disableSelect = false,
}: DataTableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rows = data.map((row) => {
    const rowId = getRowId(row);

    return (
      <Table.Tr
        key={rowId}
        bg={
          selectedRows.includes(rowId)
            ? "var(--mantine-color-blue-light)"
            : undefined
        }
      >
        {!disableSelect && (
          <Table.Td>
            <Checkbox
              aria-label="Select row"
              checked={selectedRows.includes(rowId)}
              onChange={(event) =>
                setSelectedRows(
                  event.currentTarget.checked
                    ? [...selectedRows, rowId]
                    : selectedRows.filter((id) => id !== rowId)
                )
              }
            />
          </Table.Td>
        )}

        {columns.map((column, colIndex) => (
          <Table.Td key={`${rowId}-${colIndex}`}>
            {column.cell
              ? column.cell(row)
              : column.accessor
              ? String(row[column.accessor as keyof T] ?? "")
              : null}
          </Table.Td>
        ))}
        {actions.length > 0 && (
          <Table.Td key={`${rowId}-actions`}>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="transparent">Actions</Button>
              </Menu.Target>
              <Menu.Dropdown>
                {actions.map((Action, actionIndex) => (
                  <Menu.Item key={`${rowId}-action-${actionIndex}`}>
                    {Action(row)}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Table.Td>
        )}
      </Table.Tr>
    );
  });

  return (
    <Flex direction="column" gap="lg">
      {!disableSearch && <SearchInput />}
      <Table.ScrollContainer minWidth={500}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {!disableSelect && <Table.Th />}
              {columns.map((column, colIndex) => (
                <Table.Th key={`header-${colIndex}`}>{column.header}</Table.Th>
              ))}
              {actions.length > 0 && <Table.Th>Actions</Table.Th>}{" "}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {!disablePagination && (
        <Pagination totalItems={data.length} itemsPerPage={itemsPerPage} />
      )}
    </Flex>
  );
};

export default DataTable;
