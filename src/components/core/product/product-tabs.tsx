import { rem, Tabs } from "@mantine/core";
import { IconFile, IconMessage, IconTruck } from "@tabler/icons-react";
import ProductDescription from "./product-description";
import ProductInquiries from "./product-inquiries";
import ProductReviews from "../review/reviews";
import { useParams } from "next/navigation";
import {
  useGetProductReviewsQuery,
  useGetTractorDetailQuery,
} from "@/lib/swr/hooks";
import ProductSpecifications from "./product-specifications";

const ProductTabs = () => {
  const iconStyle = { width: rem(14), height: rem(14) };
  const { product } = useParams<{ product: string }>();
  const productId = product.split("-")[1];
  const { reviewData } = useGetProductReviewsQuery(productId);

  return (
    <Tabs defaultValue="description" mt={20}>
      <Tabs.List>
        <Tabs.Tab
          value="description"
          leftSection={<IconFile style={iconStyle} />}
        >
          Description
        </Tabs.Tab>
        <Tabs.Tab
          value="specifications"
          leftSection={<IconTruck style={iconStyle} />}
        >
          Specifications
        </Tabs.Tab>
        <Tabs.Tab
          value="reviews"
          leftSection={<IconMessage style={iconStyle} />}
        >
          Reviews ({reviewData?.stats.totalReviews ?? 0})
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description">
        <ProductDescription />
      </Tabs.Panel>

      <Tabs.Panel value="specifications">
        {/* <ProductInquiries /> */}
        <ProductSpecifications />
      </Tabs.Panel>

      <Tabs.Panel value="reviews">
        <ProductReviews />
      </Tabs.Panel>
    </Tabs>
  );
};

export default ProductTabs;
