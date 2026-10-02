export function Hands() {
  return <svg className="ed-hands-art" viewBox="0 0 1440 490" aria-hidden="true">
    <defs>
      <pattern id="robot-dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".85" fill="#161616"/></pattern>
      <pattern id="skin-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#282828"/></pattern>
      <pattern id="dense-dots" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx=".9" cy=".9" r=".85" fill="#151515"/></pattern>
      <linearGradient id="hand-shade" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#101010" stopOpacity=".06"/><stop offset="1" stopColor="#101010" stopOpacity=".36"/></linearGradient>
      <clipPath id="human-clip"><path d="M1510 502L1222 267C1170 243 1115 208 1069 189C1030 170 977 174 944 186L914 201C886 194 854 184 824 178L757 176C736 178 733 191 749 200L815 216L879 240L842 280L817 323C809 338 821 349 833 339L878 292L921 275L903 324L906 361C908 378 924 377 929 359L939 323L962 293L969 321L991 348C1002 361 1015 351 1008 337L995 306L1005 275C1039 284 1067 304 1093 323L1390 533Z"/></clipPath>
      <clipPath id="robot-clip"><path d="M-80 478L192 292L286 257L340 213L422 168L478 163L553 139L596 141C617 141 625 153 608 160L561 163L510 188L470 216L506 208L560 217L595 247C607 258 598 271 587 267L551 246L511 243L486 256L530 272L557 311C564 327 550 336 541 324L516 298L464 287L459 323L488 352C499 365 487 375 473 367L433 344L416 301L383 326L350 357L322 367L266 354L30 534Z"/></clipPath>
    </defs>
    <g className="ed-robot-hand" opacity=".85">
      <path d="M-80 478L192 292L286 257L340 213L422 168L478 163L553 139L596 141C617 141 625 153 608 160L561 163L510 188L470 216L506 208L560 217L595 247C607 258 598 271 587 267L551 246L511 243L486 256L530 272L557 311C564 327 550 336 541 324L516 298L464 287L459 323L488 352C499 365 487 375 473 367L433 344L416 301L383 326L350 357L322 367L266 354L30 534Z" fill="url(#robot-dots)" stroke="#333" strokeWidth="1.4"/>
      <g clipPath="url(#robot-clip)">
        <path d="M-10 465L289 279L381 288L435 258L452 302L362 365L280 346L64 501Z" fill="url(#dense-dots)"/>
        <path d="M-50 405L247 294L260 335L-40 493Z" fill="url(#hand-shade)"/>
        {Array.from({length:48},(_,i)=><path key={i} d={`M${-100+i*15} 495L${110+i*11} 145`} stroke="#333" opacity=".15" strokeWidth=".7"/>)}
        <path d="M112 356L286 278L320 311L266 349L138 427Z" fill="#d1d1cc" stroke="#222" strokeWidth="1.2"/>
        <path d="M148 363L281 296M160 376L292 312M171 388L280 330" fill="none" stroke="#393939" strokeWidth="2"/>
        <path d="M306 267L355 226L428 187L456 209L416 277L355 303L316 291Z" fill="url(#skin-dots)" stroke="#111" strokeWidth="2"/>
        <path d="M335 265L399 226L422 205M346 278L405 246L434 214" fill="none" stroke="#333" strokeWidth="2"/>
        <path d="M433 183L479 178L544 153L579 151M450 207L490 191L552 159M467 229L509 222L558 233L588 255M464 269L518 286L548 318M437 287L443 328L480 359" fill="none" stroke="#222" strokeWidth="5"/>
        <path d="M436 179L480 173L542 148M470 235L510 230L548 238M455 277L512 289M428 288L438 332" fill="none" stroke="#f5f5f0" strokeWidth="4"/>
        {[{x:294,y:305,r:27},{x:355,y:259,r:22},{x:440,y:196,r:15},{x:477,y:180,r:10},{x:544,y:153,r:8},{x:468,y:231,r:13},{x:508,y:229,r:9},{x:554,y:237,r:8},{x:456,y:273,r:12},{x:515,y:287,r:9},{x:438,y:328,r:8}].map((j,i)=><g key={i}><circle cx={j.x} cy={j.y} r={j.r} fill="#e1e1dc" stroke="#2b2b2b" strokeWidth="2"/><circle cx={j.x} cy={j.y} r={j.r*.66} fill="url(#dense-dots)" stroke="#666"/><circle cx={j.x} cy={j.y} r={j.r*.2} fill="#222"/><path d={`M${j.x-j.r*.7} ${j.y}h${j.r*1.4}`} stroke="#eee" opacity=".6"/></g>)}
        <path d="M13 428Q175 362 281 318Q341 290 360 265L443 198M36 450Q177 413 305 323Q386 294 468 235" fill="none" stroke="#141414" opacity=".5" strokeWidth="2"/>
      </g>
    </g>
    <g className="ed-human-hand" opacity=".75">
      <path d="M1510 502L1222 267C1170 243 1115 208 1069 189C1030 170 977 174 944 186L914 201C886 194 854 184 824 178L757 176C736 178 733 191 749 200L815 216L879 240L842 280L817 323C809 338 821 349 833 339L878 292L921 275L903 324L906 361C908 378 924 377 929 359L939 323L962 293L969 321L991 348C1002 361 1015 351 1008 337L995 306L1005 275C1039 284 1067 304 1093 323L1390 533Z" fill="url(#skin-dots)" stroke="#6b6b6b" strokeWidth=".7"/>
      <g clipPath="url(#human-clip)">
        <path d="M1450 507Q1220 350 1088 292Q994 245 954 224Q917 205 818 195L735 194L843 218L880 242L923 242L960 265L1005 275L1093 323L1390 533Z" fill="url(#dense-dots)" opacity=".7"/>
        <path d="M934 210Q1020 188 1084 220L1449 438L1476 552L1130 331Q1053 292 1003 267L937 255Z" fill="url(#hand-shade)"/>
        {Array.from({length:38},(_,i)=><path key={i} d={`M${730+i*16} 145Q${770+i*16} 295 ${865+i*16} 470`} fill="none" stroke="#4d4d4d" opacity=".12" strokeWidth=".9"/>)}
        <path d="M821 186Q823 198 817 210M874 198Q879 217 866 231M929 207Q953 218 973 246M914 277Q906 263 888 263M930 305Q942 311 941 321M977 294L989 300M1058 215Q1110 243 1158 268M1090 277Q1127 302 1180 330" fill="none" stroke="#222" opacity=".25" strokeWidth="1.5"/>
        <path d="M749 179Q762 187 758 197M818 324Q826 321 831 330M909 359Q915 352 922 362" fill="none" stroke="#444" opacity=".4"/>
      </g>
    </g>
    <g opacity=".2" stroke="#111" fill="none"><circle cx="678" cy="167" r="17"/><path d="M678 141V150M678 184V193M652 167H661M695 167H704"/></g>
  </svg>
}

