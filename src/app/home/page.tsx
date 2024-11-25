"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/lib/axios";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleTokenExtraction = () => {
      if (typeof window === "undefined") {
        console.error("브라우저 환경이 아닙니다.");
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const accessTokenFromUrl = urlParams.get("accessToken");

      if (accessTokenFromUrl) {
        // 소셜 로그인일 경우
        try {
          localStorage.setItem("accessToken", accessTokenFromUrl);
          // console.log("소셜 로그인 토큰 저장 성공:", accessTokenFromUrl);
        } catch (error) {
          console.error("로컬 스토리지 저장 중 오류:", error);
        }
      } else {
        // 일반 로그인일 경우 로컬 스토리지에서 토큰 확인
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("accessToken이 없습니다. 로그인 페이지로 이동합니다.");
          router.push("/login");
        } else {
          console.log("일반 로그인 토큰 확인 성공:", accessToken);
        }
      }
    };

    handleTokenExtraction();
  }, [router]);

  const [selectedTab, setSelectedTab] = useState<"체육 강좌" | "체육 시설">(
    "체육 강좌"
  );
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [map, setMap] = useState<any>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "서울",
    "상도동",
    "지하철역",
  ]); // 최근 검색어
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [distanceModalVisible, setDistanceModalVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<"별점순" | "거리순">(
    "별점순"
  );
  const [selectedDistance, setSelectedDistance] = useState<string>("제한 없음");
  const distanceOptions = ["500m", "1km", "2km", "5km", "10km", "제한 없음"];
  const [markers, setMarkers] = useState<any[]>([]);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const categoryMap: Record<string, string> = {
    전체: "ALL",
    태권도: "TAEKWONDO",
    유도: "JUDO",
    복싱: "BOXING",
    주짓수: "JUJITSU",
    검도: "KENDO",
    합기도: "HAPKIDO",
    헬스: "HEALTH",
    요가: "YOGA",
    필라테스: "PILATES",
    크로스핏: "CROSSFIT",
    에어로빅: "AEROBICS",
    "댄스(줌바 등)": "DANCE",
    "축구(풋살)": "SOCCER",
    농구: "BASKETBALL",
    배구: "VOLLEYBALL",
    야구: "BASEBALL",
    탁구: "TABLE_TENNIS",
    스쿼시: "SQUASH",
    배드민턴: "BADMINTON",
    테니스: "TENNIS",
    골프: "GOLF",
    볼링: "BOWLING",
    당구: "BILLIARDS",
    클라이밍: "CLIMBING",
    롤러라인: "ROLLER_SKATING",
    "빙상(스케이트)": "ICE_SKATING",
    기타종목: "ETC",
    종합체육시설: "COMPREHENSIVE",
    "무용(발레 등)": "BALLET",
    줄넘기: "JUMPING_ROPE",
    펜싱: "PENCING",
    수영: "SWIMMING",
    승마: "RIDING",
  };

  const fetchLectures = async (
    latitude: number,
    longitude: number,
    radius: number,
    category: string
  ) => {
    try {
      const response = await axios.get("/places/nearby/lectures", {
        params: { latitude, longitude, radius, category },
      });
      if (response.data.isSuccess) {
        return response.data.results.placeList;
      }
      console.error("API 호출 실패:", response.data.message);
      return [];
    } catch (error) {
      console.error("API 호출 에러:", error);
      return [];
    }
  };

  useEffect(() => {
    if (map) {
      handleCategorySelect("전체");
    }
  }, [map]);
  
  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setFilterModalVisible(false);

    const mappedCategory = categoryMap[category];
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const radius =
          selectedDistance === "제한 없음" ? 10000 : parseInt(selectedDistance);

        const lectures = await fetchLectures(
          latitude,
          longitude,
          radius,
          mappedCategory
        );
        clearMarkers();
        const newMarkers = lectures.map(
          (lecture: { category: string; latitude: any; longitude: any }) => {
            const markerImage = `/${lecture.category.toLowerCase()}.png?v=${Date.now()}`;
            const marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(
                lecture.latitude,
                lecture.longitude
              ),
              map,
              icon: {
                url: markerImage,
                size: new window.naver.maps.Size(48, 48),
                scaledSize: new window.naver.maps.Size(48, 48),
              },
              
            });
            return marker;
          }
        );

        setMarkers(newMarkers);
      },
      (error) => {
        console.error("위치 정보 가져오기 실패:", error);
      }
    );
  };

  const allResults = [
    {
      id: "1",
      category: "태권도",
      name: "상도역",
      rating: 4.0,
      reviews: 11,
      distance: "65m",
      address: "서울 동작구 상도로 272",
    },
    {
      id: "2",
      category: "축구",
      name: "상도역",
      rating: 4.0,
      reviews: 11,
      distance: "65m",
      address: "서울 동작구 상도로 272",
    },
    {
      id: "3",
      category: "유도",
      name: "상도역",
      rating: 4.0,
      reviews: 11,
      distance: "65m",
      address: "서울 동작구 상도로 272",
    },
    {
      id: "4",
      category: "핸드볼",
      name: "상도역",
      rating: 4.0,
      reviews: 11,
      distance: "65m",
      address: "서울 동작구 상도로 272",
      time: "12:00~18:00",
    },
    {
      id: "5",
      category: "농구",
      name: "상도역",
      rating: 4.0,
      reviews: 11,
      distance: "65m",
      address: "서울 동작구 상도로 272",
    },
  ];

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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);

    if (query) {
      const filteredResults = allResults.filter(
        (result) =>
          result.name.includes(query) || result.category.includes(query)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id: string) => {
    router.push(`/home/${id}`);
  };

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

            <div className="flex items-center flex-1 relative p-[12px_16px] bg-[#F8F9FA] rounded-lg gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_431_494)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.56188 1.7499C5.61461 1.7426 4.68649 2.01674 3.89521 2.53756C3.10392 3.05837 2.4851 3.80241 2.11719 4.67536C1.74928 5.5483 1.64885 6.51082 1.82864 7.44091C2.00843 8.371 2.46033 9.22675 3.12706 9.8997C3.79379 10.5726 4.64533 11.0325 5.5737 11.2209C6.50208 11.4093 7.4655 11.3178 8.34181 10.958C9.21813 10.5982 9.96788 9.98628 10.496 9.19985C11.0241 8.41343 11.3069 7.4879 11.3084 6.5406L11.9334 6.54158L11.3084 6.53964C11.3123 5.27577 10.815 4.0619 9.92544 3.16407C9.0359 2.26624 7.82669 1.7577 6.56284 1.7499L6.56188 1.7499ZM12.5584 6.54304C12.5564 7.73773 12.1998 8.90494 11.5337 9.89674C10.8676 10.8887 9.9219 11.6605 8.81658 12.1143C7.71126 12.5681 6.49609 12.6835 5.3251 12.4459C4.15411 12.2083 3.08005 11.6283 2.23909 10.7795C1.39812 9.93067 0.828127 8.85128 0.601357 7.67814C0.374588 6.505 0.50126 5.29095 0.965314 4.18989C1.42937 3.08882 2.20991 2.15035 3.20797 1.49343C4.20604 0.836507 5.37669 0.490731 6.57151 0.499935L6.5667 1.12492L6.57055 0.499928C6.57087 0.49993 6.57119 0.499933 6.57151 0.499935C8.16586 0.510023 9.69123 1.15166 10.8134 2.2843C11.9357 3.41704 12.5632 4.94849 12.5584 6.54304Z"
                    fill="#8E9398"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.2668 10.2576C10.5111 10.0137 10.9069 10.0141 11.1507 10.2585L15.3174 14.4335C15.5612 14.6778 15.5608 15.0735 15.3165 15.3173C15.0722 15.5612 14.6764 15.5608 14.4326 15.3165L10.2659 11.1415C10.0221 10.8971 10.0225 10.5014 10.2668 10.2576Z"
                    fill="#8E9398"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_431_494">
                    <rect
                      width="15"
                      height="15"
                      fill="white"
                      transform="translate(0.5 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <input
                type="text"
                placeholder="검색어를 입력해 주세요."
                className="flex-1 bg-transparent text-[#8E9398] text-[14px] font-normal outline-none"
                value={searchInput}
                onChange={handleSearchInput}
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchResults([]);
                  }}
                  className="absolute right-[16px] text-[#8E9398]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_431_503)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.75735 4.32645C3.95261 4.13119 4.26919 4.13119 4.46445 4.32645L12.2426 12.1046C12.4379 12.2999 12.4379 12.6165 12.2426 12.8117C12.0474 13.007 11.7308 13.007 11.5355 12.8117L3.75735 5.03356C3.56209 4.8383 3.56209 4.52172 3.75735 4.32645Z"
                        fill="#505458"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.2427 4.32645C12.4379 4.52172 12.4379 4.8383 12.2427 5.03356L4.46448 12.8117C4.26922 13.007 3.95263 13.007 3.75737 12.8117C3.56211 12.6165 3.56211 12.2999 3.75737 12.1046L11.5355 4.32645C11.7308 4.13119 12.0474 4.13119 12.2427 4.32645Z"
                        fill="#505458"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_431_503">
                        <rect
                          width="12"
                          height="12"
                          fill="white"
                          transform="translate(8 0.0837402) rotate(45)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              )}
            </div>
          </div>
          {searchResults.length > 0 && (
            <div className="w-[343px] flex flex-col items-start mt-[16px]">
              <div className="flex justify-start gap-[16px]">
                <button
                  onClick={() => {
                    setSelectedTab("체육 강좌");
                  }}
                  className={`relative text-[14px] leading-[21px] font-noto-sans ${
                    selectedTab === "체육 강좌"
                      ? "text-[var(--Main-Primary,#222)] font-semibold"
                      : "text-[var(--Gray-400,#8E9398)] font-medium"
                  }`}
                >
                  강좌 보기
                  {selectedTab === "체육 강좌" && (
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 mt-[2px]"
                      style={{
                        width: "55px",
                        height: "1px",
                        background: "#222",
                      }}
                    ></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedTab("체육 시설");
                  }}
                  className={`relative text-[14px] leading-[21px] font-noto-sans ${
                    selectedTab === "체육 시설"
                      ? "text-[var(--Main-Primary,#222)] font-semibold"
                      : "text-[var(--Gray-400,#8E9398)] font-medium"
                  }`}
                >
                  시설 보기
                  {selectedTab === "체육 시설" && (
                    <div
                      className="absolute left-1/2 transform -translate-x-1/2 mt-[2px]"
                      style={{
                        width: "55px",
                        height: "1px",
                        background: "#222",
                      }}
                    ></div>
                  )}
                </button>
              </div>
            </div>
          )}

          {distanceModalVisible && (
            <>
              <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.20)] z-40"
                onClick={() => setDistanceModalVisible(false)}
              ></div>

              <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[375px] h-auto py-[20px] flex flex-col items-start gap-[10px] rounded-t-[20px] bg-[#FFF] z-50">
                <div className="w-full text-[16px] font-semibold text-center leading-[24px]">
                  최대 거리
                </div>
                <div className="flex flex-col gap-[10px] w-full mt-[12px]  max-h-[120px] overflow-y-scroll">
                  {distanceOptions.map((distance, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDistance(distance);
                        setDistanceModalVisible(false);
                      }}
                      className={`w-full py-[18px] px-[16px] flex items-center justify-start rounded-md ${
                        selectedDistance === distance
                          ? "bg-[#F1F1F1]"
                          : "bg-white"
                      } text-[14px] font-${
                        selectedDistance === distance ? "semibold" : "normal"
                      } text-[var(--Black,#1A1A1B)]`}
                    >
                      {distance}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {filterModalVisible && (
            <>
              <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.20)] z-40"
                onClick={() => setFilterModalVisible(false)}
              ></div>

              <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[375px] h-[189px] py-[20px] flex flex-col items-start gap-[10px] rounded-t-[20px] bg-[#FFF] z-50">
                <div className="w-full text-[16px] font-semibold text-center leading-[24px]">
                  필터
                </div>
                <div className="flex flex-col gap-[10px] w-full mt-[12px]">
                  <button
                    onClick={() => {
                      setSelectedFilter("별점순");
                      setFilterModalVisible(false);
                    }}
                    className={`w-full py-[18px] px-[16px] flex items-center  justify-start rounded-md ${
                      selectedFilter === "별점순" ? "bg-[#F1F1F1]" : "bg-white"
                    } text-[14px] font-${
                      selectedFilter === "별점순" ? "semibold" : "normal"
                    } text-[var(--Black,#1A1A1B)]`}
                  >
                    별점순
                  </button>

                  <button
                    onClick={() => {
                      setSelectedFilter("거리순");
                      setFilterModalVisible(false);
                    }}
                    className={`w-full py-[18px] px-[16px] flex items-center justify-start rounded-md ${
                      selectedFilter === "거리순" ? "bg-[#F1F1F1]" : "bg-white"
                    } text-[14px] font-${
                      selectedFilter === "거리순" ? "semibold" : "normal"
                    } text-[var(--Black,#1A1A1B)]`}
                  >
                    거리순
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="w-[343px] flex justify-end items-center mt-[18px]">
            <div className="flex items-center gap-[9px]">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setDistanceModalVisible(true)}
              >
                <span className="text-[12px] font-semibold text-[var(--Gray-500,#505458)] leading-[18px]">
                  {selectedDistance}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#505458"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                onClick={() => setFilterModalVisible(true)}
                className="flex items-center cursor-pointer"
              >
                <span className="text-[12px] font-semibold text-[var(--Gray-500,#505458)] leading-[18px]">
                  {selectedFilter}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#505458"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-[343px] mt-[7px]">
            {searchInput ? (
              searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.id)}
                    className="flex flex-col px-[6px] py-[12px] gap-[4px] border-b border-[var(--Gray-200,#E8E8E8)]"
                  >
                    <div
                      className="flex items-center justify-center h-[24px] px-[12px] gap-[2px] rounded-[2px] bg-[var(--Badge-green,#E5F9EE)]"
                      style={{ width: "fit-content" }}
                    >
                      <span className="text-[12px] font-medium text-[var(--Black,#1A1A1B)]">
                        {result.category}
                      </span>
                    </div>

                    <span className="text-[var(--Black,#1A1A1B)] font-[Inter] text-[16px] font-bold leading-[24px]">
                      {result.name}
                    </span>

                    <div className="flex items-center gap-[4px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none"
                      >
                        <path
                          d="M7.00003 10.0496L10.0448 11.8912C10.6024 12.2287 11.2847 11.7298 11.138 11.0988L10.331 7.63582L13.0236 5.3027C13.5151 4.87717 13.251 4.07011 12.6054 4.01875L9.06168 3.71794L7.67502 0.445713C7.42556 -0.148571 6.57449 -0.148571 6.32504 0.445713L4.93837 3.71061L1.39468 4.01142C0.749039 4.06278 0.484913 4.86983 0.976481 5.29536L3.6691 7.62848L2.86205 11.0915C2.71531 11.7224 3.39764 12.2213 3.95524 11.8838L7.00003 10.0496Z"
                          fill="#FFD643"
                        />
                      </svg>
                      <span className="text-[12px] text-[var(--Black,#1A1A1B)]">
                        {result.rating}
                      </span>
                      <span className="text-[12px] text-[#8E9398]">
                        ({result.reviews})
                      </span>
                    </div>
                    <span className="text-[var(--Gray-500,#505458)] font-[Inter] text-[12px] font-semibold leading-[18px]">
                      {result.distance} · {result.address}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  검색 결과가 없습니다.
                </p>
              )
            ) : (
              <div>
                <h2 className="text-[#1A1A1B] font-inter font-semibold text-[14px] leading-[21px] mb-4">
                  최근 검색어
                </h2>
                {recentSearches.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-[12px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
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
                        <g clipPath="url(#clip0_431_669)">
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
                          <clipPath id="clip0_431_669">
                            <rect
                              width="12"
                              height="12"
                              fill="white"
                              transform="translate(8 -0.166748) rotate(45)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
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

            <div className="flex items-center w-[343px] h-[36px] gap-[8px]">
              <div
                className="flex items-center justify-center w-[75px] h-[32px] flex-shrink-0 rounded-[20px] bg-[#EEE] cursor-pointer"
                style={{ color: "var(--Black, #1A1A1B)", textAlign: "center" }}
                onClick={() => setFilterModalVisible(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                >
                  <path
                    d="M6 4.12473e-07C5.37935 -0.00032496 4.77387 0.191856 4.26702 0.550057C3.76016 0.908257 3.37688 1.41484 3.17 2H0V4H3.17C3.3766 4.58553 3.75974 5.09257 4.2666 5.45121C4.77346 5.80986 5.37909 6.00245 6 6.00245C6.62091 6.00245 7.22654 5.80986 7.7334 5.45121C8.24026 5.09257 8.6234 4.58553 8.83 4H16V2H8.83C8.62312 1.41484 8.23984 0.908257 7.73298 0.550057C7.22613 0.191856 6.62065 -0.00032496 6 4.12473e-07ZM5 3C5 2.73478 5.10536 2.48043 5.29289 2.29289C5.48043 2.10536 5.73478 2 6 2C6.26522 2 6.51957 2.10536 6.70711 2.29289C6.89464 2.48043 7 2.73478 7 3C7 3.26522 6.89464 3.51957 6.70711 3.70711C6.51957 3.89464 6.26522 4 6 4C5.73478 4 5.48043 3.89464 5.29289 3.70711C5.10536 3.51957 5 3.26522 5 3ZM10 8C9.37935 7.99967 8.77387 8.19186 8.26702 8.55006C7.76016 8.90826 7.37688 9.41484 7.17 10H0V12H7.17C7.3766 12.5855 7.75974 13.0926 8.2666 13.4512C8.77346 13.8099 9.37909 14.0025 10 14.0025C10.6209 14.0025 11.2265 13.8099 11.7334 13.4512C12.2403 13.0926 12.6234 12.5855 12.83 12H16V10H12.83C12.6231 9.41484 12.2398 8.90826 11.733 8.55006C11.2261 8.19186 10.6207 7.99967 10 8ZM9 11C9 10.7348 9.10536 10.4804 9.29289 10.2929C9.48043 10.1054 9.73478 10 10 10C10.2652 10 10.5196 10.1054 10.7071 10.2929C10.8946 10.4804 11 10.7348 11 11C11 11.2652 10.8946 11.5196 10.7071 11.7071C10.5196 11.8946 10.2652 12 10 12C9.73478 12 9.48043 11.8946 9.29289 11.7071C9.10536 11.5196 9 11.2652 9 11Z"
                    fill="black"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "18px",
                    marginLeft: "4px",
                  }}
                >
                  필터
                </span>
              </div>

              <div
                className="flex items-center gap-[4px] flex-1 h-[32px] px-[16px] bg-[#F8F9FA] rounded-lg"
                style={{ width: "281px" }}
                onClick={() => setSearchActive(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_431_494)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.56188 1.7499C5.61461 1.7426 4.68649 2.01674 3.89521 2.53756C3.10392 3.05837 2.4851 3.80241 2.11719 4.67536C1.74928 5.5483 1.64885 6.51082 1.82864 7.44091C2.00843 8.371 2.46033 9.22675 3.12706 9.8997C3.79379 10.5726 4.64533 11.0325 5.5737 11.2209C6.50208 11.4093 7.4655 11.3178 8.34181 10.958C9.21813 10.5982 9.96788 9.98628 10.496 9.19985C11.0241 8.41343 11.3069 7.4879 11.3084 6.5406L11.9334 6.54158L11.3084 6.53964C11.3123 5.27577 10.815 4.0619 9.92544 3.16407C9.0359 2.26624 7.82669 1.7577 6.56284 1.7499L6.56188 1.7499ZM12.5584 6.54304C12.5564 7.73773 12.1998 8.90494 11.5337 9.89674C10.8676 10.8887 9.9219 11.6605 8.81658 12.1143C7.71126 12.5681 6.49609 12.6835 5.3251 12.4459C4.15411 12.2083 3.08005 11.6283 2.23909 10.7795C1.39812 9.93067 0.828127 8.85128 0.601357 7.67814C0.374588 6.505 0.50126 5.29095 0.965314 4.18989C1.42937 3.08882 2.20991 2.15035 3.20797 1.49343C4.20604 0.836507 5.37669 0.490731 6.57151 0.499935L6.5667 1.12492L6.57055 0.499928C6.57087 0.49993 6.57119 0.499933 6.57151 0.499935C8.16586 0.510023 9.69123 1.15166 10.8134 2.2843C11.9357 3.41704 12.5632 4.94849 12.5584 6.54304Z"
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
                    <clipPath id="clip0_431_494">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(0.5 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <input
                  type="text"
                  placeholder="검색어를 입력해 주세요."
                  className="flex-1 bg-transparent text-[#8E9398] text-[14px] font-normal outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {filterModalVisible && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 flex justify-center items-end"
          onClick={() => setFilterModalVisible(false)}
        >
          <div
            className="w-full max-w-[375px] h-[280px] bg-white rounded-t-[20px] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "전체",
                  "태권도",
                  "유도",
                  "복싱",
                  "주짓수",
                  "검도",
                  "합기도",
                ].map((category) => (
                  <button
                    key={category}
                    className={`text-xs font-medium ${
                      selectedCategory === category
                        ? "border border-[#1A1A1B] text-white"
                        : "text-black"
                    } px-3 py-1 rounded-lg`}
                    style={{
                      backgroundColor:
                        category === "전체"
                          ? selectedCategory === category
                            ? "#1A1A1B"
                            : "#F3F5F7"
                          : selectedCategory === category
                          ? "#1A1A1B"
                          : "#E0F8F7",
                      color:
                        category === "전체" && selectedCategory !== category
                          ? "#1A1A1B"
                          : selectedCategory === category
                          ? "white"
                          : "black",
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "헬스",
                  "요가",
                  "필라테스",
                  "크로스핏",
                  "에어로빅",
                  "댄스(줌바 등)",
                ].map((category) => (
                  <button
                    key={category}
                    className={`text-xs font-medium ${
                      selectedCategory === category
                        ? "border border-[#1A1A1B] text-white"
                        : "text-black"
                    } px-3 py-1 rounded-lg`}
                    style={{
                      backgroundColor:
                        selectedCategory === category ? "#1A1A1B" : "#E8EAF6",
                      color: selectedCategory === category ? "white" : "black",
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "축구(풋살)",
                  "농구",
                  "배구",
                  "야구",
                  "탁구",
                  "스쿼시",
                  "배드민턴",
                  "테니스",
                  "골프",
                ].map((category) => (
                  <button
                    key={category}
                    className={`text-xs font-medium ${
                      selectedCategory === category
                        ? "border border-[#1A1A1B] text-white"
                        : "text-black"
                    } px-3 py-1 rounded-lg`}
                    style={{
                      backgroundColor:
                        selectedCategory === category ? "#1A1A1B" : "#E5F9EE",
                      color: selectedCategory === category ? "white" : "black",
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "볼링",
                  "당구",
                  "클라이밍",
                  "롤러인라인",
                  "빙상(스케이트)",
                  "기타종목",
                  "종합체육시설",
                  "무용",
                  "줄넘기",
                  "펜싱",
                  "수영",
                  "승마",
                ].map((category) => (
                  <button
                    key={category}
                    className={`text-xs font-medium ${
                      selectedCategory === category
                        ? "border border-[#1A1A1B] text-white"
                        : "text-black"
                    } px-3 py-1 rounded-lg`}
                    style={{
                      backgroundColor:
                        selectedCategory === category ? "#1A1A1B" : "#FDE6F4",
                      color: selectedCategory === category ? "white" : "black",
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "기타종목",
                  "배드민턴",
                  "테니스",
                  "골프",
                  "줄넘기",
                  "펜싱",
                  "수영",
                  "승마",
                ].map((category) => (
                  <button
                    key={category}
                    className={`text-xs font-medium ${
                      selectedCategory === category
                        ? "border border-[#1A1A1B] text-white"
                        : "text-black"
                    } px-3 py-1 rounded-lg`}
                    style={{
                      backgroundColor:
                        selectedCategory === category ? "#1A1A1B" : "#E8E8E8",
                      color: selectedCategory === category ? "white" : "black",
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
