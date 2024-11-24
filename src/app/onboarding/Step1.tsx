"use client";

import { useState } from "react";

interface Step1Props {
  onNext: (selectedItems: string[]) => void;
}

export default function Step1({ onNext }: Step1Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemClick = (item: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const isNextButtonEnabled = selectedItems.length >= 3;

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-[60px]">
      <h2 className="text-[20px] font-semibold text-center text-[#1A1A1B] leading-[30px]">
        관심사를 선택하세요
      </h2>
      <p className="text-[10px] font-medium text-center text-[#868686] leading-[21px]">
        최소 3개 이상 선택해 주세요
      </p>

      <div className="grid grid-cols-3 gap-y-[32px] gap-x-[24px] mt-[26px]">
        {[
          "축구",
          "농구",
          "야구",
          "탁구",
          "배구",
          "스쿼시",
          "배드민턴",
          "테니스",
          "골프",
          "태권도",
          "유도",
          "복싱",
          "주짓수",
          "검도",
          "합기도",
          "헬스",
          "요가",
          "필라테스",
          "크로스핏",
          "에어로빅",
          "댄스",
        ].map((item, index) => {
          const isSelected = selectedItems.includes(item);

          return (
            <button
              key={item}
              onClick={() => handleItemClick(item)}
              className={`relative w-[73px] h-[27px] border rounded-full text-sm text-center 
                ${
                  isSelected
                    ? "bg-[#1A1A1B] text-white"
                    : "bg-white text-black border-[#E8E8E8]"
                }
              `}
            >
              {isSelected && (
                <span className="absolute -top-1 -left-2 w-[16px] h-[16px] bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center border border-[#1A1A1B]">
                  {selectedItems.indexOf(item) + 1}
                </span>
              )}
              {item}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-[68px] flex flex-col items-center space-y-2">
        <div className="flex space-x-2 mb-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#000000" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#E8E8E8" />
          </svg>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#E8E8E8" />
          </svg>
        </div>

        <button
          onClick={() => onNext(selectedItems)}
          disabled={!isNextButtonEnabled}
          className={`flex justify-center items-center w-[343px] h-[50px] rounded-[10px] text-[14px] font-semibold leading-[21px] ${
            isNextButtonEnabled
              ? "bg-[#0187BA] text-white"
              : "bg-[#E8E8E8] text-[#FFFFFF]"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
