"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { axios } from "@/lib/axios";

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeId = searchParams.get("placeId");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // 이미지 미리보기 상태

  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
    setError("");
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    if (text.length > 500) {
      setError("500자를 초과하였습니다.");
    } else {
      setError("");
    }

    setReview(text);
  };

  const handleReviewBlur = () => {
    setIsTouched(true);

    if (!review.trim()) {
      setError("후기를 작성해 주세요");
    } else if (review.length > 500) {
      setError("500자를 초과하였습니다.");
    } else {
      setError("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!rating || !review.trim()) {
      setError("별점과 리뷰를 작성해야 합니다.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "reviewUploadRequest",
      JSON.stringify({
        placeId: Number(placeId),
        rating,
        content: review,
      })
    );

    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("리뷰가 성공적으로 등록되었습니다.");
        router.push("/"); 
      }
    } catch (error) {
      console.error("리뷰 등록 중 오류가 발생했습니다:", error);
      alert("리뷰 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const isButtonActive = rating > 0 && review.trim().length > 0 && !error;

  return (
    <div className="w-[375px] mx-auto bg-white">
      <header className="flex justify-center items-center h-[44px] px-4">
        <h1
          style={{
            color: "var(--Black, #1A1A1B)",
            textAlign: "center",
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "21px",
          }}
        >
          리뷰 작성하기
        </h1>
        <button
          onClick={() => router.back()}
          className="absolute right-[16px] flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0_434_1615)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.34305 6.34323C6.6034 6.08288 7.02551 6.08288 7.28586 6.34323L17.6568 16.7141C17.9171 16.9745 17.9171 17.3966 17.6568 17.6569C17.3964 17.9173 16.9743 17.9173 16.7139 17.6569L6.34305 7.28604C6.0827 7.02569 6.0827 6.60358 6.34305 6.34323Z"
                fill="#505458"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.657 6.34323C17.9173 6.60358 17.9173 7.02569 17.657 7.28604L7.28605 17.6569C7.0257 17.9173 6.60359 17.9173 6.34324 17.6569C6.08289 17.3966 6.08289 16.9745 6.34324 16.7141L16.7141 6.34323C16.9745 6.08288 17.3966 6.08288 17.657 6.34323Z"
                fill="#505458"
              />
            </g>
            <defs>
              <clipPath id="clip0_434_1615">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(12 0.686279) rotate(45)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </header>

      <main className="px-4 pt-8">
        <h2
          style={{
            color: "var(--kakao-logo, #000)",
            textAlign: "center",
            fontFamily: "Inter",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "27px",
          }}
        >
          방문 후기를 알려주세요!
        </h2>

        <div className="flex justify-center items-center mt-4 gap-[8px]">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <button key={index} onClick={() => handleRatingClick(index + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="24"
                  viewBox="0 0 27 24"
                  fill="none"
                >
                  <path
                    d="M13.5001 20.0993L19.5896 23.7824C20.7048 24.4574 22.0695 23.4595 21.776 22.1976L20.1619 15.2716L25.5471 10.6054C26.5303 9.75433 26.002 8.14023 24.7107 8.03751L17.6234 7.43589L14.85 0.891426C14.3511 -0.297142 12.649 -0.297142 12.1501 0.891426L9.37675 7.42122L2.28936 8.02284C0.998078 8.12555 0.469825 9.73966 1.45296 10.5907L6.8382 15.257L5.2241 22.1829C4.93062 23.4449 6.29528 24.4427 7.41048 23.7677L13.5001 20.0993Z"
                    fill={index < rating ? "#FFD643" : "#E8E8E8"}
                  />
                </svg>
              </button>
            ))}
        </div>

        <p
          style={{
            color: "var(--Gray-400, #8E9398)",
            textAlign: "center",
            fontFamily: "Inter",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "18px",
          }}
          className="mt-[8px]"
        >
          별점을 선택해주세요
        </p>

        <div className="mt-[24px]">
          <div className="flex items-center gap-[8px]">
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
              리뷰 작성
            </p>
            <p
              style={{
                color: "var(--Red, #FF5252)",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "24px",
              }}
            >
              *
            </p>
          </div>
          <div
            className="flex justify-center items-center h-[232px] p-[16px] mt-[8px]"
            style={{
              borderRadius: "10px",
              background: "var(--Gray-100, #F8F9FA)",
            }}
          >
            <textarea
              className={`w-full h-full bg-transparent resize-none focus:outline-none focus:ring-0 ${
                error && isTouched ? "border border-red-500" : ""
              }`}
              placeholder="장소에 대한 후기를 작성해 주세요."
              value={review}
              onChange={handleReviewChange}
              onBlur={handleReviewBlur}
              style={{
                color: "var(--Gray-400, #8E9398)",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
              }}
            ></textarea>
          </div>
          <p
            className={`mt-[8px] ${error ? "text-red-500" : "text-gray-400"}`}
            style={{
              color: error ? "var(--Red, #FF5252)" : "var(--Gray-400, #8E9398)",
              fontFamily: "Inter",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "18px",
            }}
          >
            {error || "500자 이내 입력 가능합니다."}
          </p>
        </div>

        <div className="mt-[24px]">
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
            사진 업로드
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
            사진 업로드는 한 장만 가능합니다.
          </p>
          <div className="mt-2 flex justify-center items-center w-[80px] h-[80px] p-1 border rounded-md bg-gray-100">
            <label className="w-full h-full flex justify-center items-center cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="이미지 미리보기"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <path
                    d="M14.5833 3.49992H9.1C7.13982 3.49992 6.15972 3.49992 5.41103 3.8814C4.75247 4.21695 4.21703 4.75238 3.88148 5.41095C3.5 6.15964 3.5 7.13973 3.5 9.09992V18.8999C3.5 20.8601 3.5 21.8402 3.88148 22.5889C4.21703 23.2475 4.75247 23.7829 5.41103 24.1184C6.15972 24.4999 7.13982 24.4999 9.1 24.4999H19.8333C20.9183 24.4999 21.4608 24.4999 21.9059 24.3807C23.1137 24.057 24.0571 23.1136 24.3807 21.9058C24.5 21.4607 24.5 20.9182 24.5 19.8333M22.1667 9.33325V2.33325M18.6667 5.83325H25.6667M12.25 9.91659C12.25 11.2052 11.2053 12.2499 9.91667 12.2499C8.628 12.2499 7.58333 11.2052 7.58333 9.91659C7.58333 8.62792 8.628 7.58325 9.91667 7.58325C11.2053 7.58325 12.25 8.62792 12.25 9.91659ZM17.4884 13.9044L7.61967 22.876C7.06459 23.3806 6.78705 23.6329 6.7625 23.8515C6.74122 24.0409 6.81386 24.2288 6.95705 24.3547C7.12224 24.4999 7.49733 24.4999 8.2475 24.4999H19.1986C20.8777 24.4999 21.7172 24.4999 22.3766 24.2178C23.2043 23.8637 23.8638 23.2043 24.2179 22.3765C24.5 21.7171 24.5 20.8776 24.5 19.1986C24.5 18.6336 24.5 18.3512 24.4382 18.0881C24.3606 17.7575 24.2118 17.4478 24.0021 17.1807C23.8353 16.9682 23.6147 16.7917 23.1736 16.4388L19.9101 13.828C19.4686 13.4748 19.2479 13.2982 19.0048 13.2359C18.7905 13.1809 18.565 13.1881 18.3546 13.2564C18.1159 13.3339 17.9067 13.5241 17.4884 13.9044Z"
                    stroke="#8E9398"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <button
          className={`mt-8 w-full h-12 rounded-lg flex justify-center items-center ${
            isButtonActive
              ? "bg-[#0187BA] text-[14px] font-bold text-white"
              : "bg-[#F8F9FA] text-[14px] font-bold text-[#8E9398]"
          }`}
          onClick={handleSubmit}
          disabled={!isButtonActive}
        >
          등록하기
        </button>
      </main>
    </div>
  );
}
