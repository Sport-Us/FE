"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      fetch(`/login/oauth2/code/naver?code=${code}&state=${state}`, {
        method: "GET",
        redirect: "follow",
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`요청 실패: ${response.status}`);
          }
          
          const redirectUrl = response.url;
          if (redirectUrl) {
            window.location.href = redirectUrl; 
          } else {
            throw new Error("리다이렉션 URL이 없습니다.");
          }
        })
        .catch((error) => {
          console.error("오류 발생:", error);
          router.push("/login");
        });
    } else {
      console.error("Authorization Code와 State가 없습니다.");
      router.push("/login");
    }
  }, [router]);

  return <div>로그인 처리 중...</div>;
}
