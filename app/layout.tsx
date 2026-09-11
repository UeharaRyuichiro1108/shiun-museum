import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={
  metadataBase:new URL('https://shiun-museum.jinzhikamui.workers.dev'),
  title:'志雲町立博物館',
  description:'一次創作「愛館市立郷土資料館」の世界観を基盤とした、志雲町立博物館のキャラクター紹介サイト。',
  alternates:{canonical:'/'},
  verification:{google:'ZHfA4EuUEK2NVumwK_w128sEt2vBkqzP1Jms0qGUEn0'},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ja"><body>{children}</body></html>}
