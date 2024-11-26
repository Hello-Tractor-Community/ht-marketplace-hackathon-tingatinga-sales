import { useGetTractorListingQuery } from "@/lib/swr/hooks";
import { Flex, Loader, LoadingOverlay, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import ProductFilters from "../filter";
import ProductCard from "./product-card";
import { TractorFilters } from "@/lib/context/types";

const ProductListing = () => {
  const params = useSearchParams();
  const filters: TractorFilters = {
    make: params.get("make") ?? "",
    model: params.get("model") ?? "",
    minPrice: params.get("minPrice")
      ? Number(params.get("minPrice"))
      : undefined,
    maxPrice: params.get("maxPrice")
      ? Number(params.get("maxPrice"))
      : undefined,
    hoursUsed: params.get("hoursUsed")
      ? Number(params.get("hoursUsed"))
      : undefined,
    transmissionType: params.get("transmission") ?? "",
    wheelType: params.get("wheelType") ?? "",
    country: params.get("country") ?? "",
    region: params.get("state") ?? "",
    city: params.get("city") ?? "",
  };
  const { tractors, isLoading } = useGetTractorListingQuery(filters);

  return (
    <div className="container mx-auto px-4">
      <Flex gap="md">
        <ProductFilters />
        <div>
          <LoadingOverlay visible={isLoading} loaderProps={{ type: "bars" }} />
          {tractors && tractors?.length > 0 ? (
            <div className="flex flex-wrap gap-4 items-stretch">
              {tractors.map((tractor) => (
                <ProductCard key={tractor.id} {...tractor} />
              ))}
            </div>
          ) : (
            <Text c="dimmed" size="sm" className="text-center">
              No tractors Found
            </Text>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default ProductListing;
