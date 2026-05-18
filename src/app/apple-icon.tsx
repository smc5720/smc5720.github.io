import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#07070A',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: '2px solid #2a2a2a',
        }}
      >
        {/* safe area padding 20px — inner container */}
        <div
          style={{
            width: 140,
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* center R */}
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 100,
              fontWeight: 600,
              color: '#C8FF00',
              lineHeight: 1,
            }}
          >
            R
          </span>
          {/* bottom-right accent dot */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 32,
              height: 32,
              borderRadius: 4,
              background: '#C8FF00',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  )
}
