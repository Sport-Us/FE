'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  console.log("404 페이지가 렌더링되었습니다!");

  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 className='mb-[130px]'>잘못된 경로입니다.</h1>
      <button
        onClick={handleGoHome}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#0187BA',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}
