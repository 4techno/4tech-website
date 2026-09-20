'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreferences } from './motion-preferences';

const stages = [
  { name: 'Discover', title: 'Start with the right question.', description: 'Understand what the system needs to do, where it will operate, and what success should look like.', outputs: ['Use case & constraints', 'Feasibility discussion', 'A clear project brief'], signal: 'REQUIREMENTS → DIRECTION', nodes: ['THE QUESTION', 'CONSTRAINTS', 'PROJECT BRIEF'] },
  { name: 'Architect', title: 'See the complete system.', description: 'Connect hardware, firmware and mechanics in one considered architecture. Define interfaces before adding complexity.', outputs: ['System architecture', 'Component selection', 'Milestones & interfaces'], signal: 'HARDWARE + SOFTWARE + MECHANICS', nodes: ['HARDWARE', 'FIRMWARE', 'MECHANICS'] },
  { name: 'Prototype', title: 'Bring the design into the real world.', description: 'Build in focused iterations. Integrate the subsystems, observe their behaviour and refine the details that matter.', outputs: ['Integrated prototype', 'Firmware & CAD iterations', 'Documented observations'], signal: 'DESIGN → BUILD → ITERATE', nodes: ['DESIGN', 'INTEGRATION', 'PROTOTYPE'] },
  { name: 'Validate', title: 'Let the evidence guide the next step.', description: 'Compare observed behaviour with the agreed requirements. Document limitations, findings and the next engineering decisions.', outputs: ['Test observations', 'Technical documentation', 'Next-step recommendations'], signal: 'MEASURE → UNDERSTAND → REFINE', nodes: ['REQUIREMENTS', 'OBSERVATIONS', 'NEXT STEPS'] },
];

export default function EngineeringMethod() {
  const [selected, setSelected] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  const { reduced, paused } = useMotionPreferences();
  const stage = stages[selected];
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % stages.length;
    else if (event.key === 'ArrowLeft') next = (index + stages.length - 1) % stages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stages.length - 1;
    else return;
    event.preventDefault(); setInteracted(true); setSelected(next); controls.current[next]?.focus();
  };
  return <div className="method-console">
    <div className="method-tabs" role="tablist" aria-label="Our engineering process">
      {stages.map((item, index) => <button key={item.name} ref={node => { controls.current[index] = node; }} type="button" role="tab" id={`method-tab-${index}`} aria-selected={selected === index} aria-controls="method-panel" tabIndex={selected === index ? 0 : -1} onClick={() => { setInteracted(true); setSelected(index); }} onKeyDown={event => onKey(event, index)}><span>0{index + 1}</span>{item.name}<i aria-hidden="true" /></button>)}
    </div>
    <div id="method-panel" role="tabpanel" aria-labelledby={`method-tab-${selected}`} tabIndex={0} className="method-panel">
      <div className="method-copy"><span className="section-kicker">THE 4TECH APPROACH / 0{selected + 1}</span><motion.div key={selected} initial={!interacted || reduced || paused ? false : { opacity: 0, y: 8, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reduced || paused ? 0 : .38 }}><h3>{stage.title}</h3><p>{stage.description}</p><ul>{stage.outputs.map(output => <li key={output}><span aria-hidden="true">↳</span>{output}</li>)}</ul></motion.div></div>
      <div className="method-visual" aria-hidden="true" data-stage={selected}>
        <div className="method-visual-grid" />
        <svg viewBox="0 0 540 330" fill="none">
          <defs><linearGradient id="method-trace"><stop stopColor="#ff405f" stopOpacity=".15"/><stop offset=".5" stopColor="#ffa0b1"/><stop offset="1" stopColor="#ff405f" stopOpacity=".15"/></linearGradient><radialGradient id="method-aura"><stop stopColor="#ff3b55" stopOpacity=".13"/><stop offset="1" stopColor="#ff3b55" stopOpacity="0"/></radialGradient></defs>
          <circle cx="270" cy="160" r="148" fill="url(#method-aura)"/>
          <g stroke="#ffffff12"><circle cx="270" cy="160" r="126" strokeDasharray="2 7"/><circle cx="270" cy="160" r="93"/><path d="M20 160h500M270 10v300"/></g>
          {['M91 70h70q25 0 25 25v40q0 25 25 25h21','M91 250h70q25 0 25-25v-40q0-25 25-25h21','M308 160h31q25 0 25-25v-40q0-25 25-25h60','M308 160h31q25 0 25 25v40q0 25 25 25h60'].map((path, index) => <g key={path}><path d={path} stroke="#ffffff20"/><motion.path key={`${selected}-${index}`} d={path} stroke="url(#method-trace)" strokeWidth="1.5" initial={false} animate={reduced || paused ? { pathLength: 1, opacity: .8 } : { pathLength: [0, 1], opacity: [.25, 1] }} transition={{ duration: 1.3, delay: index * .1, ease: 'easeInOut' }}/></g>)}
          <rect x="232" y="122" width="76" height="76" rx="16" fill="#0d0d10" stroke="#fb6f8970"/><rect x="241" y="131" width="58" height="58" rx="10" fill="#ff3b5509" stroke="#ff728229"/>
          <text x="270" y="170" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="29" fontWeight="700" fill="#f5f5f7">4<tspan fill="#ff647e">.</tspan></text>
          {[[91,70],[91,250],[449,70],[449,250]].map(([x,y], index) => <g key={index}><circle cx={x} cy={y} r="17" fill="#0c0c0f" stroke="#ffffff25"/><circle cx={x} cy={y} r="4" fill={selected >= index ? '#fc6c85' : '#65656f'}/></g>)}
          <g fill="#9d9da7" fontFamily="monospace" fontSize="8" letterSpacing="1.2"><text x="91" y="40" textAnchor="middle">{stage.nodes[0]}</text><text x="449" y="40" textAnchor="middle">{stage.nodes[1]}</text><text x="270" y="280" textAnchor="middle">{stage.nodes[2]}</text></g>
        </svg>
        <div className="method-signal"><span />{stage.signal}</div>
      </div>
    </div>
    <div className="method-note"><span>THOUGHTFUL AT EVERY STAGE.</span><span>Scope and deliverables agreed for each project.</span></div>
  </div>;
}
