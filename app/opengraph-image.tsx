import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = '4TECH — engineering ideas into reality';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', overflow: 'hidden', position: 'relative',
      backgroundColor: '#09090c', color: '#ededed', padding: '58px 70px',
      backgroundImage: 'radial-gradient(circle at 73% 53%, rgba(252,107,47,.28), transparent 39%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
          <span style={{ color: '#fc6b2f' }}>4</span>TECH.
        </div>
        <div style={{ display: 'flex', fontSize: 15, letterSpacing: 4, color: '#b5b5b5' }}>ENGINEERING STUDIO / INDIA</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 970 }}>
        <div style={{ display: 'flex', color: '#fc6b2f', fontSize: 20, letterSpacing: 5, marginBottom: 26 }}>EMBEDDED / ROBOTICS / RF</div>
        <div style={{ display: 'flex', fontSize: 82, fontWeight: 800, letterSpacing: -5, lineHeight: 1.05 }}>Ideas into reality.</div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 25, color: '#c9c9cb' }}>Engineering possibilities, together.</div>
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #44444b', paddingTop: 22, justifyContent: 'space-between', color: '#b5b5b5', fontSize: 17 }}>
        <span>4TECH / Independent engineering practice</span>
        <span>4tech-9cy.pages.dev</span>
      </div>
    </div>,
    size,
  );
}
