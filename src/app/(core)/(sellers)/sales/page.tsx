"use client";
import DataTable from "@/components/core/data-table";
import { Avatar, Flex, Text } from "@mantine/core";
import React, { Suspense } from "react";

interface Sales {
  id: number;
  product: string;
  customer: {
    firstName: string;
    lastName: string;
    middleName: string;
    avatar: string;
  };
  create: string;
  due: string;
  amount: string;
  sent: number;
  status: string;
}

const columns = [
  {
    header: "Customer",
    cell: (row: Sales) => (
      <Flex align="center" gap="sm">
        <Avatar
          src={row.customer.avatar || "https://example.com/default-avatar.jpg"}
          //   alt={`${row.customer.firstName} ${row.customer.lastName}`}
          name={`${row.customer.firstName} ${row.customer.lastName}`}
        />
        <Text size="md" fw={500} mx={2}>
          {`${row.customer.firstName} ${
            row.customer.middleName ? row.customer.middleName + "" : ""
          } ${row.customer.lastName}`}
        </Text>
      </Flex>
    ),
  },
  { header: "Create", accessor: "create" },
  { header: "Due", accessor: "due" },
  { header: "Amount", accessor: "amount" },
  { header: "Sent", accessor: "sent" },
  { header: "Status", accessor: "status" },
  //   {header:'Actions',cell:(row:Sales)=>(
  //     <Menu shadow="md" width={200}>
  //         <Menu.Target>
  //             <Button variant="subtle"></Button>
  //         </Menu.Target>

  //     </Menu>

  //   )}
];

const salesData: Sales[] = [
  {
    id: 1,
    product: "Laptop",
    customer: {
      firstName: "John",
      lastName: "Doe",
      middleName: "A",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    create: "2023-10-01",
    due: "2023-10-06",
    amount: "1200.00",
    sent: 1,
    status: "Pending",
  },
  {
    id: 2,
    product: "Smartphone",
    customer: {
      firstName: "Jane",
      lastName: "Smith",
      middleName: "B",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    create: "2023-10-02",
    due: "2023-10-05",
    amount: "800.00",
    sent: 2,
    status: "Overdue",
  },
  {
    id: 3,
    product: "Headphones",
    customer: {
      firstName: "Alice",
      lastName: "Johnson",
      middleName: "C",
      avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    },
    create: "2023-10-03",
    due: "2023-10-10",
    amount: "150.00",
    sent: 3,
    status: "Paid",
  },
  {
    id: 4,
    product: "Tablet",
    customer: {
      firstName: "Bob",
      lastName: "Brown",
      middleName: "D",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    create: "2023-10-04",
    due: "2023-10-06",
    amount: "300.00",
    sent: 1,
    status: "Pending",
  },
  {
    id: 5,
    product: "Monitor",
    customer: {
      firstName: "Charlie",
      lastName: "Davis",
      middleName: "E",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    create: "2023-10-05",
    due: "2023-10-09",
    amount: "400.00",
    sent: 2,
    status: "Pending",
  },
];

const Page = () => {
  return (
    <Suspense>
      <Text size="xl" fw={700} mt="lg">
        Sales
      </Text>
      <DataTable
        data={salesData}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </Suspense>
  );
};

export default Page;
