"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // next/navigation에서 useRouter를 가져옵니다.
import Header from "@/app/components/Header";
import { axios } from "@/lib/axios";
import Loading from "@/app/loading";

interface Review {
  reviewId: number;
  writer: string;
  placeId: number; // placeId 필드 추가
  placeName: string;
  content: string;
  rating: number;
  date: string;
  reviewImageUrl: string;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [lastReviewId, setLastReviewId] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchReviews = async (lastId: number) => {
    try {
      const response = await axios.get("/users/review", {
        params: { lastReviewId: lastId },
      });

      if (response.data.isSuccess) {
        const { reviewSimpleResponseList, hasNext } = response.data.results;

        setReviews((prev) => {
          const newReviews = reviewSimpleResponseList.filter(
            (newReview: { reviewId: number }) =>
              !prev.some(
                (prevReview) => prevReview.reviewId === newReview.reviewId
              )
          );
          return [...prev, ...newReviews];
        });

        if (reviewSimpleResponseList.length > 0) {
          setLastReviewId(
            reviewSimpleResponseList[reviewSimpleResponseList.length - 1]
              .reviewId
          );
        }

        setHasNext(hasNext);
      } else {
        alert("리뷰를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 가져오기 실패:", error);
      alert("리뷰 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await axios.delete(`/reviews/${reviewId}`);
      if (response.data.isSuccess) {
        alert("리뷰가 삭제되었습니다.");
        setReviews((prev) =>
          prev.filter((review) => review.reviewId !== reviewId)
        );
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleReviewClick = (placeId: number) => {
    if (!placeId) {
      alert("올바르지 않은 장소 정보입니다.");
      return;
    }
    router.push(`/home/${placeId}`); // 특정 장소로 라우팅
  };

  useEffect(() => {
    fetchReviews(0);
  }, []);

  const renderStars = (rating: number) => {
    const totalStars = 5;
    return (
      <div className="flex gap-[2px]">
        {Array.from({ length: totalStars }).map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M6.00019 9.2674L8.73875 10.9237C9.24027 11.2273 9.85397 10.7786 9.72199 10.2111L8.99611 7.09635L11.4179 4.99789C11.86 4.61516 11.6225 3.88927 11.0418 3.84308L7.85449 3.57252L6.60729 0.629401C6.38293 0.0948873 5.61746 0.0948873 5.39309 0.629401L4.14589 3.56593L0.95861 3.83648C0.377904 3.88267 0.140342 4.60856 0.58247 4.99129L3.00428 7.08975L2.2784 10.2045C2.14642 10.772 2.76012 11.2207 3.26164 10.9171L6.00019 9.2674Z"
              fill={index < rating ? "#FFC700" : "#DEDEDE"}
            />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      <Header title="내 리뷰" showBackButton={true} />

      {reviews.length === 0 ? (
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
            아직 작성한 리뷰가 없어요
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {reviews.map((review) => (
            <div key={review.reviewId}>
              <div
                className="flex justify-between items-center w-[320px]"
                onClick={() => handleReviewClick(review.placeId)} // 리뷰 클릭 시 라우팅
                style={{ cursor: "pointer" }}
              >
                <div>
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
                    {review.placeName}
                  </p>

                  <div className="mt-[4px]">{renderStars(review.rating)}</div>
                </div>

                <div className="flex flex-col items-end">
                  <p
                    style={{
                      color: "var(--Gray-Scale-Gray-600, #565656)",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "18px",
                    }}
                  >
                    {review.date}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 전파 방지
                      handleDeleteReview(review.reviewId);
                    }}
                    className="mt-1"
                    style={{
                      color: "var(--Gray-400, #8E9398)",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "18px",
                      borderBottom: "1px solid var(--Gray-400, #8E9398)", // 밑줄 추가
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>

              <p
                className="mt-[6px]"
                style={{
                  color: "var(--Basic-Black, #000)",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "21px",
                }}
              >
                {review.content}
              </p>

              {review.reviewImageUrl && (
                <img
                  src={review.reviewImageUrl}
                  alt="리뷰 이미지"
                  className="mt-[7px]"
                  style={{
                    width: "343px",
                    height: "342px",
                    borderRadius: "4.997px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
