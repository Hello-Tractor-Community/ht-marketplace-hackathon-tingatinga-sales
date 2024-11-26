"use client";
import DataTable from "@/components/core/data-table";
import { Avatar, Button, Flex, Group, Menu, Text } from "@mantine/core";
import React, { Suspense } from "react";

interface PurchasedOrders {
  id: number;
  product: string;
  customer: {
    firstName: string;
    lastName: string;
    middleName: string;
    avatar: string;
  };
  date: string;
  items: number;
  price: string;
  status: string;
}

const columns = [
  {
    header: "Customer",
    cell: (row: PurchasedOrders) => (
      <Flex>
        <Avatar
          src={row.customer.avatar || "https://example.com/default-avatar.jpg"}
          //   alt={`${row.customer.firstName} ${row.customer.lastName}`}
          name={`${row.customer.firstName} ${row.customer.lastName}`}
        />
        <Text size="md" fw={500}>
          {`${row.customer.firstName} ${
            row.customer.middleName ? row.customer.middleName + "" : ""
          } ${row.customer.lastName}`}
        </Text>
      </Flex>
    ),
  },
  { header: "Date", accessor: "date" },
  { header: "Items", accessor: "items" },
  { header: "Price", accessor: "price" },
  { header: "Status", accessor: "status" },
  //   {header:'Actions',cell:(row:PurchasedOrders)=>(
  //     <Menu shadow="md" width={200}>
  //         <Menu.Target>
  //             <Button variant="subtle"></Button>
  //         </Menu.Target>

  //     </Menu>

  //   )}
];

const purchasedOrderData: PurchasedOrders[] = [
  {
    id: 1,
    product: "Laptop",
    customer: {
      firstName: "John",
      lastName: "Doe",
      middleName: "A",
      avatar: "https://example.com/avatar1.jpg",
    },
    date: "2023-10-01",
    items: 1,
    price: "1200.00",
    status: "Shipped",
  },
  {
    id: 2,
    product: "Smartphone",
    customer: {
      firstName: "Jane",
      lastName: "Smith",
      middleName: "B",
      avatar: "https://example.com/avatar2.jpg",
    },
    date: "2023-10-02",
    items: 2,
    price: "800.00",
    status: "Processing",
  },
  {
    id: 3,
    product: "Headphones",
    customer: {
      firstName: "Alice",
      lastName: "Johnson",
      middleName: "C",
      avatar: "https://example.com/avatar3.jpg",
    },
    date: "2023-10-03",
    items: 3,
    price: "150.00",
    status: "Delivered",
  },
];

const Page = () => {
  return (
    <Suspense>
      <DataTable
        data={purchasedOrderData}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </Suspense>
  );
};

export default Page;
