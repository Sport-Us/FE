"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Content() {
  const contentItems = [
    "제목1",
    "제목2",
    "제목3",
    "제목4",
    "제목5",
  ];

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white">
      
      <Header title="콘텐츠" showBackButton={false} />

      <div className="flex flex-col w-[343px] items-start gap-[9px] mt-4">
        {contentItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-[8px] w-full"
          >
            <div className="w-[70px] h-[70px] bg-gray-300 flex-shrink-0"></div>
            
            <span className="text-black font-semibold text-[14px] leading-[21px]" style={{ fontFamily: "Inter" }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
