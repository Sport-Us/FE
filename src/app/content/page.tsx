"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axios } from "../../lib/axios";
import Loading from "../loading";

interface ContentItem {
  id: number;
  title: string;
  imageUrl: string;
}

export default function Content() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

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

        if (response.data.isSuccess) {
          const items = response.data.results.cardNewsList.map((item: any) => ({
            id: item.cardNewsId,
            title: item.title,
            imageUrl: item.cardImageUrl,
          }));
          setContentItems(items);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.log("Access token expired. Trying to refresh...");
          try {
            const refreshResponse = await axios.post("/auth/refresh", {
              refreshToken: localStorage.getItem("refreshToken"),
            });
            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);

            await fetchContentItems();
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        } else {
          console.error("Error fetching content items:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContentItems();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white">
  <Header title="콘텐츠" showBackButton={false} />

  <div className="flex-1 w-full overflow-y-auto pb-[72px]">
    <div className="flex flex-col w-[343px] mx-auto items-start gap-[12px] mt-4">
      {contentItems.map((item) => (
        <Link
          key={item.id}
          href={{
            pathname: `/content/${item.id}`,
            query: { title: item.title },
          }}
        >
          <div className="flex items-center gap-[12px] w-full cursor-pointer">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-[70px] h-[70px] bg-gray-300 object-cover flex-shrink-0"
            />
            <span
              className="text-black font-semibold text-[14px] leading-[21px]"
              style={{ fontFamily: "Inter" }}
            >
              {item.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>

  <Footer />
</div>


  );
}
