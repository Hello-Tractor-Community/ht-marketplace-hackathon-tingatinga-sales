"use client";
import { URLS } from "@/lib/urls/urls";
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const SellersPage = () => {
  const { data } = useSession();
  const router = useRouter();

  return (
    <>
      {!data?.user.sellerId && (
        <Button onClick={() => router.push(URLS.SELLER_PROFILE_CREATION)}>
          Become a Seller
        </Button>
      )}
      {data?.user.sellerId && data.user.businessName && (
        <Button
          onClick={() =>
            router.push(URLS.SELLERS_PROFILE(data.user.businessName!))
          }
        >
          View Profile
        </Button>
      )}
    </>
  );
};

export default SellersPage;
