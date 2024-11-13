"use client"; 

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleEmailLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="mb-10">
        <Image src="/logo.png" alt="Sportus Logo" width={279} height={279} />
      </div>
      <div className="flex flex-col gap-4 w-4/5 max-w-xs">
        <button className="flex items-center justify-center h-14 px-8 gap-4 w-full bg-[#03C75A] rounded-md text-white font-semibold text-[16px] leading-6">
          <Image src="/naver.png" alt="Naver Icon" width={16} height={16} />
          네이버로 시작하기
        </button>

        <button
          onClick={handleEmailLoginClick}
          className="flex items-center justify-center h-14 px-8 gap-4 w-full bg-white border border-gray-300 rounded-md text-gray-500 font-semibold text-[16px] leading-6"
        >
          이메일로 시작하기
        </button>
      </div>
    </div>
  );
}