export function ProjectArt({kind}:{kind:string}) {
  return <svg viewBox="0 0 660 520" className="ed-project-art" aria-hidden="true">
    <defs><pattern id={`grid-${kind}`} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="currentColor" opacity=".08"/></pattern></defs>
    <rect width="660" height="520" fill={`url(#grid-${kind})`}/>
    {kind==='antenna'?<g transform="translate(330 230)" fill="none" stroke="currentColor">
      {[48,90,132,174].map(r=><circle key={r} r={r} opacity=".22"/>)}
      {Array.from({length:24},(_,i)=><path key={i} d="M0 -187V187" transform={`rotate(${i*15})`} opacity={i%6===0?".35":".07"}/>)}
      <path d="M0-170C95-172 145-103 99-28C77 9 37 19 13 35C47 65 103 129 60 150C10 174-7 86-12 45C-61 93-133 128-145 76C-167 16-64-11-25-31C-76-103-68-169 0-170Z" strokeWidth="1.8"/>
      <path d="M0-139C72-150 120-86 72-25C46 9 16 16 0 29C29 63 70 122 39 124C9 128-7 73-12 37C-53 72-105 107-111 65C-119 20-60-3-20-24C-56-83-48-138 0-139Z" opacity=".28" strokeWidth="10"/>
      <circle r="6" fill="currentColor"/><path d="M-205 0H205M0-205V205" opacity=".45"/><circle cx="99" cy="-28" r="5" fill="currentColor"/>
    </g>:kind==='robot'?<g transform="translate(125 58)" fill="none" stroke="currentColor" strokeLinejoin="round">
      <path d="M65 287L200 226L368 264L231 328Z" opacity=".3"/><path d="M154 246L175 201L229 210L245 268L209 284L154 271Z" strokeWidth="2"/>
      <path d="M178 202L143 125L174 107L228 207M157 120L262 56L287 90L188 156M267 65L324 112L305 141L258 99" strokeWidth="2"/>
      <path d="M181 223L165 129L273 75L316 128" strokeWidth="13" opacity=".12"/>
      {[[176,215,25],[163,130,20],[270,78,17],[314,127,12]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r={r}/><circle cx={x} cy={y} r={r*.45}/></g>)}
      <path d="M307 139L300 168L320 178M327 135L347 155L340 177M77 230H380M124 70V314" opacity=".28"/>
      <path d="M280 33A62 62 0 0 1 334 76M288 35L280 33L283 25" opacity=".65"/>
    </g>:kind==='telemetry'?<g transform="translate(330 220)" fill="none" stroke="currentColor">
      {[42,85,130,175].map(r=><circle key={r} r={r} opacity=".18"/>)}
      {Array.from({length:16},(_,i)=><path key={i} d="M0 -180V-165" transform={`rotate(${i*22.5})`} opacity=".4" strokeWidth="1.5"/>)}
      <path d="M-180 0H-110L-85 -35L-60 45L-35 -55L-15 30L0 -15L25 40L45 -30L65 15L90 0H180" strokeWidth="2.2" opacity=".8"/>
      <path d="M-180 0H-110L-85 -35L-60 45L-35 -55L-15 30L0 -15L25 40L45 -30L65 15L90 0H180" strokeWidth="10" opacity=".12"/>
      {([[-85,-35],[-35,-55],[0,-15],[45,-30]] as const).map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="5" fill="currentColor"/><circle cx={x} cy={y} r="10" opacity=".3"/></g>)}
      <path d="M-190 0H190M0 -190V190" opacity=".3" strokeDasharray="3 3"/>
    </g>:<g transform="translate(330 218)" fill="none" stroke="currentColor">
      <path d="M-110-92L52-122L115 40L-51 79Z" strokeWidth="1.8"/><path d="M-110-92L-110-76L-51 95L115 57V40M-51 79V95" opacity=".45"/>
      <path d="M-39-49L23-63L49 4L-14 20Z" strokeWidth="2"/><path d="M-100-69L-145-129M61-104L128-160M94 33L156 82M-49 70L-109 132" strokeWidth="15" opacity=".22"/>
      {[[-157,-143],[145,-174],[174,99],[-119,151]].map(([x,y],i)=><g key={i}><ellipse cx={x} cy={y} rx="43" ry="19" transform={`rotate(-18 ${x} ${y})`}/><circle cx={x} cy={y} r="7"/><path d={`M${x-58} ${y}h116M${x} ${y-25}v50`} opacity=".16"/></g>)}
      {Array.from({length:9},(_,i)=><path key={i} d={`M${-44+i*8} -53l-5-13M${-17+i*8} 25l5 13`} opacity=".65"/>)}
      <path d="M-81-57L-54 17L-19 9M40-91L61-39L79-43M-33 47L54 24" opacity=".3"/>
    </g>}
  </svg>
}

export function ServiceIcon({index}:{index:number}) {
 const paths = [
  'M7 7h18v18H7zM11 11h10v10H11zM12 2v5M20 2v5M12 25v5M20 25v5M2 12h5M2 20h5M25 12h5M25 20h5',
  'M7 28h18M12 27v-6l-5-8 5-5 10 5 3-5M12 21h8M12 8l3-5M21 13l4 4 4-3M16 12l-4 4',
  'M16 14v15M10 29h12M11 9a7 7 0 0 0 0 12M21 9a7 7 0 0 1 0 12M7 5a13 13 0 0 0 0 20M25 5a13 13 0 0 1 0 20',
  'M4 17h6l4-10 5 18 4-10h5M4 5h24M4 29h24',
  'M16 2L29 9v14l-13 7L3 23V9Z M3 9l13 7 13-7M16 16v14M9 6l14 7v8',
  'M3 6h10l3 3 3-3h10v21H19l-3 3-3-3H3Z M16 9v21M7 12h5M7 17h5M20 12h5M20 17h5'
 ];
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[index]}/></svg>
}
