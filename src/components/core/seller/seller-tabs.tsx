"use client";
import { sellerTabs } from "@/lib/constants";
import { rem, Tabs } from "@mantine/core";
import {
  IconAddressBook,
  IconBuildingStore,
  IconMapPin,
  IconMessage,
} from "@tabler/icons-react";
import { useQueryState } from "nuqs";
import SellerContact from "./seller-contact";
import SellerLocation from "./seller-location";
import SellerReviews from "./seller-reviews";
import SellerProducts from "./seller-products";
import { useParams } from "next/navigation";
import { useGetSellerReviewsQuery } from "@/lib/swr/hooks";

export const SellerTabs = () => {
  const { businessName } = useParams<{ businessName: string }>();
  const { reviewData } = useGetSellerReviewsQuery(businessName);
  
  const iconStyle = { width: rem(14), height: rem(14) };
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: sellerTabs.PRODUCTS,
    clearOnDefault: true,
  });

  return (
    <>
      <Tabs defaultValue={tab} mt={20}>
        <Tabs.List>
          <Tabs.Tab
            onClick={() => setTab(sellerTabs.PRODUCTS)}
            value={sellerTabs.PRODUCTS}
            leftSection={<IconBuildingStore style={iconStyle} />}
          >
            Products
          </Tabs.Tab>
          <Tabs.Tab
            onClick={() => setTab(sellerTabs.CONTACT)}
            value={sellerTabs.CONTACT}
            leftSection={<IconAddressBook style={iconStyle} />}
          >
            Contact
          </Tabs.Tab>
          <Tabs.Tab
            onClick={() => setTab(sellerTabs.LOCATION)}
            value={sellerTabs.LOCATION}
            leftSection={<IconMapPin style={iconStyle} />}
          >
            Location
          </Tabs.Tab>
          <Tabs.Tab
            onClick={() => setTab(sellerTabs.REVIEWS)}
            value={sellerTabs.REVIEWS}
            leftSection={<IconMessage style={iconStyle} />}
          >
            Reviews ({reviewData?.stats.totalReviews ?? 0})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={sellerTabs.PRODUCTS}>
          <SellerProducts />
        </Tabs.Panel>

        <Tabs.Panel value={sellerTabs.CONTACT}>
          <SellerContact />
        </Tabs.Panel>

        <Tabs.Panel value={sellerTabs.LOCATION}>
          <SellerLocation />
        </Tabs.Panel>

        <Tabs.Panel value={sellerTabs.REVIEWS}>
          <SellerReviews />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
