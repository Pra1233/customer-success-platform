"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { LandingPage } from "@/components/marketing/LandingPage";

export default function Home() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const hasToken = !!window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (hasToken) {
      router.replace("/dashboard");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage (browser-only) requires an effect; this is the sync point, not a derivable render value
      setCheckedAuth(true);
    }
  }, [router]);

  if (!checkedAuth) return null;

  return <LandingPage />;
}
