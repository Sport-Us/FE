"use client";

import { useRouter, useParams } from "next/navigation"; // useParams로 동적 params 처리
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import Loading from "@/app/loading";

interface Review {
  reviewId: number;
  writer: string;
  writerImageUrl: string;
  content: string;
  rating: number;
  date: string;
  reviewImageUrl: string;
}

interface PlaceDetail {
  placeId: number;
  name: string;
  address: string;
  detailInfo: string;
  rating: number;
  isBookmarked: boolean;
  category: string;
}

const categoryMap: Record<string, string> = {
  ALL: "전체",
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
  BOWLING: "볼링",
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

interface PageProps {
  params: { id: string };
}

export default function DetailPage() {
  const { id: placeId } = useParams();
  const router = useRouter();
  const [placeDetail, setPlaceDetail] = useState<PlaceDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        const response = await axios.get("/places/detail", {
          params: { placeId },
        });

        const data = response.data.results;

        const transformedCategory =
          categoryMap[data.placeDetail.category] || "기타";

        setPlaceDetail({ ...data.placeDetail, category: transformedCategory });
        setReviews(data.recentReviews);
        setIsBookmarked(data.placeDetail.isBookmarked); // 서버 데이터로 북마크 상태 초기화
      } catch (error) {
        console.error("API 호출 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [placeId]);

  const handleBookmarkClick = async () => {
    try {
      const response = await axios.get(`/bookmarks/${placeId}`);

      if (response.data.isSuccess) {
        setIsBookmarked((prev) => !prev);
      }
    } catch (error) {
      console.error("북마크 요청 실패:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!placeDetail) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  const renderStars = (rating: number, size: "small" | "large") => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const emptyStars = totalStars - filledStars;
    const starSize = size === "large" ? 25 : 12;
    const gap = size === "large" ? 8 : 2;

    return (
      <div className={`flex gap-[${gap}px]`}>
        {Array(filledStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`filled-${size}-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width={starSize}
              height={starSize}
              viewBox="0 0 27 24"
              fill="none"
            >
              <path
                d="M13.5 20.1L19.6 23.8C20.7 24.5 22.1 23.5 21.8 22.2L20.2 15.3L25.5 10.6C26.5 9.8 26 8.1 24.7 8L17.6 7.4L14.8 0.9C14.3 -0.3 12.7 -0.3 12.2 0.9L9.4 7.4L2.3 8C1 8.1 0.5 9.8 1.5 10.6L6.8 15.3L5.2 22.2C4.9 23.5 6.3 24.5 7.4 23.8L13.5 20.1Z"
                fill="#FFD643"
              />
            </svg>
          ))}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-${size}-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width={starSize}
              height={starSize}
              viewBox="0 0 27 24"
              fill="none"
            >
              <path
                d="M13.5 20.1L19.6 23.8C20.7 24.5 22.1 23.5 21.8 22.2L20.2 15.3L25.5 10.6C26.5 9.8 26 8.1 24.7 8L17.6 7.4L14.8 0.9C14.3 -0.3 12.7 -0.3 12.2 0.9L9.4 7.4L2.3 8C1 8.1 0.5 9.8 1.5 10.6L6.8 15.3L5.2 22.2C4.9 23.5 6.3 24.5 7.4 23.8L13.5 20.1Z"
                fill="#E8E8E8"
              />
            </svg>
          ))}
      </div>
    );
  };

  return (
    <div className="w-[375px] mx-auto bg-white">
      <header
        className="flex items-center h-[44px] px-2 bg-white"
        style={{
          background: "var(--White, #FFF)",
        }}
      >
        <button onClick={() => router.back()} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
          >
            <path
              d="M25.6 29.2L18.4 22L25.6 14.8"
              stroke="#1A1A1B"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <div className="px-4 py-2">
        <div className="inline-flex items-center h-[24px] px-3 bg-[#E5F9EE] rounded-md">
          <span className="text-sm font-medium text-[#1A1A1B]">
            {placeDetail.category}
          </span>
        </div>
        <h1 className="mt-[12px] text-[18px] font-bold text-[#1A1A1B]">
          {placeDetail.name}
        </h1>

        <div className="flex items-center mt-[4px] text-[14px] text-[#505458]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <path
              d="M8.00002 9.16659C9.10459 9.16659 10 8.27115 10 7.16659C10 6.06202 9.10459 5.16659 8.00002 5.16659C6.89545 5.16659 6.00002 6.06202 6.00002 7.16659C6.00002 8.27115 6.89545 9.16659 8.00002 9.16659Z"
              stroke="#505458"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.00002 15.1666C10.6667 12.4999 13.3334 10.1121 13.3334 7.16659C13.3334 4.22107 10.9455 1.83325 8.00002 1.83325C5.0545 1.83325 2.66669 4.22107 2.66669 7.16659C2.66669 10.1121 5.33335 12.4999 8.00002 15.1666Z"
              stroke="#505458"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ml-[4px]">{placeDetail.address}</span>
        </div>
        {placeDetail.detailInfo && (
          <div
            className="flex flex-col items-start gap-[10px] mt-4 p-[18px_16px] w-[343px] h-auto rounded-[10px]"
            style={{
              background: "var(--Gray-100, #F8F9FA)",
            }}
          >
            <div
              className="w-full text-center"
              style={{
                color: "var(--Red, #FF5252)",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "21px",
              }}
            >
              기타 정보
            </div>
            <div
              style={{
                color: "#000",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
              }}
            >
              {placeDetail.detailInfo}
            </div>
          </div>
        )}
      </div>

      <div
        className="w-full h-[10px]"
        style={{
          background: "var(--Gray-100, #F8F9FA)",
        }}
      ></div>

      <section className="px-4 py-4">
        <h2 className="text-[18px] font-bold text-[#1A1A1B]">리뷰</h2>

        {reviews.length === 0 ? (
          <div className="flex justify-center items-center h-[150px]">
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
              아직 작성한 리뷰가 없어요
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center mt-[17px] gap-[12px]">
              <p
                style={{
                  color: "var(--Black, #1A1A1B)",
                  fontFamily: "Inter",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "27px",
                }}
              >
                {placeDetail.rating.toFixed(1)}
              </p>
              {renderStars(placeDetail.rating, "large")}
            </div>

            <div className="mt-[28px] space-y-6">
              {reviews.map((review) => (
                <div key={review.reviewId}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-[7px]">
                      <img
                        src={review.writerImageUrl || "/profile.png"}
                        alt="프로필"
                        width={25}
                        height={25}
                        className="rounded-full"
                        style={{
                          borderRadius: "50%",
                          width: "25px",
                          height: "25px",
                        }}
                      />
                      <div>
                        <p className="text-[12px] text-[#505458] font-semibold">
                          {review.writer}
                        </p>
                        <div className="mt-[2px]">
                          {renderStars(review.rating, "small")}
                        </div>
                      </div>
                    </div>
                    <p className="ml-auto text-[12px] text-[#565656] self-center">
                      {review.date}
                    </p>
                  </div>
                  <p className="mt-[7px] text-[14px] text-[#000]">
                    {review.content}
                  </p>
                  {review.reviewImageUrl && (
                    <img
                      src={review.reviewImageUrl}
                      alt="리뷰 이미지"
                      className="mt-[7px] w-full rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-[25px] px-[16px] flex justify-center items-center">
        <div className="flex items-center gap-[12px]">
          <button onClick={handleBookmarkClick}>
            {isBookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
                  fill="#000"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
                  stroke="#1A1A1B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => router.push(`/review?placeId=${placeId}`)}
            className="flex items-center justify-center w-[281px] h-[43px] rounded-[8px] bg-[#0187BA] text-white font-bold text-[12px]"
          >
            리뷰 작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
