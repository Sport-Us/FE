"use client";

import { useState, useEffect, useRef } from "react";
import { axios } from "@/lib/axios";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { ClipLoader } from "react-spinners";

export default function RecommendPage() {
  const [selectedTab, setSelectedTab] = useState<"강좌 추천" | "시설 추천">(
    "강좌 추천"
  );
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<string[]>([]); // 추가된 상태
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0); // 현재 category 인덱스

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState<number>(0);
  const router = useRouter();
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const categoryMap: Record<string, string> = {
    ALL: "전체",
    PUBLIC: "공공시설",
    PRIVATE: "민간시설",
    SCHOOL: "학교",
    DISABLED: "취약계층",

    HEALTH: "헬스",
    BASKETBALL: "농구",
    TENNIS: "테니스",
    SOCCER: "축구",
    VOLLEYBALL: "배구",
    BASEBALL: "야구",
    TABLE_TENNIS: "탁구",
    SQUASH: "스쿼시",
    BADMINTON: "배드민턴",
    GOLF: "골프",
    BAWLING: "볼링",
    BILLIARDS: "당구",
    CLIIMBING: "클라이밍",
    ROLLER_SKATING: "롤러인라인",
    ICE_SKATING: "빙상(스케이트)",
    COMPREHENSIVE: "종합체육시설",
    BALLET: "무용",
    JUMPING_ROPE: "줄넘기",
    FENCING: "펜싱",
    SWIMMING: "수영",
    RIDING: "승마",
    TAEKWONDO: "태권도",
    JUDO: "유도",
    BOXING: "복싱",
    JUJITSU: "주짓수",
    KENDO: "검도",
    HAPKIDO: "합기도",
    YOGA: "요가",
    PILATES: "필라테스",
    CROSSFIT: "크로스핏",
    AEROBICS: "에어로빅",
    DANCE: "댄스",
    ETC: "기타종목",
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

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error("위치 정보를 가져오는 데 실패했습니다:", error);
        }
      );
    } else {
      console.error("Geolocation을 사용할 수 없습니다.");
    }
  };

  const fetchRecommendations = async (isInitial = true) => {
    if ((isInitial && (latitude === null || longitude === null)) || !hasNext)
      return;

    const controller = new AbortController();
    setAbortController(controller);

    setLoading(true);
    try {
      const endpoint =
        selectedTab === "강좌 추천"
          ? "/recommend/search/lectures"
          : "/recommend/search/facilities";

      const response = await axios.get(endpoint, {
        params: { latitude, longitude },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        signal: controller.signal,
      });

      if (response.data.isSuccess) {
        const newRecommendations = response.data.results.placeList;

        setRecommendations(newRecommendations);
        setCategoryList(response.data.results.categoryList || []);
        setHasNext(response.data.results.hasNext);

        console.log("Initial Recommendations:", newRecommendations);
        console.log("Category List:", response.data.results.categoryList);
      } else {
        console.error("데이터를 가져오지 못했습니다:", response.data.message);
      }
    } catch (error) {
      console.error("추천 데이터 API 호출 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    if (!latitude || !longitude || loading || categoryList.length === 0) return;

    const currentCategory = categoryList[currentCategoryIndex];
    if (!currentCategory) return;

    const controller = new AbortController();
    setAbortController(controller);

    setLoading(true);

    try {
      const endpoint =
        selectedTab === "강좌 추천"
          ? "/places/search/lectures"
          : "/places/search/facilities";

      const response = await axios.get(endpoint, {
        params: {
          latitude,
          longitude,
          maxDistance: 10000,
          category: currentCategory,
          sortType: "STAR_DESC",
          page,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        signal: controller.signal,
      });

      if (response.data.isSuccess) {
        const newRecommendations = response.data.results.placeList;

        setRecommendations((prev) => [...prev, ...newRecommendations]); 
        setHasNext(response.data.results.hasNext);

        if (!response.data.results.hasNext) {
          const nextIndex = currentCategoryIndex + 1;
          if (nextIndex < categoryList.length) {
            setCurrentCategoryIndex(nextIndex);
            setPage(0); 
          }
        } else {
          setPage((prevPage) => prevPage + 1); 
        }

        console.log("Fetched Additional Data:", newRecommendations);
      } else {
        console.error("추가 데이터 요청 실패:", response.data.message);
      }
    } catch (error) {
      console.error("추가 데이터 API 호출 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchAdditionalData();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [
    loaderRef.current,
    loading,
    latitude,
    longitude,
    currentCategoryIndex,
    page,
    categoryList,
  ]);

  useEffect(() => {
    fetchLocation();
  }, []);

  // useEffect(() => {
  //   if (latitude !== null && longitude !== null) {
  //     fetchRecommendations();
  //   }
  // }, [latitude, longitude, selectedTab]);

  useEffect(() => {
    if (abortController) {
      abortController.abort();
    }
  
    const controller = new AbortController();
    setAbortController(controller);
  
    setLoading(true); 
    setRecommendations([]);
    setHasNext(true);
    setPage(0);
    setCategoryList([]);
    setCurrentCategoryIndex(0);
  
    const fetchData = async () => {
      try {
        const endpoint =
          selectedTab === "강좌 추천"
            ? "/recommend/search/lectures"
            : "/recommend/search/facilities";
  
        const response = await axios.get(endpoint, {
          params: { latitude, longitude },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          signal: controller.signal,
        });
  
        if (response.data.isSuccess) {
          const newRecommendations = response.data.results.placeList;
          setRecommendations(newRecommendations);
          setCategoryList(response.data.results.categoryList || []);
          setHasNext(response.data.results.hasNext);
        } else {
          console.error("데이터를 가져오지 못했습니다:", response.data.message);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          console.log("요청이 중단되었습니다.");
        } else {
          console.error("추천 데이터 API 호출 에러:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      controller.abort(); 
    };
  }, [selectedTab, latitude, longitude]);
  
  const handleTabClick = (tab: "강좌 추천" | "시설 추천") => {
    setSelectedTab(tab);
    // setRecommendations([]);
    // setHasNext(true);
    // setPage(0);
    // setCategoryList([]);
    // setCurrentCategoryIndex(0);
  };

  const handleItemClick = (placeId: number) => {
    router.push(`/home/${placeId}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center justify-between w-[343px] h-[36px] bg-[#EEE] rounded-[8px]">
            <button
              onClick={() => handleTabClick("강좌 추천")}
              className={`flex items-center justify-center w-[50%] h-[36px] rounded-[8px] ${
                selectedTab === "강좌 추천"
                  ? "bg-[rgba(1,135,186,0.28)]"
                  : "bg-transparent"
              }`}
            >
              <span
                className={`font-bold text-[12px] leading-[18px] ${
                  selectedTab === "강좌 추천"
                    ? "text-[rgba(0,0,0,0.60)]"
                    : "text-[#8E9398]"
                }`}
              >
                강좌 추천
              </span>
            </button>
            <button
              onClick={() => handleTabClick("시설 추천")}
              className={`flex items-center justify-center w-[50%] h-[36px] rounded-[8px] ${
                selectedTab === "시설 추천"
                  ? "bg-[rgba(1,135,186,0.28)]"
                  : "bg-transparent"
              }`}
            >
              <span
                className={`font-bold text-[12px] leading-[18px] ${
                  selectedTab === "시설 추천"
                    ? "text-[rgba(0,0,0,0.60)]"
                    : "text-[#8E9398]"
                }`}
              >
                시설 추천
              </span>
            </button>
          </div>
        </div>

        {loading && recommendations.length === 0 ? (
          <Loading
            message={
              selectedTab === "강좌 추천" ? (
                <>
                  회원님에게 맞는 맞춤 강좌를 찾는 중입니다.
                  <br />
                  2~3분 소요될 수 있습니다.
                </>
              ) : (
                <>
                  회원님에게 맞는 맞춤 시설을 찾는 중입니다.
                  <br />
                  2~3분 소요될 수 있습니다.
                </>
              )
            }
          />
        ) : (
          <div className="p-4 flex justify-center">
            <div className="w-full max-w-[375px]">
              {recommendations.map((item: any) => {
                const categories =
                  selectedTab === "강좌 추천"
                    ? lectureCategories
                    : facilityCategories;

                const categoryName =
                  categoryMap[item.category] || item.category;

                const category = categories.find(
                  (cat) => cat.name === categoryName
                );

                const bgColor = category?.bgColor || "#EEE";

                return (
                  <div
                    key={item.placeId}
                    onClick={() => handleItemClick(item.placeId)}
                    className="flex flex-col px-4 py-6 gap-2 border-b border-gray-200"
                  >
                    <div
                      className="flex items-center justify-center h-[24px] px-[12px] gap-[2px] rounded-[2px]"
                      style={{
                        backgroundColor: bgColor,
                        width: "fit-content",
                      }}
                    >
                      <span className="text-[12px] font-medium">
                        {categoryName || "기타"}
                      </span>
                    </div>

                    <span className="font-bold text-[16px] leading-[24px]">
                      {item.name}
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
                      <span className="text-[12px]">{item.rating}</span>
                      <span className="text-[12px] text-[#8E9398]">
                        ({item.reviewCount})
                      </span>
                    </div>
                    <span className="text-[12px]">
                      {item.distance}m · {item.address}
                    </span>
                  </div>
                );
              })}

              {loading && hasNext && (
                <div className="flex justify-center items-center my-4">
                  <ClipLoader size={35} color={"#0187BA"} loading={true} />
                </div>
              )}
              <div ref={loaderRef} style={{ height: "50px" }} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
