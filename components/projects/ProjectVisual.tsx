import type { ReactNode } from 'react';

type ProjectVisualProps = { art?: string; className?: string };
const ink = '#090b0e', panel = '#14171c', edge = '#67717e', silver = '#c3cbd3', coral = '#f27976', red = '#c43842', faint = '#303741';
const disciplines: Record<string, string> = {
  polar: 'Antenna systems', 'rf-spectrum': 'RF instrumentation', 'direction-finder': 'Radio direction finding', shielding: 'Electromagnetic compatibility', rescue: 'Field robotics', vision: 'Machine perception', 'ar-display': 'Optical systems', 'night-vision': 'Low-light imaging', kinematics: 'Robot kinematics', drone: 'Flight systems', 'wireless-power': 'Resonant power', 'wind-tunnel': 'Experimental aerodynamics', composite: 'Composite structures', magnetic: 'Electromagnetic systems', signals: 'Signal acquisition',
};
function Screw({ x, y, r = 3 }: { x: number; y: number; r?: number }) {
  return <g stroke={edge} strokeWidth=".85"><circle cx={x} cy={y} r={r} fill={ink}/><path d={`M${x-r*.45} ${y+r*.45}l${r*.9} ${-r*.9}`}/></g>;
}
function Axis({ x = 498, y = 236 }: { x?: number; y?: number }) {
  return <g transform={`translate(${x} ${y})`} strokeWidth="1" opacity=".65"><path d="M0 0h27M0 0v-27M0 0l-17 12M23-3 27 0 23 3M-3-23 0-27 3-23" stroke={edge}/><circle r="2" fill={coral}/></g>;
}
function Callout({ points, label, x, y }: { points: string; label: string; x: number; y: number }) {
  return <g><polyline points={points} stroke={edge} strokeWidth=".7" opacity=".65"/><text x={x} y={y} fill="#83909e" fontSize="7" fontFamily="monospace" letterSpacing="1.1">{label}</text></g>;
}
function AntennaPolar() {
  return <>
    <g transform="translate(353 153)">
      {[31,60,90,118].map(r=><circle key={r} r={r} stroke={faint} strokeWidth=".8"/>)}
      {Array.from({length:12},(_,i)=><path key={i} d="M0-121V121" transform={`rotate(${i*15})`} stroke={faint} strokeWidth=".5" opacity=".65"/>)}
      <path d="M0 0C16-24 50-94 98-61C143-18 73 27 0 0C-41 9-64 64-88 38C-114 7-54-17 0 0Z" fill={red} fillOpacity=".095" stroke={coral} strokeWidth="1.6"/>
      <path d="M0 0C22-3 62-57 79-41C102-17 57 13 0 0C-25 16-44 40-60 24C-77 4-31-10 0 0Z" stroke={coral} strokeDasharray="3 5" opacity=".3"/>
      <path d="M-116 70 116-70" stroke={silver} opacity=".3" strokeDasharray="2 5"/><circle r="4" fill={coral}/><circle r="8" stroke={coral} opacity=".4"/>
    </g>
    <g transform="translate(118 168)">
      <path d="m-36 43 54 12 38-21-53-11Z" fill={panel} stroke={edge}/><path d="m-36 43 0 9 54 13 38-23v-8M18 55v10" stroke={faint}/>
      <path d="M0 31v-57M-25-27l50 8M-36-51l72 12M-28-70l56 9M-19-86l38 6" stroke={silver} strokeWidth="2"/><path d="M0-88v61" stroke={edge} strokeWidth="3"/>
      <path d="m-7 28 14 3v9l-14-3z" stroke={coral} fill={red} fillOpacity=".2"/><path d="M1 43c-4 22 12 24 14 36" stroke={edge}/><path d="M47-65q20 22 10 48M55-72q31 32 14 65" stroke={coral} opacity=".35"/>
    </g>
    <Callout points="152,201 201,235 247,235" x={201} y={248} label="RADIATING ELEMENT"/>
    <text x="365" y="280" fontSize="7" fill={edge} fontFamily="monospace" letterSpacing="1">PATTERN GEOMETRY / SCHEMATIC</text>
  </>;
}
function RfSpectrum() {
  return <>
    <path d="m111 93 317-19 56 27-318 25Z" fill="#1b1e25" stroke={edge}/><path d="m111 93 55 33v119l-55-31Z" fill="#111318" stroke={faint}/><path d="m166 126 318-25v119l-318 25Z" fill={panel} stroke={edge}/>
    <path d="m183 140 205-16v83l-205 17Z" fill="#070b10" stroke="#414c59"/>
    {[0,1,2,3,4].map(i=><path key={i} d={`m190 ${154+i*13} 191-15`} stroke="#27303a" strokeWidth=".55"/>)}
    {[0,1,2,3,4,5,6].map(i=><path key={i} d={`m${200+i*28} ${141-i*2.2}v74`} stroke="#27303a" strokeWidth=".55"/>)}
    <path d="m191 204 19-2 7-9 8 8 26-2 8-10 8 9 11-47 10 46 28-3 7-18 9 16 27-2 20-3" stroke={coral} strokeWidth="1.4"/><path d="m192 207 188-15" stroke={red} opacity=".3" strokeWidth="5"/>
    <g transform="matrix(1 -.075 0 1 411 151)"><circle cx="22" cy="15" r="16" fill="#242931" stroke={silver}/><circle cx="22" cy="15" r="11" stroke={edge}/><path d="M22 4v6" stroke={coral} strokeWidth="2"/>{[0,1,2].map(i=><g key={i}><rect x="0" y={42+i*12} width="12" height="5" rx="1" fill={edge}/><rect x="20" y={42+i*12} width="12" height="5" rx="1" fill={faint}/><rect x="40" y={42+i*12} width="9" height="5" rx="1" fill={faint}/></g>)}</g>
    {[0,1,2,3,4].map(i=><path key={i} d={`m124 ${116+i*13} 24 14`} stroke={faint} strokeWidth="3"/>)}
    <path d="M402 220c0 32 43 27 70 37s40-5 27-24" stroke={edge} strokeWidth="2"/><circle cx="402" cy="220" r="5" fill={ink} stroke={coral}/>
    <Callout points="306,88 326,48 410,48" x={333} y={41} label="RF FRONT END"/>
    <text x="192" y="236" fontSize="6" fill={edge} fontFamily="monospace" transform="rotate(-4 192 236)">ILLUSTRATIVE TRACE / NO MEASURED DATA</text>
  </>;
}
function DirectionFinder() {
  return <>
    <g stroke={faint} opacity=".7">{[60,93,126].map(r=><ellipse key={r} cx="300" cy="192" rx={r*1.5} ry={r*.42}/>)}<path d="M106 192h388M300 138v109" strokeDasharray="3 5"/></g>
    <path d="m226 184 89-26 79 31-90 33Z" fill={panel} stroke={edge}/><path d="m226 184v23l78 32 90-32v-18M304 222v17" fill="#101318" stroke={faint}/><path d="m250 184 59-17 61 24-61 21Z" fill="#292127" stroke="#724149"/>
    {[[239,185],[304,167],[379,190],[306,217]].map(([x,y],i)=><g key={i}><ellipse cx={x} cy={y+1} rx="10" ry="4" fill={ink} stroke={edge}/><path d={`M${x} ${y}v-90`} stroke={silver} strokeWidth="2"/><path d={`M${x} ${y-90}v-13`} stroke={coral} strokeWidth="3"/><ellipse cx={x} cy={y-103} rx="2" ry="1" fill={coral}/></g>)}
    <path d="m295 187 14-4 13 5-13 5z" stroke={coral}/><path d="M277 198v-10l17-5M324 199l19-8v-8" stroke={edge}/>
    <path d="m109 101 110 32M96 128l126 22M134 76l86 45" stroke={coral} opacity=".55" strokeDasharray="5 6"/><path d="m113 77 0 50M91 89q-11 15-5 34M76 77q-23 30-9 58" stroke={coral} opacity=".35"/>
    <Callout points="384,132 427,93 485,93" x={430} y={85} label="COHERENT ARRAY"/><Callout points="348,218 401,249 486,249" x={405} y={261} label="RECEIVER PLATFORM"/>
  </>;
}
function Shielding() {
  return <>
    <path d="m183 82 158-25 101 64-159 33Z" fill="#20242a" stroke={silver}/><path d="m183 82 100 72v17l-100-70Z" fill="#11151b" stroke={edge}/><path d="m283 154 159-33v18l-159 32Z" fill="#14191e" stroke={edge}/><path d="m205 86 129-20 82 52-130 26Z" stroke={edge} strokeDasharray="3 3"/>
    {[[215,87],[333,70],[407,118],[285,140]].map(([x,y],i)=><Screw key={i} x={x} y={y}/>)}
    <path d="m183 179 158-31 101 63-159 36Z" fill="#131b20" stroke={edge}/><path d="m183 179v27l100 71 159-39v-27M283 247v30" fill="#14171c" stroke={edge}/><path d="m200 180 137-24 87 54-139 31Z" fill="#1b272b" stroke="#4b6866"/>
    <path d="m237 186 55-10 37 21-57 13zM342 193l29-6 18 12-29 7z" fill={ink} stroke={silver}/><path d="m250 186 26-5m-20 11 26-5m-16 11 26-5M287 227l30-7 12-17M217 196l28-5M305 166l31 17 32-6" stroke="#67807d"/>
    {[0,1,2,3,4].map(i=><path key={i} d={`m${219+i*8} ${206+i*5} 8-2v8l-8 2Z`} stroke={edge}/>)}
    <path d="M188 112v59M283 176v58M435 147v50" stroke={edge} strokeDasharray="3 5"/>
    <g stroke={coral} opacity=".5">{[0,1,2].map(i=><path key={i} d={`M${85+i*17} 145q15-22 0-43`}/>)}<path d="M90 124h70m-8-5 8 5-8 5"/></g>
    <Callout points="383,80 425,47 487,47" x={428} y={40} label="CONDUCTIVE SHELL"/><Callout points="437,227 466,251 518,251" x={468} y={264} label="GASKET SEAM"/>
  </>;
}
function Rescue() {
  return <>
    <path d="m70 259 34-20 38 7 33-21 44 14 49-10 26 17 49-23 45 8 28-12 40 27 51-11 37 23" stroke={faint}/><path d="m115 253 12-14 20 1 8 13M403 253l15-22 18 7 8 13M87 240l11-18 24 4" fill="#14151b" stroke={faint}/>
    <path d="m188 201 139-20 65 33-142 23Z" fill="#28272c" stroke={edge}/><path d="m166 207 132-19 34 14-7 40-127 22-32-17Z" fill="#0d1015" stroke={edge}/><path d="m276 230 119-18 34 17-7 29-111 20-36-19Z" fill="#0d1015" stroke={edge}/>
    {[0,1,2,3,4].map(i=><g key={i}><ellipse cx={188+i*24} cy={239-i*4} rx="12" ry="15" stroke={edge}/><ellipse cx={301+i*24} cy={252-i*4} rx="10" ry="12" stroke={edge}/><path d={`m${179+i*24} ${221-i*4} 7-1m-7 35 7-1`} stroke={coral} opacity=".5"/></g>)}
    <path d="m208 170 116-21 58 33-115 23Z" fill="#24282f" stroke={silver}/><path d="m208 170v28l59 35 115-22v-29M267 205v28" fill={panel} stroke={edge}/><path d="m224 172 54-10 21 12-54 10Z" fill={ink} stroke={faint}/><path d="m309 166 13-3 11 7-13 2z" fill={red}/>
    <path d="M322 164v-67M318 135l-30-9" stroke={edge} strokeWidth="4"/><path d="m299 81 31-5 22 13-32 7Z" fill={panel} stroke={edge}/><path d="m299 81v18l21 12 32-5V89M320 96v15" fill="#1a2026" stroke={silver}/><ellipse cx="336" cy="99" rx="5" ry="6" fill={ink} stroke={coral}/>
    <path d="m359 86 110-42v119l-112-54" stroke={coral} opacity=".22" fill={red} fillOpacity=".025" strokeDasharray="4 5"/><path d="M239 163v-47m-2 0h4" stroke={silver}/>
    <Callout points="207,179 147,142 94,142" x={78} y={134} label="TRACKED CHASSIS"/>
  </>;
}
function Vision() {
  return <>
    <path d="m111 112 83-25 90 24-84 29Z" fill="#282c33" stroke={edge}/><path d="m111 112v70l89 32 84-31v-72M200 140v74" fill={panel} stroke={edge}/><path d="m123 130 64 22v40l-64-22Z" fill={ink} stroke={faint}/>
    {[0,1].map(i=><g key={i}><path d={`m${139+i*44} ${136+i*15} 18 6v28l-18-6Z`} fill="#242b32" stroke={edge}/><ellipse cx={149+i*44} cy={153+i*15} rx="10" ry="14" fill="#080d13" stroke={silver}/><ellipse cx={149+i*44} cy={153+i*15} rx="5" ry="8" fill="#251b27" stroke={coral}/><ellipse cx={147+i*44} cy={150+i*15} rx="2" ry="3" fill={silver} opacity=".5"/></g>)}
    <path d="m209 154 61-21m-61 35 61-21m-61 35 61-21" stroke={faint}/><path d="m282 143 71-31m-71 62 71 13" stroke={coral} opacity=".35" strokeDasharray="4 5"/>
    <rect x="355" y="78" width="153" height="153" rx="3" fill="#0d1117" stroke={edge}/><path d="M367 91h129v127H367Z" stroke={faint}/><path d="m376 196 33-71 32 3 27 65Z" fill="#222931" stroke={edge}/><path d="m409 125 18 43 14-40m-14 40-51 28m51-28 41 25" stroke="#4b5867"/>
    <path d="M391 117h-13v13m63-13h13v13m-76 60v13h13m63-13v13h-13" stroke={coral} strokeWidth="1.5"/>
    {[[409,125],[427,168],[389,181],[451,181],[440,142],[403,152],[467,193]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="2" fill={coral}/><path d={`M${x-4} ${y}h8M${x} ${y-4}v8`} stroke={coral} opacity=".35"/></g>)}
    <Callout points="176,108 196,63 269,63" x={201} y={56} label="STEREO OPTICS"/><text x="367" y="245" fill={edge} fontSize="7" fontFamily="monospace" letterSpacing="1">FEATURE GEOMETRY / CONCEPT</text>
  </>;
}
function ArDisplay() {
  return <>
    <path d="m141 173 11-57 108-52 6 11-97 53-5 35M416 174l50-91 19 3-45 92" fill="#171b23" stroke={edge}/>
    <path d="m147 155 114 12 20 20 17 1 19-16 128 11-19 65-110-12-15-24-20-2-17 18-99-10Z" fill="#131820" stroke={silver} strokeWidth="1.4"/>
    <path d="m163 167 86 10 17 16-17 24-79-9Z" fill="#17202a" fillOpacity=".7" stroke={edge}/><path d="m326 184 100 9-13 43-89-10-13-23Z" fill="#19212a" fillOpacity=".7" stroke={edge}/>
    <path d="m166 173 80 9 12 12-13 17-71-8M335 191l80 8-8 31-78-10" stroke="#d5dbe5" opacity=".14"/><path d="m324 203 72 7m-34-21-4 40M339 198l-7-1v15l7 1m53-7 7 1v15l-7-1" stroke={coral} opacity=".75"/><path d="m197 179 26 3m-28 6 44 5m-46 4 30 3" stroke={coral} opacity=".4"/>
    <path d="m349 93 50 6 15 64-65-7Z" fill={red} fillOpacity=".025" stroke={coral} strokeDasharray="3 5" opacity=".45"/><path d="m367 100 5 53m-23-40 53 7m-52 10 56 7" stroke={coral} opacity=".15"/><path d="m419 181 9-20 14 4-5 20" fill={red} fillOpacity=".15" stroke={coral}/>
    <Callout points="430,165 461,126 519,126" x={460} y={119} label="MICRODISPLAY"/><Callout points="335,221 358,265 455,265" x={361} y={278} label="BEAM-SPLITTER COMBINER"/>
  </>;
}
function NightVision() {
  return <>
    <path d="m194 111 97-31 75 33-92 34Z" fill="#242830" stroke={edge}/><path d="m194 111 80 36v73l-80-38Z" fill={panel} stroke={edge}/><path d="m274 147 92-34v71l-92 36Z" fill="#1b2028" stroke={silver}/><path d="m252 92 30-24 38 17-27 25" fill={panel} stroke={edge}/>
    <path d="m207 148-67 23v43l67-23" fill="#242730" stroke={edge}/><ellipse cx="140" cy="193" rx="24" ry="32" fill="#0b1017" stroke={silver}/><ellipse cx="140" cy="193" rx="18" ry="25" fill="#252431" stroke="#748392"/><ellipse cx="140" cy="193" rx="11" ry="17" fill="#111924" stroke={coral} opacity=".75"/><ellipse cx="135" cy="185" rx="4" ry="7" fill="#cedce4" opacity=".24"/><path d="m165 174 40-14m-40 27 40-14m-40 27 40-14" stroke={faint}/>
    <path d="m343 133 82-27 11 9v84l-81 29-12-10Z" fill="#171c24" stroke={silver}/><path d="m355 141 69-23v73l-69 24Z" fill="#091411" stroke={edge}/><path d="m362 189 13-21 14 3 12-26 17 25m-56 26 55-18" stroke="#6a9489" opacity=".75"/><path d="m362 148 13-4m36-12 7-2v10m-55 61 8-3" stroke={coral} opacity=".65"/>
    <path d="m212 127 14 6v15l-14-6Z" fill={red} fillOpacity=".3" stroke={coral}/><path d="m290 92 18 8m-33-3 18 8" stroke={edge}/>
    <Callout points="158,223 187,258 288,258" x={191} y={271} label="SINGLE OBJECTIVE"/><Callout points="319,97 371,61 465,61" x={378} y={53} label="LOW-LIGHT CAMERA"/><Callout points="429,169 470,213 526,213" x={468} y={226} label="VIEWING DISPLAY"/>
  </>;
}
function Kinematics() {
  return <>
    <path d="m147 242 91-24 90 28-96 31Z" fill={panel} stroke={edge}/><path d="m147 242v13l85 32 96-28v-13M232 277v10" stroke={faint}/><ellipse cx="234" cy="236" rx="31" ry="11" fill="#26272e" stroke={silver}/><path d="M203 236v-22m62 22v-22" stroke={edge}/><ellipse cx="234" cy="214" rx="31" ry="11" fill={panel} stroke={edge}/>
    <path d="m223 211 13-88 21-1 5 20-18 73Z" fill="#232932" stroke={silver}/><path d="m247 126 91-51 22 20-18 21-82 33Z" fill="#20252d" stroke={silver}/><path d="m354 91 51 70-11 20-18-8-37-60Z" fill="#27252b" stroke={edge}/><path d="m245 142 90-48M234 207l10-48M355 113l31 52" stroke={coral} strokeWidth="2"/>
    {[[244,138,16],[349,98,17],[392,170,11]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r={r} fill="#11161d" stroke={silver}/><circle cx={x} cy={y} r={r*.5} stroke={coral}/><circle cx={x} cy={y} r="2" fill={silver}/></g>)}
    <path d="m397 179 13 18-8 12m4-19 19-1 9 13M402 209l-5 3m37-10 2 6" stroke={silver} strokeWidth="3"/><path d="M163 205C155 103 291 29 406 91S480 200 447 235" stroke={coral} opacity=".27" strokeDasharray="4 6"/><path d="M255 199a46 46 0 0 0 35-35M290 164l-2 8m2-8-8 3" stroke={coral} opacity=".55"/>
    <Callout points="351,75 383,48 471,48" x={387} y={40} label="ARTICULATED LINKAGE"/><Axis/>
  </>;
}
function Drone() {
  return <>
    <g stroke={faint} strokeDasharray="4 7"><ellipse cx="297" cy="226" rx="169" ry="43"/><path d="M104 226h386"/></g>
    <path d="m206 110 199 97M407 101 204 212" stroke="#222831" strokeWidth="15"/><path d="m206 110 199 97M407 101 204 212" stroke={edge} strokeWidth="1.4"/>
    <path d="m261 147 53-19 39 22-52 22Z" fill="#2b292f" stroke={silver}/><path d="m261 147v20l40 24 52-21v-20M301 172v19" fill={panel} stroke={edge}/><path d="m280 145 30-9 26 14-32 10Z" fill={red} fillOpacity=".25" stroke={coral}/>
    <path d="m274 177-5 45 13 5m51-50 6 37 12 4" stroke={edge} strokeWidth="2"/><path d="M301 188v15" stroke={silver} strokeWidth="3"/><rect x="289" y="202" width="25" height="17" rx="4" fill={panel} stroke={edge}/><circle cx="302" cy="211" r="5" fill={ink} stroke={coral}/>
    {[[206,110],[407,101],[204,212],[405,207]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><ellipse rx="70" ry="25" stroke={edge} opacity=".35"/><ellipse rx="57" ry="19" stroke={coral} strokeDasharray="2 7" opacity=".3"/><path d="M-52-5C-23-17-6-10 0-2C16-7 35-2 52 5C18 16 8 10 0 2C-15 5-35 3-52-5Z" fill="#22262e" stroke={edge}/><path d="M-8 0v11c5 5 12 4 16 0V0" fill={panel} stroke={edge}/><ellipse rx="8" ry="4" fill="#232a32" stroke={silver}/><circle r="2" fill={i<2?coral:silver}/></g>)}
    <Callout points="326,131 338,63 395,63" x={344} y={56} label="FLIGHT CONTROLLER"/>
  </>;
}
function WirelessPower() {
  return <>
    <path d="m156 99 142-51 151 48-144 54Z" fill="#121a23" fillOpacity=".7" stroke={edge}/><path d="m156 99v8l149 53 144-54v-10M305 150v10" stroke={faint}/><path d="m156 217 142-51 151 48-144 54Z" fill="#171922" stroke={edge}/><path d="m156 217v10l149 53 144-56v-10M305 268v12" fill="#11151c" stroke={faint}/>
    {[0,1,2,3,4,5].map(i=><g key={i}><ellipse cx="302" cy="100" rx={32+i*12} ry={12+i*4.2} stroke={i===5?coral:edge} strokeWidth="1.5"/><ellipse cx="302" cy="219" rx={32+i*12} ry={12+i*4.2} stroke={coral} strokeWidth="1.8" opacity={.9-i*.075}/></g>)}
    {[0,1,2,3].map(i=><path key={i} d={`M${223+i*22} 121C${202+i*21} 146 ${203+i*21} 174 ${224+i*22} 196M${380-i*22} 121C${401-i*21} 146 ${400-i*21} 174 ${379-i*22} 196`} stroke={coral} opacity={.12+i*.055} strokeDasharray="3 5"/>)}
    <path d="M302 138v46m-4-6 4 6 4-6" stroke={coral} opacity=".7"/><path d="M213 234c-37 7-79 31-72 42M210 105l-39-8-38 11" stroke={edge} strokeWidth="2"/>
    <Callout points="445,99 471,73 527,73" x={467} y={65} label="RECEIVER COIL"/><Callout points="440,220 464,249 532,249" x={466} y={262} label="TRANSMITTER"/>
  </>;
}
function WindTunnel() {
  return <>
    <path d="m88 91 61-26 79 33-2 117-77 38-61-31Z" fill="#10151b" stroke={edge}/><path d="m88 91 61 27 79-20M149 118v135" stroke={edge}/><path d="m99 110 40 18v105l-40-19Z" stroke={faint}/>
    {[0,1,2,3,4].map(i=><path key={i} d={`m${105+i*7} ${114+i*3}v105M100 ${132+i*18}l37 16`} stroke={faint} strokeWidth=".6"/>)}
    <path d="m228 98 56 22 127-4 96-34 39 20v113l-39 23-97-37-127 5-57 9Z" fill="#1b222c" fillOpacity=".24" stroke={edge}/><path d="M284 120v86M411 116v85M507 82v156M284 120l29 17 123-3 110-32M313 137v81M436 134v78" stroke={faint}/>
    <path d="m314 168 35-22 47 16-47 3Z" fill="#51515b" stroke={silver}/><path d="m314 168 34 2 47-8" stroke={coral}/><path d="M349 167v62m-17 5 35-1" stroke={edge} strokeWidth="2"/>
    {[0,1,2,3].map(i=><path key={i} d={`M181 ${125+i*20}C238 ${131+i*15} 282 ${130+i*17} 315 ${132+i*18}S376 ${129+i*17} 423 ${130+i*18} 487 ${110+i*27} 521 ${109+i*28}`} stroke={coral} strokeWidth=".9" opacity=".4"/>)}
    <path d="m219 227-4 33m195-51 6 39m92-10 8 31" stroke={edge} strokeWidth="3"/><Callout points="355,144 378,74 452,74" x={382} y={66} label="AIRFOIL TEST SECTION"/>
  </>;
}
function Composite() {
  return <>
    {[0,1,2,3,4].map(i=><g key={i} transform={`translate(0 ${i*17})`}><path d="m159 122 160-68 133 63-163 72Z" fill={i===2?'#311e27':i%2?'#11171e':'#202630'} stroke={i===2?coral:edge}/><path d="m159 122v5l130 66 163-72v-4M289 189v4" fill={ink} stroke={faint}/>{Array.from({length:8},(_,j)=><path key={j} d={i%2?`m${175+j*17} ${115-j*7.3} 113 58`:`m${178+j*16} ${131+j*8.1} 150-65`} stroke={i===2?red:faint} opacity=".7" strokeWidth="1"/>)}</g>)}
    <path d="M163 137v39M450 132v39M289 198v36" stroke={silver} strokeDasharray="2 4" opacity=".5"/><path d="M111 109v148m-6-143 6-5 6 5m-12 137 6 6 6-6" stroke={coral} opacity=".6"/>
    <Callout points="389,87 426,58 504,58" x={429} y={50} label="FIBRE ORIENTATION"/><Callout points="449,155 480,173 532,173" x={478} y={186} label="LAMINATE STACK"/><Axis x={490} y={259}/>
  </>;
}
function Magnetic() {
  return <>
    <path d="m100 239 221-41 178 55-221 45Z" fill="#11161a" fillOpacity=".55" stroke={faint} strokeDasharray="3 5"/>
    {[0,1,2,3].map(i=><path key={i} d={`M${129+i*24} ${248+i*8}C230 ${224+i*4} 261 ${247-i*9} 292 ${242-i*9}S347 ${215+i*5} ${451+i*8} ${250+i*8}`} stroke={coral} opacity={.12+i*.05}/>)}
    <path d="m142 174 286-55 17 9-286 57Z" fill="#293039" stroke={silver}/><path d="m142 174v9l17 10 286-57v-8M159 185v8" fill={panel} stroke={edge}/>
    {[[151,154],[397,106]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="m0 0 25-5 21 10-25 6Z" fill="#33323a" stroke={silver}/><path d="M0 0v37l21 12 25-11V5M21 11v38" fill={panel} stroke={edge}/><path d="m6 18 10 5v11l-10-5Z" fill={red} fillOpacity=".2" stroke={coral}/><path d="M12 49v32" stroke={edge} strokeDasharray="3 4"/></g>)}
    <path d="M289 153v-52l-15-13" stroke={edge} strokeWidth="5"/><path d="m244 64 55-12 38 23-55 14Z" fill="#242a33" stroke={silver}/><path d="m244 64v29l38 23 55-13V75M282 89v27" fill={panel} stroke={edge}/><path d="m253 66 42-9 26 16-41 10Z" fill="#0a1415" stroke={faint}/><path d="m261 69 9 1 8-6 8 4 10-5 14 7" stroke={coral} opacity=".8"/>
    <path d="M172 180c45 16 55-53 107-29M424 136c-33 35-72 4-125 18" stroke={coral} opacity=".5"/>
    <Callout points="156,160 114,116 68,116" x={65} y={108} label="SENSOR A"/><Callout points="426,111 460,84 519,84" x={462} y={76} label="SENSOR B"/>
    <Callout points="318,155 357,204 458,204" x={361} y={216} label="NONMAGNETIC BOOM"/>
  </>;
}
function Signals() {
  return <>
    <path d="m129 143 217-52 135 81-220 63Z" fill="#182326" stroke={edge}/><path d="m129 143v9l132 93 220-65v-8M261 235v10" fill="#0e161a" stroke={faint}/><path d="m212 159 69-18 48 29-70 19Z" fill="#080c12" stroke={silver}/><path d="m231 160 43-11 33 19-44 12Z" stroke={faint}/>
    {[0,1,2,3,4].map(i=><g key={i}><path d={`m${219+i*10} ${150-i*2.5} -8-5`} stroke={edge}/><path d={`m${270+i*10} ${192-i*2.6} 7 5`} stroke={edge}/></g>)}
    <path d="m153 151 16-4 47 31-10 18 30 20m53-96 23 13 39-10 21 13m-58 54 29-8 31 19 49-14m-105-22 50-13 33 20" stroke="#527073" strokeWidth="1"/><path d="m164 167 26-6 9 7-26 6Zm168-39 24-6 13 8-24 6Zm30 48 31-8 14 9-30 9Z" fill={panel} stroke={edge}/>
    {[[146,145],[343,104],[463,173],[261,223]].map(([x,y],i)=><Screw key={i} x={x} y={y} r={4}/>)}
    <g transform="translate(372 140)"><path d="m0 0 26-7 24 15-25 7Z" fill="#373a42" stroke={silver}/><path d="M0 0v14l25 16 25-8V8M25 15v15" fill={panel} stroke={edge}/><path d="m30 18 14-4v4l-14 4Z" fill={ink}/></g>
    <path d="m184 87 49-12 22 15-49 13Z" fill="#1c232b" stroke={edge}/><path d="m184 87v24l22 15 49-14V90M206 103v23" fill={panel} stroke={edge}/><path d="M198 112c-41 12-86-14-112 9s-7 48 41 49M237 118c-2 13-20 17-28 23" stroke={coral} strokeWidth="1.5"/>
    <path d="m433 91 10-21 9 35 11-43 10 32h39" stroke={coral} opacity=".55"/><text x="428" y="121" fontSize="6.5" fill={edge} fontFamily="monospace" letterSpacing=".8">SIGNAL PATH / SCHEMATIC</text>
    <Callout points="280,172 319,250 421,250" x={326} y={263} label="ACQUISITION PROCESSOR"/>
  </>;
}
const illustrations: Record<string, () => ReactNode> = {
  polar: AntennaPolar, 'rf-spectrum': RfSpectrum, 'direction-finder': DirectionFinder, shielding: Shielding, rescue: Rescue, vision: Vision, 'ar-display': ArDisplay, 'night-vision': NightVision, kinematics: Kinematics, drone: Drone, 'wireless-power': WirelessPower, 'wind-tunnel': WindTunnel, composite: Composite, magnetic: Magnetic, signals: Signals,
};
/** Static original SVG concepts. No client boundary, external assets, or measured results. */
export function ProjectVisual({ art = 'signals', className = '' }: ProjectVisualProps) {
  const Illustration = illustrations[art] ?? Signals;
  return (
    <div className={`relative isolate overflow-hidden bg-[#080a0d] ${className}`} aria-hidden="true" data-project-visual={art}>
      <div className="pointer-events-none absolute inset-0 opacity-[.23] [background-image:linear-gradient(#78879818_1px,transparent_1px),linear-gradient(90deg,#78879818_1px,transparent_1px)] [background-size:28px_28px]"/>
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_55%_46%,#2d172839,transparent_67%)]"/>
      <svg viewBox="0 0 600 320" fill="none" className="relative h-full min-h-48 w-full" focusable="false">
        <g strokeLinecap="round" strokeLinejoin="round"><Illustration/></g>
        <path d="M24 54V24h30M546 24h30v30M24 266v30h30M546 296h30v-30" stroke="#667381" strokeOpacity=".16" strokeWidth=".8"/><circle cx="35" cy="37" r="2" fill={red}/>
        <text x="47" y="40" fill="#8a939f" fontFamily="monospace" fontSize="7.5" letterSpacing="1.6">{(disciplines[art] ?? 'Engineering systems').toUpperCase()}</text>
      </svg>
      <span className="absolute bottom-3 left-5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-zinc-500 sm:bottom-4 sm:text-[9px]"><span className="h-px w-4 bg-red-500/50"/>Concept visualization</span>
    </div>
  );
}
