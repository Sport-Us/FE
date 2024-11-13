"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function ProfileSetup() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male"); // 기본값을 "male"로 설정

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setIsNicknameValid(value.trim().length > 0);
  };

  const handleNicknameCheck = () => {
    alert("닉네임 중복 확인 중...");
  };

  const handleNextClick = () => {
    router.push("/signup/complete");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 relative">
      <Header title="회원가입" showBackButton={true} />

      <div className="w-full max-w-xs mt-[62px] text-left mb-6">
        <p className="text-[18px] font-semibold">반가워요!</p>
        <p className="text-[18px] font-semibold">프로필을 등록해 주세요</p>
      </div>

      <div className="relative mb-6">
        <Image
          src="/profile.png"
          alt="프로필 이미지"
          width={100}
          height={100}
          className="rounded-full bg-[#F8F9FA]"
        />
        <div className="absolute bottom-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <g clipPath="url(#clip0_407_2745)">
              <path
                d="M24.5 12C24.5 5.37258 19.1274 0 12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 18.6274 5.87258 24 12.5 24C19.1274 24 24.5 18.6274 24.5 12Z"
                fill="#0187BA"
              />
              <path
                d="M16.5001 10.6665H13.8334V7.99984C13.8334 7.64624 13.6929 7.30709 13.4429 7.05701C13.1928 6.80698 12.8537 6.6665 12.5001 6.6665C12.1465 6.6665 11.8073 6.80698 11.5573 7.05701C11.3072 7.30709 11.1667 7.64624 11.1667 7.99984L11.2141 10.6665H8.50008C8.14648 10.6665 7.80733 10.807 7.55725 11.057C7.30723 11.3071 7.16675 11.6462 7.16675 11.9998C7.16675 12.3534 7.30723 12.6926 7.55725 12.9427C7.80733 13.1927 8.14648 13.3332 8.50008 13.3332L11.2141 13.2859L11.1667 15.9998C11.1667 16.3534 11.3072 16.6926 11.5573 16.9427C11.8073 17.1927 12.1465 17.3332 12.5001 17.3332C12.8537 17.3332 13.1928 17.1927 13.4429 16.9427C13.6929 16.6926 13.8334 16.3534 13.8334 15.9998V13.2859L16.5001 13.3332C16.8537 13.3332 17.1928 13.1927 17.4429 12.9427C17.6929 12.6926 17.8334 12.3534 17.8334 11.9998C17.8334 11.6462 17.6929 11.3071 17.4429 11.057C17.1928 10.807 16.8537 10.6665 16.5001 10.6665Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_407_2745">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div className="w-full max-w-xs mb-6">
        <label className="block text-black text-[14px] font-semibold mb-2">
          성별
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setGender("male")}
            className={`flex w-[160px] h-[52px] rounded-[10px] border text-[12px] font-semibold justify-center items-center ${
              gender === "male"
                ? "bg-[#0187BA] text-white"
                : "border-[#8E9398] bg-white text-[#8E9398]"
            }`}
          >
            남
          </button>
          <button
            onClick={() => setGender("female")}
            className={`flex w-[160px] h-[52px] rounded-[10px] border text-[12px] font-semibold justify-center items-center ${
              gender === "female"
                ? "bg-[#0187BA] text-white"
                : "border-[#8E9398] bg-white text-[#8E9398]"
            }`}
          >
            여
          </button>
        </div>
      </div>

      <div className="w-full max-w-xs">
        <label className="block text-black text-[14px] font-semibold mb-2">
          닉네임
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="닉네임을 입력해 주세요."
            value={nickname}
            onChange={handleNicknameChange}
            className="flex h-[52px] px-[16px] items-center gap-[4px] w-full rounded-[8px] bg-[#F8F9FA] text-[#8E9398] text-[14px]"
          />
          <button
            onClick={handleNicknameCheck}
            disabled={!isNicknameValid}
            className={`flex w-[80px] h-[52px] px-[8px] rounded-[10px] justify-center items-center font-semibold text-[12px] whitespace-nowrap ${
              isNicknameValid
                ? "bg-[#0187BA] text-white"
                : "bg-[#F8F9FA] text-[#8E9398]"
            }`}
          >
            중복 확인
          </button>
        </div>
      </div>

      <button
        onClick={handleNextClick}
        className="flex justify-center items-center w-[343px] h-[50px] mt-10 rounded-[10px] bg-[#0187BA] text-white text-[14px] font-semibold absolute left-1/2 transform -translate-x-1/2 bottom-[68px]"
      >
        다음
      </button>
    </div>
  );
}
