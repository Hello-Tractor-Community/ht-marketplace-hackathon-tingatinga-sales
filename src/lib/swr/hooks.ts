import useSWR from "swr";
import { fetcher, postFetcher } from "./fetcher";
import useSWRMutation from "swr/mutation";
import {
  Category,
  EngineType,
  Product,
  Review,
  SellerProfile,
  Tractor,
  User,
} from "@prisma/client";
import { TProduct, TractorFilters } from "../context/types";
import { useCallback } from "react";

// Queries
type TSellerProfile = SellerProfile & { user: User };

type TProductTractor = Product & { seller: TSellerProfile; category: Category };

export type TTractor = Tractor & {
  product: TProductTractor;
};

// Filter interfaces based on your components
export const useUpdateUserProfileMutation = () => {
  const { data, isMutating, error, trigger } = useSWRMutation<User>(
    "api/users",
    postFetcher
  );

  return {
    user: data,
    isMutating,
    error,
    trigger,
  };
};

export const useGetUserQuery = () => {
  const { data, isLoading, isValidating, error, mutate } = useSWR<User>(
    "/api/users",
    fetcher
  );

  return {
    user: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useGetTractorListingQuery = (filters?: TractorFilters) => {
  // Create URL with query parameters
  const createQueryString = useCallback((filters: TractorFilters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      // Check for null, undefined, and empty string
      if (value !== null && value !== undefined && value !== "") {
        // Convert all values to string
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }, []); // Empty dependency array since this doesn't depend on any external values

  // Construct the URL with filters
  const url = `/api/categories/tractors${createQueryString(filters)}`;

  // Use SWR with proper typing
  const { data, error, isLoading, mutate } = useSWR<TTractor[], Error>(
    url,
    fetcher,
    {
      revalidateOnFocus: false, // Disable automatic revalidation on window focus
      revalidateOnReconnect: true, // Enable revalidation on reconnect
      dedupingInterval: 6000, // Dedupe requests within 5 seconds
    }
  );

  return {
    tractors: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useGetTractorDetailQuery = (productId: string) => {
  const { data, error, isLoading } = useSWR<TTractor>(
    `/api/categories/tractors?id=${productId}`,
    fetcher
  );

  return {
    tractor: data,
    isLoading,
    isError: error,
  };
};

export const useGetProductReviewsQuery = (productId: string) => {
  const { data, error, isLoading } = useSWR<TReviewData>(
    `/api/categories/tractors/reviews?id=${productId}`,
    fetcher
  );

  return {
    reviewData: data,
    isLoading,
    isError: error,
  };
};

export const useGetEngineTypesQuery = () => {
  const { data, error, isLoading } = useSWR<EngineType[]>(
    `/api/enginetypes`,
    fetcher
  );

  return {
    engineTypes: data,
    isLoading,
    isError: error,
  };
};

export const useGetCategoriesQuery = () => {
  const { data, error, isLoading } = useSWR<Category[]>(
    `/api/categories`,
    fetcher
  );

  return {
    categories: data,
    isLoading,
    isError: error,
  };
};

type TUser = User & { sellerProfile: { id: string; businessName: string } };

export const useGetCurrentUserQuery = (id: string) => {
  const { data, error, isLoading } = useSWR<TUser>(`/api/user/${id}`, fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
};

export const useGetSellerProfilesQuery = () => {
  const { data, error, isLoading } = useSWR(`/api/sellers`, fetcher);

  return {
    sellerProfiles: data,
    isLoading,
    isError: error,
  };
};

export const useGetSellerProfileQuery = (businessName: string) => {
  const { data, error, isLoading } = useSWR<SellerProfile>(
    `/api/sellers/detail/?businessName=${businessName}`,
    fetcher
  );

  return {
    sellerProfile: data,
    isLoading,
    isError: error,
  };
};

export type TReviewData = {
  reviews: TReviews[];
  stats: TReviewStats;
};

type TReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<string, number>;
};

type TReviews = Review & {
  user: User;
};

export const useGetSellerReviewsQuery = (businessName: string) => {
  const { data, error, isLoading } = useSWR<TReviewData>(
    `/api/sellers/reviews?businessName=${businessName}`,
    fetcher
  );

  return {
    reviewData: data,
    isLoading,
    isError: error,
  };
};

export const useGetSellerProductsQuery = (businessName: string) => {
  const { data, error, isLoading } = useSWR<TProduct[]>(
    `/api/sellers/products?businessName=${businessName}`,
    fetcher
  );

  return {
    products: data,
    isLoading,
    isError: error,
  };
};

// Mutations

export const useAddEngineTypeMutation = () => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/engine-types`,
    postFetcher
  );

  return {
    engineType: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useAddCategoryMutation = () => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/categories`,
    postFetcher
  );

  return {
    category: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useSignUpMutation = () => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/auth/signup`,
    postFetcher
  );

  return {
    user: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useCreateSellerProfileMutation = () => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/sellers`,
    postFetcher
  );

  return {
    sellerProfile: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useCreateProductMutation = (productType: string) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/products?productType=${productType}`,
    postFetcher
  );

  return {
    product: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useCreateSellerReviewMutation = (businessName: string) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/sellers/reviews?businessName=${businessName}`,
    postFetcher
  );

  return {
    review: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};

export const useCreateProductReviewMutation = (productId: string) => {
  const { data, error, isMutating, trigger, reset } = useSWRMutation(
    `/api/categories/tractors/reviews?id=${productId}`,
    postFetcher
  );

  return {
    review: data,
    error,
    isMutating,
    trigger,
    reset,
  };
};
