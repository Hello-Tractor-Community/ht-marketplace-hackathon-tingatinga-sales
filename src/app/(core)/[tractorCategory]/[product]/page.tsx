"use client";
import ProductDetail from "@/components/core/product/product-detail";
import React, { Suspense } from "react";

const TractorDetailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetail />
    </Suspense>
  );
};

export default TractorDetailPage;
