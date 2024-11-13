"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function SignupComplete() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push("/"); 
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-4 relative">
      <Header title="회원가입" />

      <div className="flex flex-col items-center mt-[150px] mb-6">
        <div className="w-[100px] h-[100px] mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 101 100"
            fill="none"
          >
            <path
              d="M50.4999 91.6668C73.5118 91.6668 92.1666 73.012 92.1666 50.0002C92.1666 26.9883 73.5118 8.3335 50.4999 8.3335C27.4881 8.3335 8.83325 26.9883 8.83325 50.0002C8.83325 73.012 27.4881 91.6668 50.4999 91.6668Z"
              fill="#0187BA"
            />
            <path
              d="M31.7499 50.0002L44.2499 62.5002L69.2499 37.5002M92.1666 50.0002C92.1666 73.012 73.5118 91.6668 50.4999 91.6668C27.4881 91.6668 8.83325 73.012 8.83325 50.0002C8.83325 26.9883 27.4881 8.3335 50.4999 8.3335C73.5118 8.3335 92.1666 26.9883 92.1666 50.0002Z"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-center text-[20px] font-semibold text-[#000] leading-[30px]">
          ooo 님,
        </p>
        <p className="text-center text-[20px] font-semibold text-[#000] leading-[30px]">
          회원가입이 완료되었습니다!
        </p>
      </div>

      <button
        onClick={handleStartClick}
        className="flex justify-center items-center w-[343px] h-[50px] rounded-[10px] bg-[#0187BA] text-white text-[14px] font-semibold absolute left-1/2 transform -translate-x-1/2 bottom-[68px]"
      >
        시작하기
      </button>
    </div>
  );
}
