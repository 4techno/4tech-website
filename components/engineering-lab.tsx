'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, createScope, stagger } from 'animejs';
import { useMotionPreferences } from './motion-preferences';

const disciplines = [
  { title: 'Integrated systems', subtitle: 'Every connection counts.', copy: 'Hardware, firmware and mechanical design developed together. From sensor input to a considered response.', tags: ['Embedded systems', 'Robotics', 'Automation'], detail: 'A conceptual signal path: sense, process, act.', nodes: ['SENSE', 'PROCESS', 'ACT'] },
  { title: 'Prototype engineering', subtitle: 'Make the idea testable.', copy: 'Clear requirements, component selection and iterative builds. Turn uncertainty into practical engineering decisions.', tags: ['Electronics', 'Mechanical integration', 'Firmware'], detail: 'A conceptual development path: define, build, test.', nodes: ['DEFINE', 'BUILD', 'TEST'] },
  { title: 'Research & development', subtitle: 'Follow the evidence.', copy: 'Investigate RF systems, machine vision and experimental methods. Measure what matters, document what you learn.', tags: ['RF technology', 'Computer vision', 'Experimental R&D'], detail: 'A conceptual research path: model, measure, refine.', nodes: ['MODEL', 'MEASURE', 'REFINE'] },
];

export default function EngineeringLab() {
  const [selected, setSelected] = useState(0);
  const [pulse, setPulse] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const { paused, reduced } = useMotionPreferences();
  const discipline = disciplines[selected];
  useEffect(() => {
    if (paused || reduced) return;
    const scope = createScope({ root: host }).add(() => {
      animate('.lab-node', { scale: [.88, 1], opacity: [.5, 1], delay: stagger(100), duration: 650, ease: 'out(4)' });
      animate('.lab-trace', { strokeDashoffset: [560, 0], delay: stagger(90), duration: 1400, ease: 'inOut(3)' });
      animate('.lab-flow', { translateX: [-180, 180], opacity: [0, 1, 0], delay: stagger(140), duration: 1600, ease: 'inOut(3)' });
    });
    return () => scope.revert();
  }, [selected, pulse, paused, reduced]);
  return <div className="engineering-lab" ref={host}>
    <div className="lab-selector" role="group" aria-label="Engineering disciplines">
      {disciplines.map((item, index) => <button type="button" key={item.title} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>{item.title}</span></button>)}
    </div>
    <div className="lab-stage">
      <div className="lab-diagram">
        <svg viewBox="0 0 640 330" aria-hidden="true" fill="none">
          <g stroke="#ffffff0e"><circle cx="320" cy="155" r="123"/><circle cx="320" cy="155" r="97" strokeDasharray="2 7"/></g>
          <g stroke="#766153" strokeWidth="1"><path d="M115 155H525"/><path d="M115 155V83H320V155H525"/><path d="M115 155V228H320V155H525"/></g>
          <g className="lab-trace" stroke="#ed493b" strokeWidth="2" strokeDasharray="560"><path d="M115 155V83H320V155H525"/><path d="M115 155V228H320V155H525"/></g>
          {[115, 320, 525].map((x, i) => <g key={x} className="lab-node" style={{ transformOrigin: `${x}px 155px` }}>
            <rect x={x - 34} y="121" width="68" height="68" rx={i === 1 ? 8 : 34} fill="#181715" stroke={i === 1 ? '#ed493b' : '#766153'}/>
            {i === 0 ? <><circle cx={x} cy="155" r="13" stroke="#f1ddd0"/><circle cx={x} cy="155" r="4" fill="#ed493b"/></> : i === 1 ? <><rect x={x - 13} y="142" width="26" height="26" rx="3" stroke="#f1ddd0"/>{[-7,0,7].map(offset => <path key={offset} d={`M${x+offset} 138v-6m0 40v6M${x-17} ${155+offset}h-6m40 0h6`} stroke="#ed493b"/>)}</> : <path d={`M${x-11} 155l8 8 17-18`} stroke="#f1ddd0" strokeWidth="2"/>}
            <text x={x} y="275" fill="#b6b1aa" textAnchor="middle" fontSize="11" fontFamily="monospace" letterSpacing="1.5">{discipline.nodes[i]}</text>
          </g>)}
          <circle className="lab-flow" cx="320" cy="155" r="3" fill="#ffd7bd"/>
        </svg>
        <div className="lab-replay"><span>{discipline.detail}</span><button type="button" onClick={() => setPulse(v => v + 1)} disabled={paused || reduced}>Replay <span aria-hidden="true">↻</span></button></div>
      </div>
      <div className="lab-copy" aria-live="polite"><h3>{discipline.subtitle}</h3><p>{discipline.copy}</p><ul>{discipline.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
    </div>
  </div>;
}
