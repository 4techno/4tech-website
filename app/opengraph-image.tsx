import { ImageResponse } from 'next/og';
export const dynamic = 'force-static';
export const alt = '4TECH — Technology That Shapes Tomorrow. Engineering, robotics & RF technology.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ width:'100%',height:'100%',display:'flex',flexDirection:'column',backgroundColor:'#f5f5f0',color:'#1a1a1a',padding:'65px 80px' }}><div style={{display:'flex',fontSize:36,fontWeight:700}}>4TECH</div><div style={{display:'flex',marginTop:70,fontSize:82,fontWeight:700,letterSpacing:-4}}>Technology That</div><div style={{display:'flex',fontSize:82,fontWeight:700,letterSpacing:-4}}>Shapes Tomorrow.</div><div style={{display:'flex',fontSize:23,color:'#6b6b6b',marginTop:35}}>Embedded systems · Robotics · RF technology</div><div style={{display:'flex',fontSize:17,color:'#6b6b6b',marginTop:45}}>TAMIL NADU, INDIA · INDEPENDENT ENGINEERING</div></div>,size);
}
