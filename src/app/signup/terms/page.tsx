"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm h-[30%] p-6 overflow-auto"
        style={{
          overflow: "hidden",
        }}
      >
        <h2 className="text-lg font-semibold mb-5 text-center">{title}</h2>
        <p
          className="text-sm text-gray-800 mb-6 whitespace-pre-line"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
};

const privacyPolicyContent = `Sport:Us는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하며, 이를 이용하여 맞춤형 서비스를 제공합니다.

수집되는 정보는 안전하게 보호되며 필요시 마케팅 목적으로도 활용될 수 있습니다.`;

const serviceTermsContent = `Sport:Us 서비스 이용 약관은 여러분의 서비스 이용과 관련한 기본적인 권리 및 의무를 규정합니다.

서비스 제공자는 이용자의 데이터를 안전하게 관리하고, 불법 행위를 방지하며, 이용자는 이를 준수하여 정당한 사용을 보장받습니다.

구체적인 조항은 회사의 정책에 따라 수정될 수 있습니다.`;

export default function TermsAgreement() {
  const router = useRouter();

  const [allChecked, setAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    privacyPolicy: false,
    serviceTerms: false,
  });
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: "",
    content: "",
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

  const openModal = (title: string, content: string) => {
    setModalInfo({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: "", content: "" });
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
          <span
            className="text-[#D2D3D3] text-[12px] font-normal leading-[18px] underline cursor-pointer"
            onClick={() => openModal("개인정보 처리방침", privacyPolicyContent)}
          >
            약관 상세보기
          </span>
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
          <span
            className="text-[#D2D3D3] text-[12px] font-normal leading-[18px] underline cursor-pointer"
            onClick={() => openModal("서비스 이용약관", serviceTermsContent)}
          >
            약관 상세보기
          </span>
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

      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => closeModal()}
        title={modalInfo.title}
        content={modalInfo.content}
      />
    </div>
  );
}
