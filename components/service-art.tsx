/** Static technical drawings: system architecture, a prototype fixture and a signal study. */
export default function ServiceArt({ variant }: { variant: number }) {
  return <svg viewBox="0 0 320 180" fill="none" aria-hidden="true" className="service-art">
    <defs>
      <linearGradient id={`service-surface-${variant}`} x1="60" y1="20" x2="240" y2="160" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff" stopOpacity=".05"/><stop offset="1" stopColor="#ffffff" stopOpacity=".01"/></linearGradient>
      <radialGradient id={`service-glow-${variant}`}><stop stopColor="#ff3b55" stopOpacity=".13"/><stop offset="1" stopColor="#ff3b55" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="160" cy="92" rx="110" ry="80" fill={`url(#service-glow-${variant})`}/>
    <g stroke="#ffffff" strokeOpacity=".07" strokeWidth=".7">
      {[40,80,120,160,200,240,280].map(x => <path key={`x${x}`} d={`M${x} 14v152`}/>)}
      {[30,70,110,150].map(y => <path key={`y${y}`} d={`M22 ${y}h276`}/>)}
    </g>
    {variant === 0 && <>
      <g stroke="#8b8b98" strokeOpacity=".65" strokeWidth="1">
        <path d="M78 47h29v30h22M78 132h29V102h22M191 77h22V47h29M191 102h22v30h29"/>
        <rect x="26" y="30" width="52" height="34" rx="7" fill={`url(#service-surface-${variant})`}/><rect x="26" y="115" width="52" height="34" rx="7" fill={`url(#service-surface-${variant})`}/>
        <rect x="242" y="30" width="52" height="34" rx="7" fill={`url(#service-surface-${variant})`}/><rect x="242" y="115" width="52" height="34" rx="7" fill={`url(#service-surface-${variant})`}/>
        <path d="M37 49h7l4-9 7 15 5-9h7M38 132h27M43 125v14m17-14v14M253 47h9m12 0h9m-21-6 12 12m0-12-12 12M253 132h7l6-8 7 16 6-8h5"/>
        <rect x="120" y="50" width="80" height="80" rx="14" strokeOpacity=".3"/>
        {[140,150,160,170,180].map(x => <path key={x} d={`M${x} 50v-9m0 89v9`}/>)}
      </g>
      <rect x="131" y="61" width="58" height="58" rx="8" fill="#ff3b5510" stroke="#ed687c" strokeWidth="1.1"/>
      <rect x="145" y="75" width="30" height="30" rx="4" stroke="#ed687c" strokeOpacity=".6"/>
      <path d="M152 90h16M160 82v16" stroke="#f6a0ae" strokeWidth="1.2"/>
      <g fill="#f18798"><circle cx="107" cy="77" r="2.3"/><circle cx="213" cy="102" r="2.3"/></g>
      <g fill="#93939e" fontFamily="monospace" fontSize="6.5" letterSpacing="1"><text x="34" y="25">SENSE</text><text x="244" y="25">ACTUATE</text><text x="136" y="157">CONTROL CORE</text></g>
    </>}
    {variant === 1 && <>
      <g stroke="#9494a1" strokeWidth="1">
        <path d="M78 45h150a12 12 0 0 1 12 12v72a12 12 0 0 1-12 12H78a12 12 0 0 1-12-12V57a12 12 0 0 1 12-12Z" fill={`url(#service-surface-${variant})`} strokeOpacity=".65"/>
        <path d="M85 55h150a12 12 0 0 1 12 12v72a12 12 0 0 1-12 12H85a12 12 0 0 1-12-12" strokeOpacity=".22"/>
        <path d="M66 24h174M66 19v10m174-10v10M45 45v96M40 45h10m-10 96h10" strokeOpacity=".35"/>
        {[83,223].flatMap(x=>[61,125].map(y=><circle key={`${x}-${y}`} cx={x} cy={y} r="4" strokeOpacity=".7"/>))}
        <circle cx="153" cy="93" r="33" strokeOpacity=".3"/><path d="M107 93h92M153 47v92" strokeDasharray="3 4" strokeOpacity=".25"/>
        <path d="M207 93h52v-25h30M153 131v29h39" strokeOpacity=".55"/>
      </g>
      <circle cx="153" cy="93" r="22" fill="#ff3b550e" stroke="#ed687c" strokeWidth="1.1"/><circle cx="153" cy="93" r="10" stroke="#ed687c" strokeOpacity=".5"/>
      <path d="m142 93 7 7 15-15" stroke="#f6a0ae" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="259" cy="68" r="2.3" fill="#f18798"/>
      <g fill="#93939e" fontFamily="monospace" fontSize="6.5" letterSpacing="1"><text x="112" y="18">DEFINE / VALIDATE</text><text x="198" y="163">TEST POINT</text></g>
    </>}
    {variant === 2 && <>
      <g stroke="#9494a1" strokeWidth="1" strokeOpacity=".4">
        <rect x="29" y="37" width="262" height="109" rx="8" fill={`url(#service-surface-${variant})`}/><path d="M46 55v72h227M46 91h227"/>
        <path d="M93 55v72m48-72v72m48-72v72m48-72v72" strokeOpacity=".14"/>
        <path d="M47 105c12 0 12-27 24-27s12 37 24 37 12-50 24-50 12 61 24 61 12-63 24-63 12 53 24 53 12-32 24-32 12 20 24 20 12-13 24-13" strokeDasharray="3 4" strokeOpacity=".5"/>
      </g>
      <path d="M47 94c12 0 12-10 24-10s12 18 24 18 12-27 24-27 12 38 24 38 12-48 24-48 12 40 24 40 12-19 24-19 12 13 24 13 12-6 24-6" stroke="#ed687c" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M167 50v84" stroke="#ed687c" strokeDasharray="2 4" strokeOpacity=".4"/><circle cx="167" cy="65" r="4" fill="#1a1115" stroke="#f6a0ae"/><circle cx="167" cy="65" r="1.5" fill="#f6a0ae"/>
      <g fill="#93939e" fontFamily="monospace" fontSize="6.5" letterSpacing="1"><text x="32" y="26">OBSERVE / MEASURE / REFINE</text><text x="32" y="163">SIGNAL STUDY</text><text x="252" y="163">f / t</text></g>
    </>}
  </svg>;
}
