"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { axios } from "@/lib/axios";
import Loading from "@/app/loading";

interface Bookmark {
  bookmarkId: number;
  category: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  openHours: string;
}

const facilityCategories = [
  { name: "취약계층", eng: "DISABLED", bgColor: "#E5F9EE" },
  { name: "공공시설", eng: "PUBLIC", bgColor: "#E0F8F7" },
  { name: "학교", eng: "SCHOOL", bgColor: "#E0F4FD" },
  { name: "민간시설", eng: "PRIVATE", bgColor: "#E8EAF6" },
];

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [lastBookmarkId, setLastBookmarkId] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async (lastId: number) => {
    try {
      const response = await axios.get("/users/bookmark", {
        params: { lastBookMarkId: lastId },
      });
  
      if (response.data.isSuccess) {
        const { bookMarkList, hasNext } = response.data.results;
  
        setBookmarks((prev) => {
          const newBookmarks = bookMarkList.filter(
            (newBookmark: { bookmarkId: number; }) =>
              !prev.some((prevBookmark) => prevBookmark.bookmarkId === newBookmark.bookmarkId)
          );
          return [...prev, ...newBookmarks];
        });
  
        setHasNext(hasNext);
      } else {
        alert("북마크를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("북마크 가져오기 실패:", error);
      alert("북마크 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  

  const getCategoryInfo = (category: string) => {
    const categoryInfo = facilityCategories.find((item) => item.eng === category);
    return categoryInfo || { name: "기타", bgColor: "#F3F5F7" };
  };

  useEffect(() => {
    fetchBookmarks(0);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      <Header title="북마크" showBackButton={true} />

      {bookmarks.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh]">
          <p
            style={{
              color: "#000",
              fontFamily: "Inter",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "24px",
            }}
          >
            아직 저장한 장소가 없어요
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {bookmarks.map((bookmark) => {
            const { name, bgColor } = getCategoryInfo(bookmark.category);

            return (
              <div
                key={bookmark.bookmarkId}
                className="flex flex-col gap-[4px] pb-4 border-b"
                style={{
                  padding: "12px 6px",
                  borderBottom: "1px solid var(--Gray-200, #E8E8E8)",
                }}
              >
                <div
                  className="inline-flex items-center h-[24px] px-[8px] rounded-[2px]"
                  style={{
                    background: bgColor,
                    width: "fit-content",
                  }}
                >
                  <p
                    style={{
                      color: "var(--Black, #1A1A1B)",
                      fontFamily: "Noto Sans KR",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "18px",
                    }}
                  >
                    {name}
                  </p>
                </div>

                <p
                  style={{
                    color: "var(--Black, #1A1A1B)",
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "24px",
                  }}
                >
                  {bookmark.name}
                </p>

                <div className="flex items-center gap-[4px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M6.00019 9.2674L8.73875 10.9237C9.24027 11.2273 9.85397 10.7786 9.72199 10.2111L8.99611 7.09635L11.4179 4.99789C11.86 4.61516 11.6225 3.88927 11.0418 3.84308L7.85449 3.57252L6.60729 0.629401C6.38293 0.0948873 5.61746 0.0948873 5.39309 0.629401L4.14589 3.56593L0.95861 3.83648C0.377904 3.88267 0.140342 4.60856 0.58247 4.99129L3.00428 7.08975L2.2784 10.2045C2.14642 10.772 2.76012 11.2207 3.26164 10.9171L6.00019 9.2674Z"
                      fill="#FFC700"
                    />
                  </svg>
                  <p
                    style={{
                      color: "var(--Black, #1A1A1B)",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "18px",
                    }}
                  >
                    {bookmark.rating.toFixed(1)}
                  </p>
                  <p
                    style={{
                      color: "var(--Gray-400, #8E9398)",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "18px",
                    }}
                  >
                    ({bookmark.reviewCount})
                  </p>
                </div>

                <p
                  style={{
                    color: "var(--Gray-500, #505458)",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  {bookmark.address}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
