import { SERVER_DIRECTORY } from "next/dist/shared/lib/constants";

export const URLS = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  CHAT: "/chat",
  HOME: "/",
  TRACTOR_DEALERS: "/tractor-dealers",
  PROFILE: "/account/profile",
  SELLER_DASHBOARD: "/",
  SELLER_VIEWS: "/sellers/views",
  SELLER_MESSAGES: "/sellers/messages",
  SELLER_SALES: "/sales",
  SELLER_PROFILE_CREATION: "/sellers/create",
  SELLER_ANALYTIC_DASHBOARD: "/analytics-dashboard",

  PRODUCT_CREATE: "/product-create",
  SELLERS_PROFILE: (businessName: string) => `/sellers/${businessName}`,
  PRODUCT_CATEGORY: (category: string) => `/${category}`,
  PRODUCT_DETAIL: (category: string, productName: string, id: string) =>
    `/${category}/${productName}-${id}`,
  PRODUCT_CHECKOUT: (category: string, productName: string, id: string) =>
    `/${category}/${productName}-${id}/checkout`,
};
