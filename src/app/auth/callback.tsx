"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code) {
      fetch(`/login/oauth2/code/naver?code=${code}&state=${state}`, {
        method: "GET",
        redirect: "manual",
      })
        .then((response) => {
          console.log("응답 상태 코드:", response.status);
          console.log("응답 헤더:", [...response.headers.entries()]);

          if (response.status === 302) {
            const authHeader = response.headers.get("Authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
              const token = authHeader.split(" ")[1];
              localStorage.setItem("authToken", token);
              console.log("토큰 저장 성공:", token);

              const redirectUrl = response.headers.get("Location");
              if (redirectUrl) {
                window.location.href = redirectUrl;
              } else {
                throw new Error("리다이렉션 URL이 없습니다.");
              }
            } else {
              throw new Error("Authorization 헤더가 없습니다.");
            }
          } else {
            throw new Error(`예상치 못한 상태 코드: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error("오류 발생:", error);
          router.push("/login");
        });
    } else {
      console.error("Authorization Code가 없습니다.");
      router.push("/login");
    }
  }, [router]);

  return <div>로그인 처리 중...</div>;
}
