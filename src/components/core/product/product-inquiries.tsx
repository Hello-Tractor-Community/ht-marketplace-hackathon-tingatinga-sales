import React from "react";
import ProductInquryCard from "./product-inqury-card";

const ProductInquiries = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <ProductInquryCard key={index} />
      ))}
    </>
  );
};

export default ProductInquiries;
