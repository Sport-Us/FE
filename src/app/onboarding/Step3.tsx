"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step3() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = [
    "다이어트",
    "근육 강화",
    "취미 및 여가 활동",
    "재활",
    "스트레스 해소",
    "대회 준비",
  ];

  const handleItemClick = (item: string) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  const handleStartClick = () => {
    router.push("/home");
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-[60px]">
      <h2 className="text-[20px] font-semibold text-center text-[#1A1A1B] leading-[30px]">
        사용 목적을 선택하세요
      </h2>

      <div className="mt-[20px] px-2 space-y-[17px]">
        {items.map((item) => {
          const isSelected = item === selectedItem;

          return (
            <div
              key={item}
              onClick={() => handleItemClick(item)}
              className={`flex items-center justify-between w-[343px] h-[61px] px-4 cursor-pointer 
                rounded-[10px] border text-[#1A1A1B] font-medium text-[14px] leading-[21px] 
                ${
                  isSelected
                    ? "border-[#0187BA] bg-white"
                    : "border-[#E8E8E8] bg-white"
                }`}
            >
              <span>{item}</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <path
                  d={
                    isSelected
                      ? "M10.5 15.75C11.8924 15.75 13.2277 15.1969 14.2123 14.2123C15.1969 13.2277 15.75 11.8924 15.75 10.5C15.75 9.10761 15.1969 7.77226 14.2123 6.78769C13.2277 5.80312 11.8924 5.25 10.5 5.25C9.10761 5.25 7.77226 5.80312 6.78769 6.78769C5.80312 7.77226 5.25 9.10761 5.25 10.5C5.25 11.8924 5.80312 13.2277 6.78769 14.2123C7.77226 15.1969 9.10761 15.75 10.5 15.75ZM10.5 0C9.12112 -2.05469e-08 7.75574 0.27159 6.48182 0.799265C5.20791 1.32694 4.05039 2.10036 3.07538 3.07538C2.10036 4.05039 1.32694 5.20791 0.799265 6.48182C0.271591 7.75574 0 9.12112 0 10.5C0 11.8789 0.271591 13.2443 0.799265 14.5182C1.32694 15.7921 2.10036 16.9496 3.07538 17.9246C4.05039 18.8996 5.20791 19.6731 6.48182 20.2007C7.75574 20.7284 9.12112 21 10.5 21C13.2848 21 15.9555 19.8938 17.9246 17.9246C19.8938 15.9555 21 13.2848 21 10.5C21 7.71523 19.8938 5.04451 17.9246 3.07538C15.9555 1.10625 13.2848 4.14964e-08 10.5 0ZM1.75 10.5C1.75 8.17936 2.67187 5.95376 4.31282 4.31282C5.95376 2.67187 8.17936 1.75 10.5 1.75C12.8206 1.75 15.0462 2.67187 16.6872 4.31282C18.3281 5.95376 19.25 8.17936 19.25 10.5C19.25 12.8206 18.3281 15.0462 16.6872 16.6872C15.0462 18.3281 12.8206 19.25 10.5 19.25C8.17936 19.25 5.95376 18.3281 4.31282 16.6872C2.67187 15.0462 1.75 12.8206 1.75 10.5Z"
                      : "M10.5 1.75C8.17936 1.75 5.95376 2.67187 4.31282 4.31282C2.67187 5.95376 1.75 8.17936 1.75 10.5C1.75 12.8206 2.67187 15.0462 4.31282 16.6872C5.95376 18.3281 8.17936 19.25 10.5 19.25C12.8206 19.25 15.0462 18.3281 16.6872 16.6872C18.3281 15.0462 19.25 12.8206 19.25 10.5C19.25 8.17936 18.3281 5.95376 16.6872 4.31282C15.0462 2.67187 12.8206 1.75 10.5 1.75ZM0 10.5C-2.05469e-08 9.12112 0.27159 7.75574 0.799265 6.48182C1.32694 5.20791 2.10036 4.05039 3.07538 3.07538C4.05039 2.10036 5.20791 1.32694 6.48182 0.799265C7.75574 0.271591 9.12112 0 10.5 0C11.8789 0 13.2443 0.271591 14.5182 0.799265C15.7921 1.32694 16.9496 2.10036 17.9246 3.07538C18.8996 4.05039 19.6731 5.20791 20.2007 6.48182C20.7284 7.75574 21 9.12112 21 10.5C21 13.2848 19.8938 15.9555 17.9246 17.9246C15.9555 19.8938 13.2848 21 10.5 21C7.71523 21 5.04451 19.8938 3.07538 17.9246C1.10625 15.9555 4.14964e-08 13.2848 0 10.5Z"
                  }
                  fill={isSelected ? "#0187BA" : "#E8E8E8"}
                />
              </svg>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-[68px] flex flex-col items-center space-y-2">
        <div className="flex space-x-2 mb-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#E8E8E8" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#E8E8E8" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#000000" />
          </svg>
        </div>

        <button
          onClick={handleStartClick}
          className="flex justify-center items-center w-[343px] h-[50px] rounded-[10px] text-[14px] font-semibold leading-[21px] bg-[#0187BA] text-white"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
