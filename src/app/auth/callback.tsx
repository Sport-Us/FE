"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleTokenExtraction = () => {
      if (typeof window === "undefined") {
        console.error("브라우저 환경이 아닙니다.");
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      // console.log("Query String:", window.location.search);

      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");
      const isOnboarded = urlParams.get("isOnboarded") === "true"; // 온보딩 여부 확인

      if (accessToken && refreshToken) {
        try {
          // 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // 온보딩 여부에 따라 라우팅
          if (isOnboarded) {
            setTimeout(() => router.push("/home"), 100);
          } else {
            setTimeout(() => router.push("/onboarding"), 100);
          }
        } catch (error) {
          console.error("로컬 스토리지에 저장 중 오류 발생:", error);
          router.push("/login");
        }
      } else {
        console.error("토큰이 누락되었습니다.");
        router.push("/login");
      }
    };

    handleTokenExtraction();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <p>토큰 처리 중...</p>
    </div>
  );
}
