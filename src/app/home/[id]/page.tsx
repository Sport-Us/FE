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
        },
      ],
    },
  ];

  const mockData = allResults.find((item) => item.id === params.id);

  if (!mockData) {
    return <p>데이터를 찾을 수 없습니다.</p>;
  }

  const review = mockData.reviews[0]; 

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
        <div className="mt-4">
          <p className="text-[14px] text-[#1A1A1B] font-semibold">
            {review.username}
          </p>
          <p className="text-[14px] text-[#505458]">{review.comment}</p>
        </div>
      </section>
    </div>
  );
}
