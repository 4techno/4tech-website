'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { asciiModels, asciiSets, renderAsciiModel } from './ascii-engine';
import styles from './AsciiMotionLab.module.css';

const W=64,H=25;
type Mode = number | 'cam';

export default function AsciiMotionLab() {
  const [mode,setMode]=useState<Mode>(0), [setIndex,setSetIndex]=useState(0), [paused,setPaused]=useState(false);
  const [text,setText]=useState(() => renderAsciiModel(0,0,.35,.2,asciiSets[0].glyphs,W,H));
  const [fps,setFps]=useState(0), [yaw,setYaw]=useState(.35), [pitch,setPitch]=useState(.2);
  const [reticle,setReticle]=useState<{x:number;y:number;row:number;column:number}|null>(null);
  const [facing,setFacing]=useState<'user'|'environment'>('user'), [contrast,setContrast]=useState(1), [invert,setInvert]=useState(false);
  const [cameraState,setCameraState]=useState<'off'|'starting'|'live'|'error'>('off'), [cameraError,setCameraError]=useState('');
  const video=useRef<HTMLVideoElement>(null), canvas=useRef<HTMLCanvasElement>(null), stream=useRef<MediaStream|null>(null);
  const cameraRequest=useRef(0);
  const stage=useRef<HTMLDivElement>(null), drag=useRef<{id:number;x:number;y:number}|null>(null), visible=useRef(true), raf=useRef(0);
  const reduced=useRef(false);

  useEffect(() => {
    const media=window.matchMedia('(prefers-reduced-motion: reduce)'); reduced.current=media.matches;
    const onChange=()=>{reduced.current=media.matches; setPaused(media.matches);};
    media.addEventListener('change',onChange);
    const observer=new IntersectionObserver(entries=>{visible.current=entries[0]?.isIntersecting ?? false;},{threshold:.05});
    if(stage.current)observer.observe(stage.current);
    return()=>{media.removeEventListener('change',onChange);observer.disconnect();};
  },[]);

  useEffect(() => {
    if(mode==='cam')return;
    let previous=0,frames=0,second=performance.now();
    const draw=(now:number)=>{
      raf.current=requestAnimationFrame(draw);
      if(paused||document.hidden||!visible.current||now-previous<1000/25)return;
      previous=now; frames++;
      if(now-second>=1000){setFps(frames);frames=0;second=now;}
      setText(renderAsciiModel(mode,now,yaw,pitch,asciiSets[setIndex].glyphs,W,H));
    };
    raf.current=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(raf.current);
  },[mode,paused,yaw,pitch,setIndex]);

  function stopCamera(){
    cameraRequest.current++;
    stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;
    if(video.current){video.current.pause();video.current.srcObject=null;}
    setCameraState('off');setFps(0);
  }
  async function startCamera(nextFacing=facing){
    stopCamera();setCameraError('');setCameraState('starting');
    const request=cameraRequest.current;
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera access requires HTTPS and a supported browser.');
      const acquired=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:nextFacing},width:{ideal:320},height:{ideal:240}}});
      if(request!==cameraRequest.current||!video.current||mode!=='cam'){acquired.getTracks().forEach(track=>track.stop());return;}
      stream.current=acquired;video.current.srcObject=acquired;await video.current.play();
      if(request!==cameraRequest.current){acquired.getTracks().forEach(track=>track.stop());return;}
      setCameraState('live');
    }catch(error){
      if(request!==cameraRequest.current)return;
      stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;
      setCameraError(error instanceof Error?error.message:'Camera permission was unavailable.');setCameraState('error');
    }
  }
  useEffect(()=>{
    if(mode!=='cam'){stopCamera();return;}
    let previous=0,frames=0,second=performance.now();
    const draw=(now:number)=>{
      raf.current=requestAnimationFrame(draw);
      if(paused||document.hidden||!visible.current||cameraState!=='live'||!video.current||video.current.readyState<2||now-previous<1000/18)return;
      previous=now;frames++;if(now-second>=1000){setFps(frames);frames=0;second=now;}
      const ctx=canvas.current?.getContext('2d',{willReadFrequently:true});if(!ctx)return;
      ctx.save();if(facing==='user'){ctx.translate(W,0);ctx.scale(-1,1);}ctx.drawImage(video.current,0,0,W,H);ctx.restore();
      const pixels=ctx.getImageData(0,0,W,H).data,chars=asciiSets[setIndex].glyphs;
      const rows:string[]=[];
      for(let y=0;y<H;y++){let row='';for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        let luma=(.299*pixels[i]+.587*pixels[i+1]+.114*pixels[i+2])/255;
        luma=Math.max(0,Math.min(1,(luma-.5)*contrast+.5));if(invert)luma=1-luma;
        row+=chars[Math.min(chars.length-1,Math.floor(luma*(chars.length-1)))];
      }rows.push(row);}setText(rows.join('\n'));
    };
    raf.current=requestAnimationFrame(draw);
    const hide=()=>{if(document.hidden)stopCamera();};document.addEventListener('visibilitychange',hide);
    return()=>{cancelAnimationFrame(raf.current);document.removeEventListener('visibilitychange',hide);};
  },[mode,paused,cameraState,facing,contrast,invert,setIndex]);
  useEffect(()=>()=>{cameraRequest.current++;stream.current?.getTracks().forEach(track=>track.stop());},[]);

  function selectMode(next:Mode){if(mode==='cam'&&next!=='cam')stopCamera();setMode(next);setPaused(false);if(next==='cam')setText(Array(H).fill(' '.repeat(W)).join('\n'));}
  function pointerPosition(event:PointerEvent<HTMLDivElement>){
    const rect=event.currentTarget.getBoundingClientRect(),x=Math.max(0,Math.min(rect.width,event.clientX-rect.left)),y=Math.max(0,Math.min(rect.height,event.clientY-rect.top));
    if(event.pointerType==='mouse')setReticle({x,y,row:Math.min(H,Math.floor(y/rect.height*H)+1),column:Math.min(W,Math.floor(x/rect.width*W)+1)});
    if(drag.current?.id===event.pointerId&&mode!=='cam'){
      setYaw(value=>value+(x-drag.current!.x)*.012);setPitch(value=>Math.max(-1.2,Math.min(1.2,value+(y-drag.current!.y)*.01)));
      drag.current={id:event.pointerId,x,y};
    }
  }

  return <section className={styles.section} aria-labelledby="ascii-title">
    <div className={styles.heading}><p>[ 04 / COMPUTATIONAL MOTION ]</p><h2 id="ascii-title">Engineering in motion.<br/><em>Every character counts.</em></h2><span>Orbit eight character-space engineering models or translate a live camera feed into ASCII. All camera frames remain on this device.</span></div>
    <div className={styles.terminal}>
      <div className={styles.titlebar}><span aria-hidden="true">[●] [▲] [■]</span><strong>4TECH / MOTION TERMINAL</strong><span>{mode==='cam'?'[09/CAM]':'['+asciiModels[mode].code+']'}</span></div>
      <div className={styles.prompt}>guest@4tech:~$ ./render_kinematics --mode={mode==='cam'?'camera':asciiModels[mode].code.toLowerCase()}</div>
      <div className={styles.tabs} role="tablist" aria-label="Engineering models">
        {asciiModels.map((model,index)=><button key={model.code} type="button" role="tab" aria-selected={mode===index} className={mode===index?styles.active:''} onClick={()=>selectMode(index)}>[{model.code}] {model.label}</button>)}
        <button type="button" role="tab" aria-selected={mode==='cam'} className={mode==='cam'?styles.active:''} onClick={()=>selectMode('cam')}>[09/CAM] Live camera</button>
      </div>
      <div className={styles.stage} ref={stage} onPointerDown={event=>{if(mode==='cam')return;const rect=event.currentTarget.getBoundingClientRect();drag.current={id:event.pointerId,x:event.clientX-rect.left,y:event.clientY-rect.top};event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={pointerPosition} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} onPointerLeave={()=>{if(!drag.current)setReticle(null);}}>
        <pre aria-hidden="true">{text}</pre>
        {mode==='cam'&&cameraState!=='live'&&<div className={styles.cameraOverlay}><p>{cameraState==='error'?cameraError:'Camera remains off until you start it.'}</p><button type="button" disabled={cameraState==='starting'} onClick={()=>void startCamera()}>{cameraState==='starting'?'[ STARTING ]':'[ START CAMERA ]'}</button></div>}
        {reticle&&<span className={styles.reticle} style={{left:reticle.x,top:reticle.y}} aria-hidden="true"><span>┌ ┐<br/> ┼ <br/>└ ┘</span><small>{drag.current?`[ ORBIT // Y:${Math.round(yaw*180/Math.PI)}° P:${Math.round(pitch*180/Math.PI)}° ]`:`[R:${reticle.row} C:${reticle.column}]`}</small></span>}
      </div>
      <video ref={video} playsInline muted className={styles.hiddenVideo}/><canvas ref={canvas} width={W} height={H} className={styles.hiddenVideo}/>
      <div className={styles.controls}>
        <button type="button" onClick={()=>setPaused(value=>!value)}>{paused?'[ RUN ]':'[ PAUSE ]'}</button>
        {mode==='cam'?<><button type="button" onClick={()=>{const next=facing==='user'?'environment':'user';setFacing(next);if(cameraState==='live')void startCamera(next);}}>[ FLIP CAM ]</button><button type="button" onClick={()=>setContrast(value=>value===1?1.4:value===1.4?1.9:1)}>[ CONTRAST {contrast.toFixed(1)}× ]</button><button type="button" onClick={()=>setInvert(value=>!value)}>[ INVERT {invert?'ON':'OFF'} ]</button><button type="button" onClick={stopCamera}>[ STOP CAM ]</button></>:<button type="button" onClick={()=>{setYaw(.35);setPitch(.2);}}>[ RESET ORBIT ]</button>}
        <label>Shading <select value={setIndex} onChange={event=>setSetIndex(Number(event.target.value))}>{asciiSets.map((set,index)=><option value={index} key={set.label}>{set.label}</option>)}</select></label>
      </div>
      <div className={styles.telemetry}><span>FPS <strong>{fps}</strong></span><span>RASTER <strong>{W}×{H}</strong></span><span>YAW <strong>{Math.round(yaw*180/Math.PI)}°</strong></span><span>PITCH <strong>{Math.round(pitch*180/Math.PI)}°</strong></span><span>SENSOR <strong>{mode==='cam'?cameraState.toUpperCase():'SIMULATED'}</strong></span></div>
    </div>
    <p className={styles.note}>The kinematic scenes are illustrative simulations. Camera pixels are processed in your browser and are not uploaded to 4TECH.</p>
  </section>;
}
