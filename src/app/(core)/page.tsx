"use client";
import ProductListing from "@/components/core/product/product-listing";
import { FilterProvider } from "@/lib/context/filters";
import { Container } from "@mantine/core";
import { Suspense } from "react";


export default function Home() {
  return (
    <Suspense>
      <Container size={1400}>
        <FilterProvider>
          <ProductListing />
        </FilterProvider>
      </Container>
    </Suspense>
  );
}
