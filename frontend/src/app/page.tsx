"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hasToken = !!window.localStorage.getItem(ACCESS_TOKEN_KEY);
    router.replace(hasToken ? "/dashboard" : "/login");
  }, [router]);

  return null;
}
