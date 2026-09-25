import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ハロウィン企画 | 志雲町立博物館',
  description: '志雲町立博物館ハロウィン企画「Trick or Treat ～お菓子をよこせ上原～」の説明と抽選ページです。',
  alternates: { canonical: '/halloween' },
};

export default function HalloweenLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
