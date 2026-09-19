import { ImageResponse } from 'next/og';
export const dynamic = 'force-static';
export const alt = '4tech — Ideas into reality. Engineering, robotics & RF technology.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ width:'100%',height:'100%',display:'flex',flexDirection:'column',backgroundColor:'#0a0a0a',color:'#fafafa',padding:'65px 80px',backgroundImage:'radial-gradient(ellipse at 95% 80%, #591325 0%, transparent 55%)' }}><div style={{display:'flex',fontSize:44,fontWeight:700}}><span style={{color:'#ff3b55'}}>4</span>tech.</div><div style={{display:'flex',marginTop:70,fontSize:96,fontWeight:700,letterSpacing:-5}}>Ideas into reality.</div><div style={{display:'flex',fontSize:26,color:'#a3a3aa',marginTop:35}}>Engineering, robotics & RF technology</div><div style={{display:'flex',fontSize:20,color:'#ff7689',marginTop:60}}>KALPAKKAM, INDIA · ENGINEERING & R&D</div></div>,size);
}
