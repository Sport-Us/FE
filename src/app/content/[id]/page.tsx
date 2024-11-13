"use client";

import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContentDetail() {
  const searchParams = useSearchParams();
  const contentTitle = searchParams.get("title") || "Default Title";

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white">
      <Header title={contentTitle} showBackButton={true} />

      <div className="flex flex-col w-[343px] items-start gap-4 mt-4">
        <div className="w-full h-[200px] bg-gray-300"></div>
        <div className="w-full h-[200px] bg-gray-300"></div>
        <div className="w-full h-[200px] bg-gray-300"></div>
      </div>

      <Footer />
    </div>
  );
}
