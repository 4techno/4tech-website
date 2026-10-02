export type Vec3 = [number, number, number];
export const asciiModels = [
  { code: '01/ARM', label: 'Robotic arm' }, { code: '02/PWR', label: 'Inductive torus' },
  { code: '03/RAD', label: 'Radar array' }, { code: '04/DRN', label: 'Quadrotor' },
  { code: '05/HEX', label: 'Hexapod' }, { code: '06/LID', label: 'LiDAR scanner' },
  { code: '07/SAT', label: 'CubeSat' }, { code: '08/ENG', label: 'Crankshaft' },
] as const;
export const asciiSets = [
  { label: 'Standard', glyphs: ' .:-=+*#%@' },
  { label: 'Minimal', glyphs: ' · : * #' },
  { label: 'Binary', glyphs: ' 0101#*' },
  { label: 'Dense', glyphs: ' .,-~:;=!*#$@' },
] as const;
const add = (a: Vec3, b: Vec3): Vec3 => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const polar = (r: number, a: number, y = 0): Vec3 => [r*Math.cos(a),y,r*Math.sin(a)];

/** CPU-only character-space rasterizer; no canvas readback or external graphics runtime. */
export function renderAsciiModel(model: number, time: number, yaw: number, pitch: number, chars: string, width = 64, height = 25): string {
  const ink = Array<string>(width*height).fill(' '), depth = new Float32Array(width*height).fill(-100);
  const cy=Math.cos(yaw), sy=Math.sin(yaw), cp=Math.cos(pitch), sp=Math.sin(pitch);
  function project(p: Vec3): [number,number,number] {
    const x=p[0]*cy+p[2]*sy, z=-p[0]*sy+p[2]*cy;
    const y=p[1]*cp-z*sp, zz=p[1]*sp+z*cp;
    const perspective=3.8/Math.max(1.8,3.8-zz);
    return [Math.round(width/2+x*width*.22*perspective),Math.round(height/2-y*height*.38*perspective),zz];
  }
  function point(p: Vec3, light=.8) {
    const [x,y,z]=project(p); if(x<0||x>=width||y<0||y>=height)return;
    const i=y*width+x; if(z<depth[i])return; depth[i]=z;
    const level=Math.max(1,Math.min(chars.length-1,Math.round((.3+.48*light+.18*(z+1)/2)*(chars.length-1))));
    ink[i]=chars[level]||'#';
  }
  function line(a: Vec3,b: Vec3,light=.8) {
    const d=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
    const n=Math.max(2,Math.ceil(d*55));
    for(let i=0;i<=n;i++){const f=i/n; point([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f],light);}
  }
  function ring(center:Vec3,r:number,axis:'x'|'y'|'z',light=.7){
    for(let i=0;i<64;i++){const a=i*Math.PI*2/64,b=(i+1)*Math.PI*2/64;
      const f=(angle:number):Vec3=>axis==='y'?add(center,polar(r,angle)):axis==='x'?add(center,[0,r*Math.cos(angle),r*Math.sin(angle)]):add(center,[r*Math.cos(angle),r*Math.sin(angle),0]);
      line(f(a),f(b),light);
    }
  }
  function box(center:Vec3,half:Vec3,light=.6){
    const v=(x:number,y:number,z:number):Vec3=>add(center,[x*half[0],y*half[1],z*half[2]]);
    for(const a of [-1,1])for(const b of [-1,1]){line(v(a,b,-1),v(a,b,1),light);line(v(a,-1,b),v(a,1,b),light);line(v(-1,a,b),v(1,a,b),light);}
  }
  const phase=time*.001;
  if(model===0){
    ring([0,-1.1,0],.65,'y'); line([0,-1.1,0],[0,-.58,0]); ring([0,-.6,0],.23,'y');
    const shoulder:Vec3=[0,-.53,0], elbow:Vec3=[.64*Math.cos(phase*.6),.18+.14*Math.sin(phase*.8),.2*Math.sin(phase*.6)];
    const wrist:Vec3=[elbow[0]+.57*Math.cos(phase*.6+.7),elbow[1]+.39,elbow[2]+.25];
    line(shoulder,elbow,1);line(elbow,wrist,1);ring(elbow,.13,'z',1);ring(wrist,.12,'z',1);
    line(wrist,[wrist[0]+.24,wrist[1]+.19,wrist[2]-.1]);line(wrist,[wrist[0]+.27,wrist[1]-.06,wrist[2]+.13]);
    line([wrist[0]+.24,wrist[1]+.19,wrist[2]-.1],[wrist[0]+.37,wrist[1]+.11,wrist[2]-.06]);
    line([wrist[0]+.27,wrist[1]-.06,wrist[2]+.13],[wrist[0]+.39,wrist[1]+.03,wrist[2]+.08]);
  } else if(model===1){
    const R=.9,r=.35;
    for(let i=0;i<70;i++)for(let j=0;j<22;j++){
      const u=i*Math.PI*2/70+phase*.18,v=j*Math.PI*2/22;
      point([(R+r*Math.cos(v))*Math.cos(u),r*Math.sin(v),(R+r*Math.cos(v))*Math.sin(u)],.3+.7*(1+Math.cos(v))/2);
    }
    for(let a=0;a<4;a++){const q=phase*.45+a*Math.PI/2;ring([0,0,0],1.3+a*.08,'y',.3);line(polar(.3,q),polar(1.6,q),.5);}
  } else if(model===2){
    line([0,-1.3,0],[0,-.35,0]);ring([0,-1.2,0],.6,'y');
    for(let i=0;i<16;i++)for(let j=0;j<8;j++){
      const r=i/16*1.18,a=j*Math.PI*2/8,y=.35-.55*(r/1.18)**2;
      point(polar(r,a,y),.4+.5*(1-r/1.18));
    }
    ring([0,-.2,0],1.18,'y',1);const sweep=phase*.6;line([0,-.2,0],polar(1.2,sweep,-.2),1);
    for(let i=1;i<4;i++)ring([0,.3,0],.2+i*.3,'y',.18);
  } else if(model===3){
    box([0,0,0],[.32,.18,.36],.9);
    for(const [x,z] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
      const c:Vec3=[x*.92,.03,z*.92];line([0,0,0],c,1);ring(c,.28,'y',.9);
      const a=phase*12+(x*z>0?0:Math.PI/2);line(add(c,polar(.38,a,.08)),add(c,polar(.38,a+Math.PI,.08)),.8);
    }
    line([0,-.2,0],[0,-.5,0],.5);
  } else if(model===4){
    for(let i=0;i<48;i++){const a=i*Math.PI*2/48;line(polar(.52,a,-.05),polar(.52,a+Math.PI*2/48,-.05),.7);}
    for(let i=0;i<6;i++){const a=i*Math.PI/3,base=polar(.48,a,-.08),mid=polar(.88,a,-.43+.13*Math.sin(phase*4+i*Math.PI)),foot=polar(1.26,a,-.9+.17*Math.sin(phase*4+i*Math.PI));line(base,mid,.9);line(mid,foot,1);ring(mid,.07,'z',1);}
    ring([0,.03,0],.24,'y',.7);
  } else if(model===5){
    box([0,-.3,0],[.35,.5,.35]);ring([0,.35,0],.45,'y',.95);box([0,.38,0],[.33,.22,.3],.7);
    const a=phase*2;line([0,.4,0],polar(.7,a,.75),1);
    for(let i=0;i<80;i++){const q=i*2.399963,r=.5+1.15*((i*37)%97)/97;point(polar(r,q,.2+.45*Math.sin(q*2+phase*.4)),.2+.5*((i*13)%11)/11);}
  } else if(model===6){
    box([0,0,0],[.4,.68,.38],.95);line([0,.7,0],[0,1.05,0]);ring([0,1.05,0],.18,'y');
    for(const x of [-1,1]){const c:Vec3=[x*.95,.08,0];box(c,[.48,.5,.04],.75);for(let y=-.3;y<=.4;y+=.22)line([c[0]-.44,y,0],[c[0]+.44,y,0],.3);}
    ring([0,-.15,.4],.16,'z',1);
  } else {
    box([-.5,0,0],[.37,.62,.36],.6);ring([.6,-.52,0],.67,'z',.9);ring([.6,-.52,0],.11,'z',1);
    const crank:Vec3=[.6+.43*Math.cos(phase*2),-.52+.43*Math.sin(phase*2),0];
    const piston:Vec3=[-.5,-.18+.34*Math.sin(phase*2),0];
    line([.6,-.52,0],crank,1);line(crank,piston,1);line([-.77,piston[1],.39],[-.22,piston[1],.39],1);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;line([.6,-.52,0],add([.6,-.52,0],polar(.67,a,.0)),.35);}
  }
  return Array.from({length:height},(_,row)=>ink.slice(row*width,(row+1)*width).join('')).join('\n');
}
