"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/lib/axios";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedData, setSelectedData] = useState({
    INTEREST: [] as string[],
    PREFERENCE: [] as string[],
    PURPOSE: [] as string[],
  });

  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    const refreshToken = window.localStorage.getItem("refreshToken");
  
   // 1. 토큰이 없는 경우 로그인 페이지로 이동
  // if (!accessToken || !refreshToken) {
  //   console.error("토큰이 유효하지 않습니다. 로그인 화면으로 이동합니다.");
  //   router.push("/login");
  //   return;
  // }

  // 2. URL에 토큰 파라미터가 있는 경우 소셜 로그인 처리
  const urlParams = new URLSearchParams(window.location.search);
  const accessTokenParam = urlParams.get("accessToken");
  const refreshTokenParam = urlParams.get("refreshToken");

  if (accessTokenParam && refreshTokenParam) {
    try {
      localStorage.setItem("accessToken", accessTokenParam);
      localStorage.setItem("refreshToken", refreshTokenParam);
      console.log("소셜 로그인 토큰 저장 완료.");

    } catch (error) {
      console.error("소셜 로그인 토큰 저장 중 오류:", error);
      router.push("/login");
    }
  }
}, [router]);
  

  // useEffect(() => {
  //   const handleTokenExtraction = () => {
  //     if (typeof window === "undefined") {
  //       console.error("브라우저 환경이 아닙니다.");
  //       return;
  //     }

  //     const urlParams = new URLSearchParams(window.location.search);
  //     const accessToken = urlParams.get("accessToken");
  //     const refreshToken = urlParams.get("refreshToken");

  //     if (accessToken && refreshToken) {
  //       try {
  //         localStorage.setItem("accessToken", accessToken);
  //         localStorage.setItem("refreshToken", refreshToken);

  //       } catch (error) {
  //         console.error("로컬 스토리지 저장 중 오류:", error);
  //       }
  //     } else {
  //       console.error("accessToken이 없습니다.");
  //       router.push("/login");
  //     }
  //   };

  //   handleTokenExtraction();
  // }, [router]);

  const handleNext = (
    type: "INTEREST" | "PREFERENCE" | "PURPOSE",
    content: string[]
  ) => {
    setSelectedData((prev) => ({
      ...prev,
      [type]: content,
    }));

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const requestBody = {
      userOnboardingRequestList: Object.entries(selectedData).flatMap(
        ([onboardingType, contents]) =>
          contents.map((content) => ({ onboardingType, content }))
      ),
    };

    try {
      const response = await axios.post("/users/onboarding", requestBody);

      if (response.data.isSuccess) {
        router.push("/home");
      } else {
        console.error("오류:", response.data.message || "알 수 없는 오류 발생");
      }
    } catch (error) {
      console.error("Onboarding API 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between p-4">
      {step === 1 && (
        <Step1
          onNext={(selectedItems) => handleNext("INTEREST", selectedItems)}
        />
      )}
      {step === 2 && (
        <Step2
          onNext={(selectedItems) => handleNext("PREFERENCE", selectedItems)}
        />
      )}
           {step === 3 && <Step3 onSubmit={handleSubmit} />} {/* 변경된 부분 */}

    </div>
  );
}
