"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { axios } from "@/lib/axios";
import Loading from "@/app/loading";

interface Bookmark {
  bookmarkId: number;
  placeId: number;
  category: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  openHours: string;
}

const categoryMap: Record<string, string> = {
  TAEKWONDO: "태권도",
  JUDO: "유도",
  BOXING: "복싱",
  JUJITSU: "주짓수",
  KENDO: "검도",
  HAPKIDO: "합기도",
  HEALTH: "헬스",
  YOGA: "요가",
  PILATES: "필라테스",
  CROSSFIT: "크로스핏",
  AEROBICS: "에어로빅",
  DANCE: "댄스",
  SOCCER: "축구",
  BASKETBALL: "농구",
  VOLLEYBALL: "배구",
  BASEBALL: "야구",
  TABLE_TENNIS: "탁구",
  SQUASH: "스쿼시",
  BADMINTON: "배드민턴",
  TENNIS: "테니스",
  GOLF: "골프",
  BAWLING: "볼링",
  BILLIARDS: "당구",
  CLIMBING: "클라이밍",
  ROLLER_SKATING: "롤러라인",
  ICE_SKATING: "빙상",
  ETC: "기타종목",
  COMPREHENSIVE: "종합체육시설",
  BALLET: "무용(발레 등)",
  JUMPING_ROPE: "줄넘기",
  PENCING: "펜싱",
  SWIMMING: "수영",
  RIDING: "승마",
  DISABLED: "취약계층",
  PUBLIC: "공공시설",
  SCHOOL: "학교",
  PRIVATE: "민간시설",
};

const lectureCategories = [
  { name: "전체", bgColor: "#F3F5F7" },
  { name: "태권도", bgColor: "#E0F8F7" },
  { name: "유도", bgColor: "#E0F8F7" },
  { name: "복싱", bgColor: "#E0F8F7" },
  { name: "주짓수", bgColor: "#E0F8F7" },
  { name: "검도", bgColor: "#E0F8F7" },
  { name: "합기도", bgColor: "#E0F8F7" },
  { name: "헬스", bgColor: "#E8EAF6" },
  { name: "요가", bgColor: "#E8EAF6" },
  { name: "필라테스", bgColor: "#E8EAF6" },
  { name: "크로스핏", bgColor: "#E8EAF6" },
  { name: "에어로빅", bgColor: "#E8EAF6" },
  { name: "댄스", bgColor: "#E8EAF6" },
  { name: "축구", bgColor: "#E5F9EE" },
  { name: "농구", bgColor: "#E5F9EE" },
  { name: "배구", bgColor: "#E5F9EE" },
  { name: "야구", bgColor: "#E5F9EE" },
  { name: "탁구", bgColor: "#E5F9EE" },
  { name: "스쿼시", bgColor: "#E5F9EE" },
  { name: "배드민턴", bgColor: "#E5F9EE" },
  { name: "테니스", bgColor: "#E5F9EE" },
  { name: "골프", bgColor: "#E5F9EE" },
  { name: "볼링", bgColor: "#FDE6F4" },
  { name: "당구", bgColor: "#FDE6F4" },
  { name: "클라이밍", bgColor: "#FDE6F4" },
  { name: "롤러인라인", bgColor: "#FDE6F4" },
  { name: "빙상(스케이트)", bgColor: "#FDE6F4" },
  { name: "기타종목", bgColor: "#FDE6F4" },
  { name: "종합체육시설", bgColor: "#FDE6F4" },
  { name: "무용", bgColor: "#FDE6F4" },
  { name: "줄넘기", bgColor: "#FDE6F4" },
  { name: "펜싱", bgColor: "#FDE6F4" },
  { name: "수영", bgColor: "#FDE6F4" },
  { name: "승마", bgColor: "#FDE6F4" },
];

const facilityCategories = [
  { name: "전체", bgColor: "#F3F5F7" },
  { name: "취약계층", bgColor: "#E5F9EE" },
  { name: "공공시설", bgColor: "#E0F8F7" },
  { name: "학교", bgColor: "#E0F4FD" },
  { name: "민간시설", bgColor: "#E8EAF6" },
];

const categoryColors = [...lectureCategories, ...facilityCategories].reduce(
  (acc, cur) => {
    acc[cur.name] = cur.bgColor; // 카테고리 이름을 키로, 색상을 값으로 설정
    return acc;
  },
  {} as Record<string, string>
);

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const lastBookmarkIdRef = useRef<number>(0); // 마지막 ID를 관리합니다.
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const fetchBookmarks = async (lastId: number | null) => {
    try {
      setIsFetching(true);
      const response = await axios.get("/users/bookmark", {
        params: { lastBookMarkId: lastId ?? 0 }, // 초기 호출 시 0을 전달합니다.
      });

      if (response.data.isSuccess) {
        const { bookMarkList, hasNext } = response.data.results;

        setBookmarks((prev) => {
          const existingIds = new Set(prev.map((b) => b.bookmarkId)); // 기존 ID를 집합으로 만듦
          const uniqueBookmarks = bookMarkList.filter(
            (bookmark: { bookmarkId: number }) =>
              !existingIds.has(bookmark.bookmarkId) // 기존에 없는 ID만 추가
          );
          return [...prev, ...uniqueBookmarks];
        });
        setHasNext(hasNext);

        if (bookMarkList.length > 0) {
          lastBookmarkIdRef.current =
            bookMarkList[bookMarkList.length - 1].bookmarkId; // 마지막 ID를 업데이트합니다.
        }
      } else {
        alert("북마크를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("북마크 가져오기 실패:", error);
      alert("북마크 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBookmarks(0); // 첫 번째 호출에 0을 전달합니다.
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext) {
          const lastBookmarkId = bookmarks[bookmarks.length - 1]?.bookmarkId || 0;
          fetchBookmarks(lastBookmarkId);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef.current, hasNext, isFetching]);

  const handleBookmarkClick = (placeId: number) => {
    router.push(`/home/${placeId}`);
  };

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
        <div
          className="p-4 space-y-6 w-full"
          style={{
            maxWidth: "375px",
            margin: "0 auto",
          }}
        >
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.bookmarkId}
              onClick={() => handleBookmarkClick(bookmark.placeId)}
              className="flex flex-col gap-[4px] pb-4 border-b"
              style={{
                padding: "12px 6px",
                borderBottom: "1px solid var(--Gray-200, #E8E8E8)",
              }}
            >
              <div
                className="inline-flex items-center h-[24px] px-[8px] rounded-[2px]"
                style={{
                  background:
                    categoryColors[categoryMap[bookmark.category]] || "#E5F9EE",
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
                  {categoryMap[bookmark.category]}
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
          ))}
          <div ref={loaderRef} style={{ height: "50px" }} />
        </div>
      )}
    </div>
  );
}
