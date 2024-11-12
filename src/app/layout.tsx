
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Sport:Us - 로그인',
  description: 'Sport:Us 로그인 페이지',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
