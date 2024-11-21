"use client";

import { useEffect, useState } from "react";import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {axios} from "../../lib/axios";

interface ContentItem {
  id: number;
  title: string;
}

export default function Content() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchContentItems = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
  
        if (!accessToken) {
          throw new Error("AccessToken is missing.");
        }
  
        const response = await axios.get("/card-news", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        console.log("Response:", response.data);
  
        if (response.data.isSuccess) {
          setContentItems(response.data.results); // 결과를 상태에 저장
        } else {
          console.error("API Error:", response.data.message);
          setError(response.data.message);
        }
      } catch (err: any) {
        console.error("Error fetching content items:", err);
        if (err.response?.status === 500) {
          setError("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchContentItems();
  }, []);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }




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
