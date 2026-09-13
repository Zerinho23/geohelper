export function AtlasVisual() {
  return (
    <div className="atlas-visual" aria-hidden="true">
      <svg viewBox="0 0 600 260" className="atlas-map">
        <defs>
          <pattern id="atlas-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#69beff" strokeOpacity=".13" />
          </pattern>
        </defs>
        <rect width="600" height="260" fill="url(#atlas-grid)" />
        <g fill="#326998" stroke="#7dd3fc" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M54 62 90 35 149 40 171 62 153 84 122 91 106 123 84 113 74 84Z M116 132 150 141 168 169 150 216 130 233 119 193 105 164Z M212 30 244 23 260 44 239 67 219 58Z M275 72 295 49 327 55 348 38 407 40 429 56 471 53 529 83 515 109 475 116 455 144 431 116 407 120 393 97 367 97 344 82 324 101 300 93Z M292 103 330 108 350 141 335 181 308 204 288 171 277 130Z M445 182 480 163 517 179 526 205 497 221 461 210Z M539 216 551 207 557 224 544 236Z" />
        </g>
        <path
          className="atlas-route"
          d="M112 80 Q260 -15 314 125 T490 192"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="2"
          strokeDasharray="7 7"
        />
        <g fill="#b8f6ff" stroke="#38bdf8" strokeWidth="6">
          <circle cx="112" cy="80" r="5" />
          <circle cx="314" cy="125" r="5" />
          <circle cx="490" cy="192" r="5" />
        </g>
      </svg>
      <div className="atlas-caption">
        <span>EXPLORA SIN LÍMITES</span>
        <span>TU PRÓXIMO DESTINO →</span>
      </div>
    </div>
  )
}
