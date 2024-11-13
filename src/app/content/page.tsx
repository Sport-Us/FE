"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Content() {
  const contentItems = [
    { id: 1, title: "제목1" },
    { id: 2, title: "제목2"  },
    { id: 3, title: "제목3"  },
    { id: 4, title: "제목4"  },
    { id: 5, title: "제목5"  },
  ];

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white">
      <Header title="콘텐츠" showBackButton={false} />

      <div className="flex flex-col w-[343px] items-start gap-[9px] mt-4">
        {contentItems.map((item) => (
          <Link
            key={item.id}
            href={`/content/${item.id}?title=${encodeURIComponent(item.title)}`}
            passHref
          >
            <div className="flex items-center gap-[8px] w-full cursor-pointer">
              <div className="w-[70px] h-[70px] bg-gray-300 flex-shrink-0"></div>
              
              <span className="text-black font-semibold text-[14px] leading-[21px]" style={{ fontFamily: "Inter" }}>
                {item.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
}
