"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/lib/axios";
import Footer from "../components/Footer";
import { debounce } from "lodash";
import { ClipLoader } from "react-spinners";
import Loading from "../loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleTokenExtraction = () => {
      if (typeof window === "undefined") {
        console.error("브라우저 환경이 아닙니다.");
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");

      if (accessToken && refreshToken) {
        // 소셜 로그인일 경우
        try {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        } catch (error) {
          console.error("로컬 스토리지 저장 중 오류:", error);
        }
      } else {
        // 일반 로그인일 경우 로컬 스토리지에서 토큰 확인
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("accessToken이 없습니다. 로그인 페이지로 이동합니다.");
          router.push("/login");
        }
      }
    };

    handleTokenExtraction();
  }, [router]);

  const facilityCategories = [
    { name: "전체", bgColor: "#F3F5F7" },
    { name: "취약계층", bgColor: "#E5F9EE" },
    { name: "공공시설", bgColor: "#E0F8F7" },
    { name: "학교", bgColor: "#E0F4FD" },
    { name: "민간시설", bgColor: "#E8EAF6" },
  ];
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

  const [selectedTab, setSelectedTab] = useState<"체육 강좌" | "체육 시설">(
    "체육 강좌"
  );
  const [selectedLectureCategories, setSelectedLectureCategories] = useState<
    string[]
  >(["전체"]);
  const [selectedFacilityCategories, setSelectedFacilityCategories] = useState<
    string[]
  >(["전체"]);
  const currentCategories =
    selectedTab === "체육 강좌" ? lectureCategories : facilityCategories;

  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);

  const clearMarkers = () => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = []; // 마커 배열 초기화
  };

  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]); // 최근 검색어
  const mapRef = useRef<any>(null);

  const handleCurrentLocation = () => {
    if (!map || !navigator.geolocation) {
      console.warn("지도 또는 Geolocation을 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        map.setCenter(new window.naver.maps.LatLng(latitude, longitude));
        map.setZoom(14); // 적절한 줌 레벨 설정

        // 마커 추가 (선택사항)
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(latitude, longitude),
          map,
          icon: {
            url: "/current-location.png", // 현위치 아이콘 (선택적으로 커스텀 가능)
            size: new window.naver.maps.Size(24, 24),
            scaledSize: new window.naver.maps.Size(24, 24),
          },
        });
      },
      (error) => {
        console.error("위치 정보를 가져오는 데 실패했습니다:", error);
      }
    );
  };

  useEffect(() => {
    if (!map) return;

    const handleBoundsChanged = debounce(async () => {
      // 기존 마커 제거
      clearMarkers();

      // 새 마커 생성
      await handleCategoryApply();
    }, 300);

    // 초기 마커 설정
    handleCategoryApply();

    // 지도 이동 시 이벤트 등록
    const listener = window.naver.maps.Event.addListener(
      map,
      "bounds_changed",
      handleBoundsChanged
    );

    return () => {
      // 컴포넌트 언마운트 시 이벤트 제거
      window.naver.maps.Event.removeListener(listener);
      handleBoundsChanged.cancel();
    };
  }, [map, selectedTab, selectedLectureCategories, selectedFacilityCategories]);

  useEffect(() => {
    // 로컬 스토리지에서 최근 검색어 가져오기
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const addSearchToRecent = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((item) => item !== searchTerm),
    ].slice(0, 10); // 중복 제거 후 최대 10개 유지
    setRecentSearches(updatedSearches);

    // 로컬 스토리지에 저장
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
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
    댄스: "DANCE",
    축구: "SOCCER",
    농구: "BASKETBALL",
    배구: "VOLLEYBALL",
    야구: "BASEBALL",
    탁구: "TABLE_TENNIS",
    스쿼시: "SQUASH",
    배드민턴: "BADMINTON",
    테니스: "TENNIS",
    골프: "GOLF",
    볼링: "BAWLING",
    당구: "BILLIARDS",
    클라이밍: "CLIIMBING",
    롤러인라인: "ROLLER_SKATING",
    "빙상(스케이트)": "ICE_SKATING",
    기타종목: "ETC",
    종합체육시설: "COMPREHENSIVE",
    무용: "BALLET",
    줄넘기: "JUMPING_ROPE",
    펜싱: "PENCING",
    수영: "SWIMMING",
    승마: "RIDING",

    취약계층: "DISABLED",
    공공시설: "PUBLIC",
    학교: "SCHOOL",
    민간시설: "PRIVATE",
  };

  const fetchPlaces = async (
    latitude: number,
    longitude: number,
    radius: number,
    categories: string[]
  ) => {
    const endpoint =
      selectedTab === "체육 강좌"
        ? "/places/nearby/lectures"
        : "/places/nearby/facilities";

    const mappedCategories = categories
      .map((cat) => categoryMap[cat])
      .join(",");

    try {
      const response = await axios.get(endpoint, {
        params: {
          latitude,
          longitude,
          radius,
          category: mappedCategories,
        },
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

  const handleCategoryToggle = (category: string) => {
    if (selectedTab === "체육 강좌") {
      setSelectedLectureCategories((prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category)
          : [...prev, category]
      );
    } else if (selectedTab === "체육 시설") {
      setSelectedFacilityCategories((prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category)
          : [...prev, category]
      );
    }
  };

  const handleCategoryApply = async () => {
    if (!map) return;

    // 기존 마커를 제거
    // clearMarkers();

    const center = map.getCenter();
    const latitude = center.lat();
    const longitude = center.lng();
    const radius =
      selectedDistance === "제한 없음"
        ? 3000
        : parseInt(selectedDistance) * 1000;

    const categoriesToSend =
      selectedTab === "체육 강좌"
        ? selectedLectureCategories
        : selectedFacilityCategories;

    clearMarkers();

    try {
      const places = await fetchPlaces(
        latitude,
        longitude,
        radius,
        categoriesToSend
      );

      const newMarkers = places.map(
        (place: {
          category: string;
          latitude: number;
          longitude: number;
          placeId: number;
        }) => {
          const markerImage = `/${place.category.toLowerCase()}.png?v=${Date.now()}`;
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(
              place.latitude,
              place.longitude
            ),
            map,
            icon: {
              url: markerImage,
              size: new window.naver.maps.Size(48, 48),
              scaledSize: new window.naver.maps.Size(48, 48),
            },
          });

          marker.addListener("click", () => handleMarkerClick(place.placeId));
          return marker;
        }
      );

      markersRef.current = newMarkers;
    } catch (error) {
      console.error("마커 생성 중 오류:", error);
    }
  };

  // useEffect(() => {
  //   clearMarkers();
  // }, [selectedTab]);

  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [searchLoading, setSearchLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [distanceModalVisible, setDistanceModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<"별점순" | "거리순">(
    "별점순"
  );
  const filterOptions: ("별점순" | "거리순")[] = ["별점순", "거리순"];

  const [selectedDistance, setSelectedDistance] = useState<string>("제한 없음");
  const distanceOptions = ["500m", "1km", "2km", "5km", "10km", "제한 없음"];

  const getKoreanCategory = (englishCategory: string): string => {
    const entry = Object.entries(categoryMap).find(
      ([, value]) => value === englishCategory
    );
    return entry ? entry[0] : "알 수 없음";
  };

  //검색
  const defaultMaxDistance = 100000;
  const currentCategory =
    selectedTab === "체육 강좌"
      ? selectedLectureCategories
      : selectedFacilityCategories;
  const currentEndpoint =
    selectedTab === "체육 강좌"
      ? "/places/search/lectures"
      : "/places/search/facilities";

  const fetchSearchResults = async (reset: boolean = false) => {
    if (!map || searchLoading) return;

    const center = mapRef.current?.getCenter();
    const longitude = center?.lng() || 127.027619;
    const latitude = center?.lat() || 37.497942;

    const params = {
      longitude,
      latitude,
      maxDistance:
        selectedDistance === "제한 없음"
          ? defaultMaxDistance
          : parseInt(selectedDistance) * 1000,
      category: currentCategory.includes("전체")
        ? "ALL"
        : currentCategory.map((cat) => categoryMap[cat]).join(","),
      sortType: selectedFilter === "별점순" ? "STAR_DESC" : "DISTANCE_ASC",
      keyword: searchInput,
      page: reset ? 0 : currentPage,
    };

    setSearchLoading(true);

    try {
      const response = await axios.get(
        selectedTab === "체육 강좌"
          ? "/places/search/lectures"
          : "/places/search/facilities",
        { params }
      );

      if (response.data.isSuccess) {
        const { placeList, hasNext, page } = response.data.results;

        setSearchResults(reset ? placeList : [...searchResults, ...placeList]);
        setHasNextPage(hasNext);
        setCurrentPage(page + 1);
      } else {
        console.error("API 호출 실패:", response.data.message);
      }
    } catch (error) {
      console.error("API 호출 에러:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (searchInput.trim()) {
      fetchSearchResults(true);
    }
  }, [
    selectedTab,
    selectedLectureCategories,
    selectedFacilityCategories,
    selectedFilter,
    selectedDistance,
  ]);

  const handleTabChange = async (newTab: "체육 강좌" | "체육 시설") => {
    if (newTab !== selectedTab) {
      setSearchLoading(true); // 로딩 시작
      setSelectedTab(newTab);
      setSearchResults([]); // 기존 결과 초기화

      // 탭 전환 시 데이터 로드 (예제: 1초 지연)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSearchLoading(false); // 로딩 종료
    }
  };

  const loadMoreResults = async () => {
    // 검색 중이거나 더 이상 데이터가 없을 때 실행 안 함
    if (searchLoading || !hasNextPage) return;

    // 로딩 상태 시작
    setSearchLoading(true);

    try {
      const response = await axios.get(currentEndpoint, {
        params: {
          longitude: mapRef.current?.getCenter()?.lng() || 127.027619,
          latitude: mapRef.current?.getCenter()?.lat() || 37.497942,
          maxDistance:
            selectedDistance === "제한 없음"
              ? defaultMaxDistance
              : parseInt(selectedDistance) * 1000,
          category: currentCategory.includes("전체")
            ? "ALL"
            : currentCategory.map((cat) => categoryMap[cat]).join(","),
          sortType: selectedFilter === "별점순" ? "STAR_DESC" : "DISTANCE_ASC",
          keyword: searchInput,
          page: currentPage, // 현재 페이지
        },
      });

      if (response.data.isSuccess) {
        const { placeList, hasNext, page } = response.data.results;

        // 새로운 결과 추가
        setSearchResults((prevResults) => [...prevResults, ...placeList]);
        setHasNextPage(hasNext); // 다음 페이지 존재 여부 업데이트
        setCurrentPage(page + 1); // 다음 페이지 설정
      } else {
        console.error("API 호출 실패:", response.data.message);
      }
    } catch (error) {
      console.error("API 호출 에러:", error);
    } finally {
      // 로딩 상태 종료
      setSearchLoading(false);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !searchLoading) {
          loadMoreResults();
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector("#load-more-trigger");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, searchLoading, currentPage]);

  useEffect(() => {
    const initMap = (latitude: number, longitude: number) => {
      if (typeof window.naver === "undefined") {
        console.error("네이버 지도 API가 로드되지 않았습니다.");
        return;
      }

      const mapOptions = {
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 14,
        logoControl: false,
        scaleControl: false,
        mapDataControl: false,
      };

      const newMap = new window.naver.maps.Map("map", mapOptions);
      setMap(newMap);

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(latitude, longitude),
        map: newMap, // newMap 사용
        icon: {
          url: "/current-location.png", // 현위치 아이콘
          size: new window.naver.maps.Size(24, 24),
          scaledSize: new window.naver.maps.Size(24, 24),
        },
      });

      // new window.naver.maps.Marker({
      //   position: new window.naver.maps.LatLng(latitude, longitude),
      //   map: newMap,
      // });

      window.naver.maps.Event.addListener(newMap, "bounds_changed", () => {
        clearMarkers();

        handleCategoryApply();
      });
    };
    const loadMapWithCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            initMap(latitude, longitude);
          },
          (error) => {
            console.error("위치 정보를 가져오는 데 실패했습니다:", error);
            initMap(37.5665, 126.978); // 서울 시청을 기본값으로 설정
          }
        );
      } else {
        console.warn("Geolocation을 사용할 수 없습니다.");
        initMap(37.5665, 126.978);
      }
    };

    if (!window.naver) {
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID`;
      script.async = true;
      script.onload = loadMapWithCurrentLocation;
      document.head.appendChild(script);
    } else {
      loadMapWithCurrentLocation();
    }
    const handleLocationError = (error: GeolocationPositionError) => {
      console.error("위치 정보를 가져오는 데 실패했습니다:", error);
      initMap(37.5665, 126.978);
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
    const updatedSearches = recentSearches.filter((search) => search !== item);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleClearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
  };

  const handleSearchSubmit = () => {
    if (!searchInput.trim()) return;

    setSearchActive(true);
    addSearchToRecent(searchInput);
    fetchSearchResults(true);
  };

  const handleResultClick = (placeId: number) => {
    if (!placeId) {
      console.error("Invalid placeId:", placeId);
      return;
    }
    const targetUrl = `/home/${placeId}`;
    console.log("Navigating to:", targetUrl);
    router.push(targetUrl);
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setSearchInput(searchTerm);
    setSearchActive(true);
    addSearchToRecent(searchTerm);
    fetchSearchResults(true);
  };

  const handleMarkerClick = (placeId: number) => {
    router.push(`/home/${placeId}`);
  };

  return (
    <div className="relative w-full h-screen max-w-[375px] mx-auto">
      <div
        id="map"
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 0 }}
      ></div>

      <style jsx>{`
        #map .naver-copyright,
        #map .naver-logo {
          position: absolute !important;
          bottom: 80px;
          left: 10px;
          z-index: 10;
        }
      `}</style>
      <button
        className="absolute bottom-20 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-50 border border-gray-300"
        onClick={handleCurrentLocation}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="12" cy="12" r="4" fill="#000" />
        </svg>
      </button>
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
              <input
                type="text"
                placeholder="검색어를 입력해 주세요."
                className="flex-1 bg-transparent text-[#8E9398] text-[14px] font-normal outline-none"
                value={searchInput}
                onChange={handleSearchInput} // 검색어 변경만 반영
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                onClick={handleSearchSubmit}
                style={{ cursor: "pointer" }}
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
            </div>
          </div>
          {searchInput && searchResults.length > 0 && (
            <div className="w-[343px] flex flex-col items-start mt-[16px]">
              <div className="flex items-center w-[343px] h-[36px] gap-[4px] bg-[#EEE] rounded-lg">
                <button
                  onClick={() => handleTabChange("체육 강좌")}
                  className={`flex items-center justify-center w-[175px] h-[36px] py-[10px] px-[16px] gap-[4px] rounded-lg ${
                    selectedTab === "체육 강좌"
                      ? "bg-[rgba(1,135,186,0.28)]"
                      : "bg-transparent"
                  }`}
                >
                  <span
                    className={`text-[12px] font-bold leading-[18px] ${
                      selectedTab === "체육 강좌"
                        ? "text-[#000]"
                        : "text-[rgba(0,0,0,0.60)]"
                    }`}
                  >
                    체육 강좌
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange("체육 시설")}
                  className={`flex items-center justify-center w-[175px] h-[36px] py-[10px] px-[16px] gap-[4px] rounded-lg ${
                    selectedTab === "체육 시설"
                      ? "bg-[rgba(1,135,186,0.28)]"
                      : "bg-transparent"
                  }`}
                >
                  <span
                    className={`text-[12px] font-bold leading-[18px] ${
                      selectedTab === "체육 시설"
                        ? "text-[#000]"
                        : "text-[rgba(0,0,0,0.60)]"
                    }`}
                  >
                    체육 시설
                  </span>
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

              {filterModalVisible && (
                <>
                  <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-40"
                    onClick={() => setFilterModalVisible(false)}
                  ></div>
                  <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[375px] h-auto py-[20px] flex flex-col items-start gap-[10px] rounded-t-[20px] bg-[#FFF] z-50">
                    <div className="w-full text-[16px] font-semibold text-center leading-[24px]">
                      정렬 필터
                    </div>
                    <div className="flex flex-col gap-[10px] w-full mt-[12px] max-h-[120px] overflow-y-scroll">
                      {filterOptions.map((filter, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedFilter(filter);
                            setFilterModalVisible(false);
                          }}
                          className={`w-full py-[18px] px-[16px] flex items-center justify-start rounded-md ${
                            selectedFilter === filter
                              ? "bg-[#F1F1F1]"
                              : "bg-white"
                          } text-[14px] font-${
                            selectedFilter === filter ? "semibold" : "normal"
                          } text-[var(--Black,#1A1A1B)]`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
          <div className="w-[343px] mt-[7px] flex-1 overflow-y-auto pb-[80px]">
            {searchInput.trim() ? (
              searchResults.length > 0 ? (
                <>
                  {searchResults.map((result) => {
                    const koreanCategory = getKoreanCategory(result.category); // 한글 카테고리 이름 가져오기
                    const bgColor =
                      currentCategories.find(
                        (cat) => cat.name === koreanCategory
                      )?.bgColor || "#EEE"; // 배경색 매핑

                    return (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result.placeId)}
                        className="flex flex-col px-[6px] py-[12px] gap-[4px] border-b border-[var(--Gray-200,#E8E8E8)]"
                      >
                        <div
                          className="flex items-center justify-center h-[24px] px-[12px] gap-[2px] rounded-[2px]"
                          style={{
                            backgroundColor: bgColor,
                            width: "fit-content",
                          }}
                        >
                          <span className="text-[12px] font-medium text-[var(--Black,#1A1A1B)]">
                            {koreanCategory}
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
                            ({result.reviewCount})
                          </span>
                        </div>
                        <span className="text-[var(--Gray-500,#505458)] font-[Inter] text-[12px] font-semibold leading-[18px]">
                          {result.distance}m · {result.address}
                        </span>
                      </div>
                    );
                  })}

                  {searchLoading && hasNextPage && (
                    <div className="flex justify-center items-center my-4">
                      <ClipLoader size={35} color={"#0187BA"} loading={true} />
                    </div>
                  )}
                  <div
                    id="load-more-trigger"
                    style={{ height: "1px", visibility: "hidden" }}
                  />
                </>
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
                    <div
                      className="flex items-center gap-[12px] cursor-pointer"
                      onClick={() => handleRecentSearchClick(item)} // 클릭 이벤트
                    >
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
                          <clipPath id="clip0_431_669)">
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
          </div>{" "}
          <Footer />
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
                onClick={() => setCategoryModalVisible(true)}
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
      {categoryModalVisible && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 flex justify-center items-end"
          onClick={() => setCategoryModalVisible(false)}
        >
          <div
            className="w-full max-w-[375px] h-auto bg-white rounded-t-[20px] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap justify-center gap-2">
              {currentCategories.map((category) => {
                const isSelected =
                  selectedTab === "체육 강좌"
                    ? selectedLectureCategories.includes(category.name)
                    : selectedFacilityCategories.includes(category.name);

                return (
                  <button
                    key={category.name}
                    className={`text-xs font-medium ${
                      isSelected
                        ? "border border-[#1A1A1B] text-white"
                        : "text-black"
                    } px-3 py-1 rounded-lg`}
                    style={{
                      backgroundColor: isSelected
                        ? "#1A1A1B"
                        : category.bgColor,
                      color: isSelected ? "white" : "black",
                    }}
                    onClick={() => handleCategoryToggle(category.name)}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            <div className="w-full text-center mt-4">
              <button
                className="px-4 py-2 bg-[#1A1A1B] text-white rounded-lg"
                onClick={() => {
                  handleCategoryApply();
                  setCategoryModalVisible(false);
                }}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
