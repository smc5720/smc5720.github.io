import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = "RicoCheese's Blog"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#07070A',
          padding: '72px 80px',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#C8FF00',
          }}
        />

        {/* Logo monogram */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 12,
            background: '#C8FF00',
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontFamily: 'serif',
              fontWeight: 700,
              fontSize: 36,
              color: '#07070A',
              lineHeight: 1,
            }}
          >
            R
          </span>
        </div>

        {/* Blog title */}
        <div
          style={{
            fontFamily: 'serif',
            fontWeight: 400,
            fontSize: 72,
            color: '#FFFFFF',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}
        >
          RicoCheese&apos;s Blog
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 400,
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.01em',
          }}
        >
          개발, 회고, 뉴스, 그리고 일상을 기록하는 블로그
        </div>

        {/* URL label */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            right: 80,
            fontFamily: 'monospace',
            fontWeight: 400,
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.05em',
          }}
        >
          smc5720.github.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
