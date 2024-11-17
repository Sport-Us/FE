"use client";

import { useRouter } from "next/navigation";

export default function DetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const allResults = [
    {
      id: "1",
      category: "태권도",
      name: "상도역",
      address: "서울 동작구 상도로 272",
      time: "12:00~18:00",
      rating: 4.0,
      reviews: [
        {
          id: 1,
          username: "햄깅이",
          rating: 4.0,
          date: "2023.03.03",
          comment: "설명도 자세하게 해주시고, 강사님이 되게 재미있으세요!",
          image: "/sample-image.jpg",
        },
      ],
    },
    {
      id: "2",
      category: "축구",
      name: "상도역",
      address: "서울 동작구 상도로 272",
      time: "10:00~16:00",
      rating: 4.2,
      reviews: [
        {
          id: 2,
          username: "길동이",
          rating: 4.5,
          date: "2023.05.01",
          comment: "시설도 좋고 접근성이 뛰어나요!",
          image: null,
        },
      ],
    },
  ];

  const mockData = allResults.find((item) => item.id === params.id);

  if (!mockData) {
    return <p>데이터를 찾을 수 없습니다.</p>;
  }

  const renderSmallStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = Math.round(rating); 
    const emptyStars = totalStars - filledStars;

    return (
      <div className="flex gap-[2px]">
        {Array(filledStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`filled-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 27 24"
              fill="none"
            >
              <path
                d="M13.5001 20.0993L19.5896 23.7824C20.7048 24.4574 22.0695 23.4595 21.776 22.1976L20.1619 15.2716L25.5471 10.6054C26.5303 9.75433 26.002 8.14023 24.7107 8.03751L17.6234 7.43589L14.85 0.891426C14.3511 -0.297142 12.649 -0.297142 12.1501 0.891426L9.37675 7.42122L2.28936 8.02284C0.998078 8.12555 0.469825 9.73966 1.45296 10.5907L6.8382 15.257L5.2241 22.1829C4.93062 23.4449 6.29528 24.4427 7.41048 23.7677L13.5001 20.0993Z"
                fill="#FFD643"
              />
            </svg>
          ))}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 27 24"
              fill="none"
            >
              <path
                d="M13.5001 20.0993L19.5896 23.7824C20.7048 24.4574 22.0695 23.4595 21.776 22.1976L20.1619 15.2716L25.5471 10.6054C26.5303 9.75433 26.002 8.14023 24.7107 8.03751L17.6234 7.43589L14.85 0.891426C14.3511 -0.297142 12.649 -0.297142 12.1501 0.891426L9.37675 7.42122L2.28936 8.02284C0.998078 8.12555 0.469825 9.73966 1.45296 10.5907L6.8382 15.257L5.2241 22.1829C4.93062 23.4449 6.29528 24.4427 7.41048 23.7677L13.5001 20.0993Z"
                fill="#E8E8E8"
              />
            </svg>
          ))}
      </div>
    );
  };

  const renderLargeStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const emptyStars = totalStars - filledStars;

    return (
      <div className="flex gap-[8px]">
        {Array(filledStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`filled-large-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
            >
              <path
                d="M13.0001 20.7243L19.0896 24.4074C20.2048 25.0824 21.5695 24.0845 21.276 22.8226L19.6619 15.8966L25.0471 11.2304C26.0303 10.3793 25.502 8.76523 24.2107 8.66251L17.1234 8.06089L14.35 1.51643C13.8511 0.327858 12.149 0.327858 11.6501 1.51643L8.87675 8.04622L1.78936 8.64784C0.498078 8.75055 -0.0301749 10.3647 0.952962 11.2157L6.3382 15.882L4.7241 22.8079C4.43062 24.0699 5.79528 25.0677 6.91048 24.3927L13.0001 20.7243Z"
                fill="#FFD643"
              />
            </svg>
          ))}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-large-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
            >
              <path
                d="M13.0001 20.7243L19.0896 24.4074C20.2048 25.0824 21.5695 24.0845 21.276 22.8226L19.6619 15.8966L25.0471 11.2304C26.0303 10.3793 25.502 8.76523 24.2107 8.66251L17.1234 8.06089L14.35 1.51643C13.8511 0.327858 12.149 0.327858 11.6501 1.51643L8.87675 8.04622L1.78936 8.64784C0.498078 8.75055 -0.0301749 10.3647 0.952962 11.2157L6.3382 15.882L4.7241 22.8079C4.43062 24.0699 5.79528 25.0677 6.91048 24.3927L13.0001 20.7243Z"
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
        className="flex items-center h-[44px] px-2 bg-white border-b"
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
            {mockData.category}
          </span>
        </div>
        <h1 className="mt-[12px] text-[18px] font-bold text-[#1A1A1B]">
          {mockData.name}
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
          <span className="ml-[4px]">{mockData.address}</span>
        </div>
      </div>

      <div
        className="w-full h-[10px]"
        style={{
          background: "var(--Gray-100, #F8F9FA)",
        }}
      ></div>

<section className="px-4 py-4">
  <h2 className="text-[18px] font-bold text-[#1A1A1B]">리뷰</h2>

  {mockData.reviews.length === 0 ? (
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
          {mockData.rating.toFixed(1)}
        </p>
        {renderLargeStars(mockData.rating)}
      </div>

      <div className="mt-[28px] space-y-6">
        {mockData.reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-[7px]">
                <img
                  src="/profile.png"
                  alt="프로필"
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                <div>
                  <p className="text-[12px] text-[#505458] font-semibold">
                    {review.username}
                  </p>
                  <div className="mt-[2px]">{renderSmallStars(review.rating)}</div>
                </div>
              </div>
              <p className="ml-auto text-[12px] text-[#565656] self-center">
                {review.date}
              </p>
            </div>
            <p className="mt-[7px] text-[14px] text-[#000]">{review.comment}</p>
            {review.image && (
              <img
                src={review.image}
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
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          </button>
          <button className="flex items-center justify-center w-[281px] h-[43px] rounded-[8px] bg-[#0187BA] text-white font-bold text-[12px]">
            리뷰 작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
