"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<"체육 강좌" | "체육 시설">(
    "체육 강좌"
  );
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const initMap = (latitude: number, longitude: number) => {
      if (typeof window.naver === "undefined") {
        console.error("네이버 지도 API가 로드되지 않았습니다.");
        return;
      }

      const mapOptions = {
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 14,
      };

      const newMap = new window.naver.maps.Map("map", mapOptions);
      setMap(newMap);

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(latitude, longitude),
        map: newMap,
      });
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      console.error("위치 정보를 가져오는 데 실패했습니다:", error);
      initMap(37.5665, 126.978);
    };

    const loadMapWithCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          initMap(latitude, longitude);
        }, handleLocationError);
      } else {
        console.warn("Geolocation을 사용할 수 없습니다.");
        initMap(37.5665, 126.978);
      }
    };

    if (!window.naver) {
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=0hsynm0y56`;
      script.async = true;
      script.onload = loadMapWithCurrentLocation;
      document.head.appendChild(script);
    } else {
      loadMapWithCurrentLocation();
    }
  }, []);

  const categories = ["전체", "실내 운동", "실외 운동"];

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="absolute top-0 left-0 w-full h-full"></div>

      <div className="absolute top-0 w-full flex flex-col items-center ">
        <div className="w-full h-[103px] flex-shrink-0 bg-white flex flex-col items-center gap-[8px] p-[10px]">
          <div className="flex items-center w-[343px] h-[36px] gap-[4px] bg-[#EEE] rounded-lg">
            <button
              onClick={() => setSelectedTab("체육 강좌")}
              className={`flex items-center justify-center w-[175px] h-[36px] py-[10px] px-[16px] gap-[4px] rounded-lg ${
                selectedTab === "체육 강좌"
                  ? "bg-[rgba(1,135,186,0.28)]"
                  : "bg-transparent"
              }`}
            >
              <span
                className="text-[rgba(0,0,0,0.60)] font-bold text-[12px] leading-[18px]"
                style={{
                  fontFamily: '"Noto Sans KR", sans-serif',
                }}
              >
                체육 강좌
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("체육 시설")}
              className={`flex items-center justify-center w-[175px] h-[36px] p-[10px] gap-[4px] rounded-lg ${
                selectedTab === "체육 시설"
                  ? "bg-[rgba(1,135,186,0.28)]"
                  : "bg-transparent"
              }`}
            >
              <span
                className="text-[rgba(0,0,0,0.60)] font-bold text-[12px] leading-[18px]"
                style={{
                  fontFamily: '"Noto Sans KR", sans-serif',
                }}
              >
                체육 시설
              </span>
            </button>
          </div>

          <div className="flex items-center w-[343px] h-[36px] py-[10px] px-[16px] gap-[4px] bg-[#F8F9FA] rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              className="mr-2"
            >
              <g clipPath="url(#clip0_420_693)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.56185 1.2499C5.61458 1.2426 4.68646 1.51674 3.89518 2.03756C3.10389 2.55837 2.48507 3.30241 2.11716 4.17536C1.74925 5.0483 1.64882 6.01082 1.82861 6.94091C2.0084 7.871 2.4603 8.72675 3.12703 9.3997C3.79376 10.0726 4.64529 10.5325 5.57367 10.7209C6.50205 10.9093 7.46547 10.8178 8.34178 10.458C9.2181 10.0982 9.96785 9.48628 10.496 8.69985C11.0241 7.91343 11.3068 6.9879 11.3083 6.0406L11.9333 6.04158L11.3083 6.03964C11.3123 4.77577 10.815 3.5619 9.92541 2.66407C9.03587 1.76624 7.82666 1.2577 6.56281 1.2499L6.56185 1.2499ZM12.5583 6.04304C12.5564 7.23773 12.1997 8.40494 11.5337 9.39674C10.8675 10.3887 9.92187 11.1605 8.81655 11.6143C7.71123 12.0681 6.49605 12.1835 5.32507 11.9459C4.15408 11.7083 3.08002 11.1283 2.23906 10.2795C1.39809 9.43067 0.828096 8.35128 0.601327 7.17814C0.374558 6.005 0.501229 4.79095 0.965283 3.68989C1.42934 2.58882 2.20987 1.65035 3.20794 0.993426C4.20601 0.336507 5.37666 -0.00926897 6.57148 -6.50663e-05L6.56667 0.624916L6.57052 -7.17221e-05C6.57084 -6.97353e-05 6.57116 -6.71027e-05 6.57148 -6.50663e-05C8.16583 0.0100227 9.6912 0.65166 10.8134 1.7843C11.9357 2.91704 12.5632 4.44849 12.5583 6.04304Z"
                  fill="#8E9398"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2668 9.75757C10.5112 9.51373 10.9069 9.51413 11.1507 9.75845L15.3174 13.9335C15.5612 14.1778 15.5608 14.5735 15.3165 14.8173C15.0722 15.0612 14.6765 15.0608 14.4326 14.8165L10.266 10.6415C10.0221 10.3971 10.0225 10.0014 10.2668 9.75757Z"
                  fill="#8E9398"
                />
              </g>
              <defs>
                <clipPath id="clip0_420_693">
                  <rect
                    width="15"
                    height="15"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              className="flex-1 bg-transparent text-[#8E9398] text-[14px] font-normal outline-none placeholder-[#8E9398]"
            />
          </div>
        </div>

        <div className="flex w-[357px] items-center gap-[16px] mt-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex justify-center items-center w-[82px] h-[32px] py-[5px] px-[20px] gap-[10px] rounded-full border bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.10)] whitespace-nowrap ${
                selectedCategory === category
                  ? "border-[#222] text-[#222]"
                  : "border-gray-300 text-[rgba(60,60,67,0.60)]"
              }`}
              style={{
                fontFamily: "Abel",
                fontSize: "12px",
                fontWeight: "400",
                lineHeight: "18px",
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
