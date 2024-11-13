"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "../../components/Header";

export default function TermsAgreement() {
  const router = useRouter();

  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    privacyPolicy: false,
    serviceTerms: false,
  });

  const isNextButtonEnabled =
    checkedItems.privacyPolicy && checkedItems.serviceTerms;

  const handleAllCheckedChange = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setCheckedItems({
      privacyPolicy: newCheckedState,
      serviceTerms: newCheckedState,
    });
  };

  const handleItemCheckedChange = (item: "privacyPolicy" | "serviceTerms") => {
    const newCheckedItems = {
      ...checkedItems,
      [item]: !checkedItems[item],
    };
    setCheckedItems(newCheckedItems);
    setAllChecked(
      newCheckedItems.privacyPolicy && newCheckedItems.serviceTerms
    );
  };

  const handleNextClick = () => {
    if (isNextButtonEnabled) {
      router.push("/signup/form");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 relative">
      <Header title="회원가입" showBackButton={true} />

      <div className="w-full max-w-xs text-left mt-[62px] mb-[28px]">
        <p className="text-[18px] font-semibold text-[#1A1A1B] leading-[27px]">
          Sport:Us 이용을 위해
        </p>
        <p className="text-[18px] font-semibold text-[#1A1A1B] leading-[27px]">
          약관에 동의해 주세요
        </p>
      </div>

      <div
        className="flex items-center h-[52px] px-[15px] gap-[9px] w-full max-w-xs border border-[#E8E8E8] rounded-[10px] bg-white mb-4 cursor-pointer"
        onClick={handleAllCheckedChange}
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill={allChecked ? "#1A1A1B" : "#D2D3D3"}
          >
            <circle cx="8" cy="8.5" r="8" />
            <path
              d="M4.8 8.8L7.5 10.9L11.2 6.1"
              stroke="white"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="font-semibold text-[16px]">전체 동의</span>
      </div>

      <div className="w-full max-w-xs space-y-4 mb-16 ml-[30px]">
        <div className="flex items-center gap-[9px]">
          <div
            className="flex items-center gap-[9px] cursor-pointer"
            onClick={() => handleItemCheckedChange("privacyPolicy")}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill={checkedItems.privacyPolicy ? "#1A1A1B" : "#D2D3D3"}
              >
                <circle cx="8" cy="8.5" r="8" />
                <path
                  d="M4.8 8.8L7.5 10.9L11.2 6.1"
                  stroke="white"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[14px]">(필수) 개인정보 처리방침</span>
          </div>
          <Link
            href="/"
            className="text-[#D2D3D3] text-[12px] font-normal leading-[18px] underline"
          >
            약관 상세보기
          </Link>
        </div>

        <div className="flex items-center gap-[9px]">
          <div
            className="flex items-center gap-[9px] cursor-pointer"
            onClick={() => handleItemCheckedChange("serviceTerms")}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill={checkedItems.serviceTerms ? "#1A1A1B" : "#D2D3D3"}
              >
                <circle cx="8" cy="8.5" r="8" />
                <path
                  d="M4.8 8.8L7.5 10.9L11.2 6.1"
                  stroke="white"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[14px]">(필수) 서비스 이용약관</span>
          </div>
          <Link
            href="/"
            className="text-[#D2D3D3] text-[12px] font-normal leading-[18px] underline"
          >
            약관 상세보기
          </Link>
        </div>
      </div>

      <button
        onClick={handleNextClick}
        disabled={!isNextButtonEnabled}
        className={`flex justify-center items-center w-[343px] h-[50px] rounded-[10px] text-[14px] font-semibold absolute left-1/2 transform -translate-x-1/2 bottom-[68px] ${
          isNextButtonEnabled
            ? "bg-[#0187BA] text-white"
            : "bg-[#F8F9FA] text-[#8E9398]"
        }`}
      >
        다음
      </button>
    </div>
  );
}
