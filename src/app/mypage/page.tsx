"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axios } from "@/lib/axios";

interface UserProfile {
  profileImageUrl?: string;
  nickname: string;
  provider: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm h-[38%] p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-5 text-center">{title}</h2>
        <p className="text-sm text-gray-800 mb-6 whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
};

export default function MyPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/users");
        if (response.data.isSuccess) {
          setUserProfile(response.data.results);
        } else {
          alert("사용자 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    alert("로그아웃되었습니다.");
    router.push("/home");
  };

  const handleWithdrawClick = async () => {
    try {
      const response = await axios.delete("/auth/withdraw");
      if (response.data.isSuccess) {
        alert("회원탈퇴가 완료되었습니다.");
        router.push("/home");
      } else {
        alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  const openModal = (title: string, content: string) => {
    setModalInfo({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  const profileImageUrl =
    userProfile?.profileImageUrl && userProfile.profileImageUrl !== ""
      ? userProfile.profileImageUrl
      : "/profile.png";

  const providerImageUrl =
    userProfile?.provider === "NAVER" ? "/naver.png" : "/profile.png";

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      <Header title="마이페이지" showBackButton={false} />

      <div className="flex flex-col items-center mt-7">
        <div
          className="w-[100px] h-[100px] rounded-full overflow-hidden"
          style={{
            position: "relative",
          }}
        >
          <Image
            src={profileImageUrl}
            alt="Profile"
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="flex items-center mt-4">
          <span
            className="text-black font-semibold text-[18px] leading-[27px]"
            style={{ fontFamily: "Inter" }}
          >
            {userProfile?.nickname || "닉네임"}
          </span>
          <svg
            onClick={() => router.push("/mypage/editprofile")}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            className="ml-1"
          >
            <path
              d="M9 18.5L15 12.5L9 6.5"
              stroke="#505458"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center mt-2">
          <span
            className="text-black font-semibold text-[14px] leading-[21px] text-center"
            style={{ fontFamily: "Inter" }}
          >
            연결된 계정
          </span>
          <Image src={providerImageUrl} alt="Provider" width={20} height={20} />
        </div>
      </div>

      <div className="flex flex-col w-full max-w-md mt-12 space-y-2">
        {[
          { name: "북마크", onClick: () => router.push("/mypage/mybookmark") },
          { name: "내 리뷰", onClick: () => router.push("/mypage/myreview") },
          {
            name: "개인정보처리방침",
            onClick: () =>
              openModal(
                "개인정보처리방침",
                `Sport:Us는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하며, 이를 이용하여 맞춤형 서비스를 제공합니다.
      
        수집되는 정보는 안전하게 보호되며 필요시 마케팅 목적으로도 활용될 수 있습니다.`
              ),
          },
          {
            name: "서비스 이용약관",
            onClick: () =>
              openModal(
                "서비스 이용약관",
                `Sport:Us 서비스 이용 약관은 여러분의 서비스 이용과 관련한 기본적인 권리 및 의무를 규정합니다.
      
      서비스 제공자는 이용자의 데이터를 안전하게 관리하고, 불법 행위를 방지하며, 이용자는 이를 준수하여 정당한 사용을 보장받습니다.
      
      구체적인 조항은 회사의 정책에 따라 수정될 수 있습니다.`
              ),
          },
          { name: "로그아웃", onClick: handleLogoutClick },
        ].map((item) => (
          <div
            key={item.name}
            onClick={item.onClick}
            className="flex items-center h-[48px] pl-[16px] gap-2 cursor-pointer"
          >
            <span
              className="text-black font-semibold text-[14px] leading-[21px]"
              style={{ fontFamily: "Inter" }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between w-full max-w-md px-4 mt-[15px] text-gray-400">
        <span
          className="text-[12px] leading-[18px]"
          style={{ fontFamily: "Inter" }}
        >
          앱 버전
        </span>
        <span
          className="text-[12px] leading-[18px]"
          style={{ fontFamily: "Inter" }}
        >
          1.0.0
        </span>
      </div>

      <div
        onClick={handleWithdrawClick}
        className="flex justify-end items-center w-full max-w-md px-4 mt-[62px] text-gray-400"
      >
        <span
          className="text-[12px] leading-[18px] mb-[2px]"
          style={{ fontFamily: "Inter" }}
        >
          회원탈퇴
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M10.599 5.10102C10.5433 5.04523 10.4528 5.04523 10.3971 5.10102L9.89398 5.60423C9.8383 5.65992 9.83821 5.75017 9.89378 5.80597L10.8403 6.75642C10.93 6.84647 10.8662 7 10.7391 7H6.14203C6.06316 7 5.99922 7.06394 5.99922 7.14281V7.85719C5.99922 7.93606 6.06316 8 6.14203 8H10.7382C10.8654 8 10.9291 8.1538 10.8392 8.24377L9.89382 9.18939C9.8382 9.24502 9.83804 9.33514 9.89346 9.39096L10.3971 9.89827C10.4528 9.95439 10.5435 9.95455 10.5994 9.89862L12.8965 7.60097C12.9522 7.5452 12.9522 7.4548 12.8965 7.39903L10.599 5.10102ZM3.99974 4.14281C3.99974 4.06394 4.06368 4 4.14255 4H7.85589C7.93476 4 7.9987 3.93606 7.9987 3.85719V3.14281C7.9987 3.06394 7.93476 3 7.85589 3H3.99974C3.44988 3 3 3.45 3 4V11C3 11.55 3.44988 12 3.99974 12H7.85589C7.93476 12 7.9987 11.9361 7.9987 11.8572V11.1428C7.9987 11.0639 7.93476 11 7.85589 11H4.14255C4.06368 11 3.99974 10.9361 3.99974 10.8572V4.14281Z"
            fill="#8E9398"
          />
        </svg>
      </div>

      <Footer />

      {/* 모달 추가 */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={closeModal}
        title={modalInfo.title}
        content={modalInfo.content}
      />
    </div>
  );
}
