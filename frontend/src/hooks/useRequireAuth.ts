import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";


export function useRequireAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      router.replace("/login");
      return;
    }
    dispatch(fetchCurrentUser()).unwrap().catch(() => router.replace("/login"));
  }, []);

  return { user, isReady: !!user };
}
