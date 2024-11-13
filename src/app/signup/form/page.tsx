"use client";

import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();

  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNextClick = () => {
    router.push("/signup/profile");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 relative">
      <Header title="회원가입" />

      <form className="w-full max-w-xs mt-[62px] space-y-6">
        <div>
          <label className="block text-black text-[14px] font-semibold leading-[21px] mb-1">
            생년월일
          </label>
          <input
            type="text"
            placeholder="8자리 입력"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
              setErrors((prev) => ({
                ...prev,
                birthDate:
                  e.target.value.length === 8
                    ? ""
                    : "생년월일을 8자리로 입력해 주세요.",
              }));
            }}
            className="flex h-[52px] px-[16px] items-center gap-[4px] w-full rounded-[8px] bg-[#F8F9FA] text-[#8E9398] text-[14px] font-normal leading-[21px]"
          />
          <p className="text-[#8E9398] text-[12px] leading-[18px] mt-1">
            {errors.birthDate}
          </p>
        </div>

        <div>
          <label className="block text-black text-[14px] font-semibold leading-[21px] mb-1">
            이메일
          </label>
          <input
            type="email"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(e.target.value)
                  ? ""
                  : "올바른 이메일 형식이 아닙니다.",
              }));
            }}
            className="flex h-[52px] px-[16px] items-center gap-[4px] w-full rounded-[8px] bg-[#F8F9FA] text-[#8E9398] text-[14px] font-normal leading-[21px]"
          />
          <p className="text-[#8E9398] text-[12px] leading-[18px] mt-1">
            {errors.email}
          </p>
        </div>

        <div>
          <label className="block text-black text-[14px] font-semibold leading-[21px] mb-1">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="영문+숫자 조합 8자 이상"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: validatePassword(e.target.value)
                  ? ""
                  : "비밀번호는 영문+숫자 조합 8자 이상이어야 합니다.",
              }));
            }}
            className="flex h-[52px] px-[16px] items-center gap-[4px] w-full rounded-[8px] bg-[#F8F9FA] text-[#8E9398] text-[14px] font-normal leading-[21px]"
          />
          <p className="text-[#8E9398] text-[12px] leading-[18px] mt-1">
            {errors.password}
          </p>
        </div>

        <div>
          <label className="block text-black text-[14px] font-semibold leading-[21px] mb-1">
            비밀번호 확인
          </label>
          <input
            type="password"
            placeholder="동일한 비밀번호를 입력해 주세요."
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword:
                  e.target.value === password
                    ? ""
                    : "비밀번호가 일치하지 않습니다.",
              }));
            }}
            className="flex h-[52px] px-[16px] items-center gap-[4px] w-full rounded-[8px] bg-[#F8F9FA] text-[#8E9398] text-[14px] font-normal leading-[21px]"
          />
          <p className="text-[#8E9398] text-[12px] leading-[18px] mt-1">
            {errors.confirmPassword}
          </p>
        </div>
      </form>

      <button
        onClick={handleNextClick}
        className="flex justify-center items-center w-[343px] h-[50px] rounded-[10px] bg-[#0187BA] text-white text-[14px] font-semibold absolute left-1/2 transform -translate-x-1/2 bottom-[68px]"
      >
        다음
      </button>
    </div>
  );
}
