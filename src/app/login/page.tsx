"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";

export default function Login() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4">
      <Header title="로그인" />

      <div className="mt-2 mb-10">
        <Image
          src="/logo.png"
          alt="Logo"
          width={130}
          height={130}
        />
      </div>

      <div className="w-full max-w-xs space-y-[28px] mb-[110px]">
        <input
          type="email"
          placeholder="이메일을 입력해 주세요."
          className="flex h-13 px-4 py-3 items-center w-full rounded-lg bg-[#F8F9FA] text-[#8E9398] placeholder-[#8E9398] text-[14px] leading-[21px] font-normal"
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className="flex h-13 px-4 py-3 items-center w-full rounded-lg bg-[#F8F9FA] text-[#8E9398] placeholder-[#8E9398] text-[14px] leading-[21px] font-normal"
        />
        <button className="flex w-full h-[50px] mt-[10px] justify-center items-center rounded-lg bg-[#0187BA] text-white text-center text-[14px] leading-[21px] font-semibold">
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
