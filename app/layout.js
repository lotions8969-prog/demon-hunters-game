import './globals.css'

export const metadata = {
  title: 'デーモンハンターズ ★ スターキャッチ！',
  description: 'デーモンハンターズといっしょにあそぼう！',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>{children}</body>
    </html>
  )
}
