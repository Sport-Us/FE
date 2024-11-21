"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function OnboardingPage() {
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

      console.log("Access Token:", accessToken);
      // console.log("Refresh Token:", refreshToken);

      if (accessToken && refreshToken) {
      //if (accessToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          router.push("/home");
        } catch (error) {
          console.error("로컬 스토리지 저장 중 오류:", error);
          router.push("/login");
        }
      } else {
        console.error("accessToken 또는 refreshToken이 없습니다.");
        router.push("/login");
      }
    };

    handleTokenExtraction();
  }, [router]);

  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between p-4">
      {step === 1 && <Step1 onNext={handleNext} />}
      {step === 2 && <Step2 onNext={handleNext} />}
      {step === 3 && <Step3 />}
    </div>
  );
}
