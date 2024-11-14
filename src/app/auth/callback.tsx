"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
  
    if (code) {
      fetch(`/api/auth/naver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.accessToken) {
          localStorage.setItem("authToken", data.accessToken);
          router.push("/");
        } else {
          console.error("토큰 발급 실패");
          router.push("/login");
        }
      })
      .catch(error => {
        console.error("오류 발생:", error);
        router.push("/login");
      });
    } else {
      console.error("Authorization Code가 없습니다.");
      router.push("/login");
    }
  }, [router]);
  

  return <div>로그인 중...</div>;
}
