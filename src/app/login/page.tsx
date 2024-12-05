"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { axios } from "@/lib/axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isLoginEnabled = email.trim() !== "" && password.trim() !== "";

  const handleLoginClick = async () => {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");

    try {
      const response = await axios.post(
        "/auth/sign-in",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    
      if (response.data?.isSuccess) {
        const results = response.data.results || {}; 
        const accessToken = results.accessToken || ""; 
        const refreshToken = results.refreshToken || "";

        const isOnboarded = results.isOnboarded || false; 
  
        if (accessToken) {
          window.localStorage.setItem("accessToken", accessToken);
          // console.log("Access Token 저장 성공:", accessToken);
        } else {
          console.warn("AccessToken이 응답에 없습니다.");
        }
        if (refreshToken) {
          window.localStorage.setItem("refreshToken", refreshToken);
        } else {
          console.warn("RefreshToken이 응답에 없습니다.");
        }
        if (isOnboarded) {
          router.push("/home"); 
        } else {
          router.push("/onboarding");
        }
      } else {
        throw new Error("로그인 실패: isSuccess가 false입니다.");
      }
    } catch (error) {
      // console.error("로그인 실패:", error);
      setError("이메일과 비밀번호를 확인해주세요.");
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4">
      <Header title="로그인" />

      <div className="mt-2 mb-10">
        <Image src="/logo.png" alt="Logo" width={130} height={130} />
      </div>

      <div className="w-full max-w-xs space-y-[28px] mb-[110px]">
        <input
          type="email"
          placeholder="이메일을 입력해 주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-13 px-4 py-3 items-center w-full rounded-lg bg-[#F8F9FA] text-[#8E9398] placeholder-[#8E9398] text-[14px] leading-[21px] font-normal"
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex h-13 px-4 py-3 items-center w-full rounded-lg bg-[#F8F9FA] text-[#8E9398] placeholder-[#8E9398] text-[14px] leading-[21px] font-normal"
        />
        {error && <p className="text-[#FF5252] text-[12px]">{error}</p>}

        <button
          onClick={handleLoginClick}
          disabled={!isLoginEnabled}
          className={`flex justify-center items-center rounded-lg w-[343px] h-[50px] text-center text-[14px] font-semibold ${
            isLoginEnabled
              ? "bg-[#0187BA] text-white"
              : "bg-[#F8F9FA] text-[#8E9398]"
          }`}
          style={{
            gap: "10px",
            flexShrink: 0,
            borderRadius: "10px",
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "21px",
          }}
        >
          로그인
        </button>
      </div>

      <p className="w-full text-center text-[#8E9398] text-[12px] leading-[18px] font-semibold mb-[16px]">
        SNS 계정으로 로그인하기
      </p>

      <div className="flex gap-6 mb-[16px]">
        <button className="w-[54px] h-[54px] bg-[#03C75A] rounded-full flex items-center justify-center">
          <Image src="/naver.png" alt="Naver Icon" width={20} height={20} />
        </button>
      </div>

      <Link
        href="/signup/terms"
        className="text-[#1A1A1B] text-center text-[12px] leading-[18px] font-bold"
      >
        회원가입
      </Link>
    </div>
  );
}
