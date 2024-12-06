"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { axios } from "@/lib/axios";

export default function EditProfile() {
  const router = useRouter();

  const [nickname, setNickname] = useState<string | null>(null);
  const [originalNickname, setOriginalNickname] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/users");
        if (response.data.isSuccess) {
          const { profileImageUrl, nickname } = response.data.results;
          setProfileImage(profileImageUrl || "/profile.png");
          setOriginalNickname(nickname);
          setNickname(nickname);
        } else {
          console.error("사용자 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setIsNicknameValid(value.trim().length > 0);
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.get("/auth/nickname/validation", {
        params: { nickname },
      });
      if (response.data.isSuccess) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
      alert("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put("/users/profile", { nickname });
      if (response.data.isSuccess) {
        alert("프로필이 저장되었습니다.");
        router.push("/mypage");
      } else {
        alert("프로필 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 relative">
      <Header title="프로필 수정" showBackButton={true} />

      <div className="relative mt-[62px] mb-6">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-[#F8F9FA]">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>
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

      <div className="w-full max-w-xs">
        <label
          className="block text-[#1A1A1B] font-semibold text-[14px] leading-[21px] mb-[8px]"
          style={{ fontFamily: "Inter" }}
        >
          닉네임
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={originalNickname || "닉네임을 입력해 주세요."}
            value={nickname || ""}
            onChange={handleNicknameChange}
            className="flex h-[52px] px-[16px] items-center gap-[4px] w-full rounded-[8px] bg-[#F8F9FA] text-[#8E9398] text-[14px] leading-[21px] font-normal"
            style={{ fontFamily: "Inter" }}
          />
          <button
            onClick={handleNicknameCheck}
            disabled={!isNicknameValid}
            className={`flex w-[80px] h-[52px] px-[8px] rounded-[10px] justify-center items-center font-semibold text-[12px] whitespace-nowrap ${
              isNicknameValid
                ? "bg-[#0187BA] text-white"
                : "bg-[#F8F9FA] text-[#8E9398]"
            }`}
            style={{ fontFamily: "Inter" }}
          >
            중복 확인
          </button>
        </div>
      </div>

      <button
        onClick={handleSaveClick}
        className="flex justify-center items-center w-[343px] h-[50px] mt-10 rounded-[10px] bg-[#0187BA] text-white text-[14px] font-semibold absolute left-1/2 transform -translate-x-1/2 bottom-[68px]"
        style={{ fontFamily: "Inter" }}
      >
        수정하기
      </button>
    </div>
  );
}
