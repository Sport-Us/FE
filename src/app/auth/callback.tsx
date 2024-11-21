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
      console.log("Query String:", window.location.search);

      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");

      console.log("Extracted Access Token:", accessToken);
      console.log("Extracted Refresh Token:", refreshToken);

      if (accessToken && refreshToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          setTimeout(() => {
            router.push("/home");
          }, 100);
        } catch (error) {
          console.error("로컬 스토리지에 저장 중 오류 발생:", error);
          router.push("/login");
        }
      } else {
        console.error("accessToken 또는 refreshToken이 없습니다.");
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
