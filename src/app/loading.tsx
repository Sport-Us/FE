'use client';

interface LoadingProps {
  message?: string | JSX.Element; 
}

export default function Loading({ message }: LoadingProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <svg
        width="50"
        height="50"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E5E5E5"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset="200"
        />
        <defs>
          <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#006CA7" />
            <stop offset="100%" stopColor="#ECFAFA" />
          </linearGradient>
        </defs>
      </svg>
      {message && (
        <p
          style={{
            marginTop: '16px',
            fontSize: '16px',
            color: '#505458',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
