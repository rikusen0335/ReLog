import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '職務経歴書',
    default: '職務経歴書',
  },
  description:
    'デスクリプション',
  robots: {
    index: false,
    googleBot: {
      index: false,
    },
  },
};

const hoge = "fuga"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
