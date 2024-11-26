import { Badge, Flex } from "@mantine/core";
import React from "react";

const ProductBadges = () => {
  return (
    <Flex>
      <Badge color="blue.5" autoContrast>
        In Stock
      </Badge>
      {/* <Badge color="red.5" autoContrast>
        Out of Stock
      </Badge>
      <Badge color="green.5" autoContrast>
        Pre-order
      </Badge> */}
    </Flex>
  );
};

export default ProductBadges;
