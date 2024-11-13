import Link from "next/link";

export default function Header({
  title,
  showBackButton = true,
}: {
  title: string;
  showBackButton?: boolean;
}) {
  return (
    <header className="relative flex items-center w-full max-w-[375px] h-[44px] bg-white mb-4">
      {showBackButton && (
        <Link href="/" className="absolute left-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
          >
            <path
              d="M25.6 29.1998L18.4 21.9998L25.6 14.7998"
              stroke="#1A1A1B"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
      <h1 className="mx-auto text-center text-[14px] font-semibold">{title}</h1>
    </header>
  );
}
