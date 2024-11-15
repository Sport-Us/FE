"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<"체육 강좌" | "체육 시설">(
    "체육 강좌"
  );
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [map, setMap] = useState<any>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["서울", "상도동", "지하철역"]);

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

  const handleDeleteRecentSearch = (item: string) => {
    setRecentSearches((prev) => prev.filter((search) => search !== item));
  };

  const handleClearAllSearches = () => {
    setRecentSearches([]); 
  };

  const categories = ["전체", "실내 운동", "실외 운동"];

  return (
    <div className="relative w-full h-screen">
      <div
        id="map"
        className="absolute top-0 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full h-full"
      ></div>

      {searchActive ? (
        <div className="absolute top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-center">
          <div className="flex items-center w-[343px] mt-6 gap-2">
            <button onClick={() => setSearchActive(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="44"
                viewBox="0 0 40 44"
                fill="none"
              >
                <path
                  d="M23.2727 29.2L16.7273 22L23.2727 14.8"
                  stroke="#1A1A1B"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex items-center flex-1 p-[12px_16px] bg-[#F8F9FA] rounded-lg gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clipPath="url(#clip0_430_916)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.56185 1.7499C5.61458 1.7426 4.68646 2.01674 3.89518 2.53756C3.10389 3.05837 2.48507 3.80241 2.11716 4.67536C1.74925 5.5483 1.64882 6.51082 1.82861 7.44091C2.0084 8.371 2.4603 9.22675 3.12703 9.8997C3.79376 10.5726 4.64529 11.0325 5.57367 11.2209C6.50205 11.4093 7.46547 11.3178 8.34178 10.958C9.2181 10.5982 9.96785 9.98628 10.496 9.19985C11.0241 8.41343 11.3068 7.4879 11.3083 6.5406L11.9333 6.54158L11.3083 6.53964C11.3123 5.27577 10.815 4.0619 9.92541 3.16407C9.03587 2.26624 7.82666 1.7577 6.56281 1.7499L6.56185 1.7499ZM12.5583 6.54304C12.5564 7.73773 12.1997 8.90494 11.5337 9.89674C10.8675 10.8887 9.92187 11.6605 8.81655 12.1143C7.71123 12.5681 6.49605 12.6835 5.32507 12.4459C4.15408 12.2083 3.08002 11.6283 2.23906 10.7795C1.39809 9.93067 0.828096 8.85128 0.601327 7.67814C0.374558 6.505 0.501229 5.29095 0.965283 4.18989C1.42934 3.08882 2.20987 2.15035 3.20794 1.49343C4.20601 0.836507 5.37666 0.490731 6.57148 0.499935L6.56667 1.12492L6.57052 0.499928C6.57084 0.49993 6.57116 0.499933 6.57148 0.499935C8.16583 0.510023 9.6912 1.15166 10.8134 2.2843C11.9357 3.41704 12.5632 4.94849 12.5583 6.54304Z"
                    fill="#8E9398"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.2668 10.2576C10.5111 10.0137 10.9069 10.0141 11.1507 10.2585L15.3174 14.4335C15.5612 14.6778 15.5608 15.0735 15.3165 15.3173C15.0722 15.5612 14.6764 15.5608 14.4326 15.3165L10.2659 11.1415C10.0221 10.8971 10.0225 10.5014 10.2668 10.2576Z"
                    fill="#8E9398"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_430_916">
                    <rect width="15" height="15" fill="white" transform="translate(0.5 0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <input
                type="text"
                placeholder="검색어를 입력해 주세요."
                className="flex-1 bg-transparent text-[#8E9398] text-[14px] font-normal placeholder-[#8E9398]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-[343px] mt-6">
            <h2 className="text-[#1A1A1B] font-inter font-semibold text-[14px] leading-[21px]">
              최근 검색어
            </h2>
            <button
              onClick={handleClearAllSearches}
              className="text-[#8E9398] font-inter text-[12px] leading-[18px]"
            >
              검색 기록 전체 삭제
            </button>
          </div>

          <div className="w-[343px] mt-6 space-y-2">
            {recentSearches.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    className="mr-2"
                  >
                    <path
                      d="M8 4.49992V8.49992L10.6667 9.83325M14.6667 8.49992C14.6667 12.1818 11.6819 15.1666 8 15.1666C4.3181 15.1666 1.33334 12.1818 1.33334 8.49992C1.33334 4.81802 4.3181 1.83325 8 1.83325C11.6819 1.83325 14.6667 4.81802 14.6667 8.49992Z"
                      stroke="#D2D3D3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[#1A1A1B] font-inter text-[14px] leading-[21px]">
                    {item}
                  </span>
                </div>
                <button onClick={() => handleDeleteRecentSearch(item)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_430_669)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.75735 4.07597C3.95261 3.8807 4.26919 3.8807 4.46445 4.07597L12.2426 11.8541C12.4379 12.0494 12.4379 12.366 12.2426 12.5612C12.0474 12.7565 11.7308 12.7565 11.5355 12.5612L3.75735 4.78307C3.56209 4.58781 3.56209 4.27123 3.75735 4.07597Z"
                        fill="#D2D3D3"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.2427 4.07597C12.4379 4.27123 12.4379 4.58781 12.2427 4.78307L4.46448 12.5612C4.26922 12.7565 3.95263 12.7565 3.75737 12.5612C3.56211 12.366 3.56211 12.0494 3.75737 11.8541L11.5355 4.07597C11.7308 3.8807 12.0474 3.8807 12.2427 4.07597Z"
                        fill="#D2D3D3"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_430_669">
                        <rect width="12" height="12" fill="white" transform="translate(8 -0.166748) rotate(45)" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute top-0 w-full flex flex-col items-center">
          <div className="w-full h-[103px] bg-white flex flex-col items-center gap-[8px] p-[10px]">
            <div className="flex items-center w-[343px] h-[36px] gap-[4px] bg-[#EEE] rounded-lg">
              <button
                onClick={() => setSelectedTab("체육 강좌")}
                className={`flex items-center justify-center w-[175px] h-[36px] py-[10px] px-[16px] gap-[4px] rounded-lg ${
                  selectedTab === "체육 강좌"
                    ? "bg-[rgba(1,135,186,0.28)]"
                    : "bg-transparent"
                }`}
              >
                <span className="text-[rgba(0,0,0,0.60)] font-bold text-[12px] leading-[18px]">
                  체육 강좌
                </span>
              </button>
              <button
                onClick={() => setSelectedTab("체육 시설")}
                className={`flex items-center justify-center w-[175px] h-[36px] py-[10px] px-[16px] gap-[4px] rounded-lg ${
                  selectedTab === "체육 시설"
                    ? "bg-[rgba(1,135,186,0.28)]"
                    : "bg-transparent"
                }`}
              >
                <span className="text-[rgba(0,0,0,0.60)] font-bold text-[12px] leading-[18px]">
                  체육 시설
                </span>
              </button>
            </div>

            <div
              className="flex items-center w-[343px] h-[36px] py-[10px] px-[16px] gap-[4px] bg-[#F8F9FA] rounded-lg"
              onClick={() => setSearchActive(true)}
            >
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
                readOnly
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
      )}
      <Footer />
    </div>
  );
}
