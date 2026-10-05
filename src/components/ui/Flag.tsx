import type { ReactNode, SVGProps } from 'react'

type SvgProps = SVGProps<SVGSVGElement>

function Star({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const radius = i % 2 === 0 ? r : r * 0.38
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`
  }).join(' ')
  return <polygon points={points} fill={fill} />
}

function Frame({ children, ...props }: SvgProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 3 2" aria-hidden {...props}>
      {children}
    </svg>
  )
}

const FLAGS: Record<string, (props: SvgProps) => ReactNode> = {
  BJ: (props) => (
    <Frame {...props}>
      <rect width="3" height="1" fill="#FCD116" />
      <rect y="1" width="3" height="1" fill="#E8112D" />
      <rect width="1.2" height="2" fill="#008751" />
    </Frame>
  ),
  TG: (props) => (
    <svg viewBox="0 0 5 3" aria-hidden {...props}>
      <rect width="5" height="0.6" fill="#006A4E" />
      <rect y="0.6" width="5" height="0.6" fill="#FFCE00" />
      <rect y="1.2" width="5" height="0.6" fill="#006A4E" />
      <rect y="1.8" width="5" height="0.6" fill="#FFCE00" />
      <rect y="2.4" width="5" height="0.6" fill="#006A4E" />
      <rect width="1.8" height="1.8" fill="#D21034" />
      <Star cx={0.9} cy={0.9} r={0.42} fill="#fff" />
    </svg>
  ),
  CI: (props) => (
    <Frame {...props}>
      <rect width="1" height="2" fill="#FF8200" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#009E60" />
    </Frame>
  ),
  SN: (props) => (
    <Frame {...props}>
      <rect width="1" height="2" fill="#00853F" />
      <rect x="1" width="1" height="2" fill="#FDEF42" />
      <rect x="2" width="1" height="2" fill="#E31B23" />
      <Star cx={1.5} cy={1} r={0.32} fill="#00853F" />
    </Frame>
  ),
  BF: (props) => (
    <Frame {...props}>
      <rect width="3" height="1" fill="#EF2B2D" />
      <rect y="1" width="3" height="1" fill="#009E49" />
      <Star cx={1.5} cy={1} r={0.32} fill="#FCD116" />
    </Frame>
  ),
  ML: (props) => (
    <Frame {...props}>
      <rect width="1" height="2" fill="#14B53A" />
      <rect x="1" width="1" height="2" fill="#FCD116" />
      <rect x="2" width="1" height="2" fill="#CE1126" />
    </Frame>
  ),
  NE: (props) => (
    <Frame {...props}>
      <rect width="3" height="0.667" fill="#E05206" />
      <rect y="0.667" width="3" height="0.666" fill="#fff" />
      <rect y="1.333" width="3" height="0.667" fill="#0DB02B" />
      <circle cx="1.5" cy="1" r="0.22" fill="#E05206" />
    </Frame>
  ),
  GH: (props) => (
    <Frame {...props}>
      <rect width="3" height="0.667" fill="#CE1126" />
      <rect y="0.667" width="3" height="0.666" fill="#FCD116" />
      <rect y="1.333" width="3" height="0.667" fill="#006B3F" />
      <Star cx={1.5} cy={1} r={0.28} fill="#000" />
    </Frame>
  ),
}

/** Drapeau SVG (les emoji drapeaux ne s'affichent pas sous Windows). */
export function Flag({ code, className }: { code: string; className?: string }) {
  const Icon = FLAGS[code]
  if (!Icon) return <span className={className}>{code}</span>
  return <Icon className={className} />
}
