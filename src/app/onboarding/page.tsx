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

  // useEffect(() => {
  //   const handleTokenExtraction = () => {
  //     if (typeof window === "undefined") {
  //       console.error("브라우저 환경이 아닙니다.");
  //       return;
  //     }

  //     const urlParams = new URLSearchParams(window.location.search);
  //     const accessToken = urlParams.get("accessToken");

  //     if (accessToken) {
  //       try {
  //         localStorage.setItem("accessToken", accessToken);
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
      {step === 3 && (
        <Step3
          onNext={(selectedItems) => handleNext("PURPOSE", selectedItems)}
        />
      )}
    </div>
  );
}
