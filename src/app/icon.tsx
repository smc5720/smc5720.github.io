import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#07070A',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: '1px solid #2a2a2a',
        }}
      >
        {/* center R */}
        <span
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 18,
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
            right: 2,
            bottom: 2,
            width: 6,
            height: 6,
            borderRadius: 1,
            background: '#C8FF00',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
