import JitterPath from './components/JitterStroke';
import Space2D from './components/Space2D';
import ArgumentCanvas from './components/ArgumentCanvas';


import { useRef, useState, useEffect } from 'react';


type HandDrawnPathProps = {
  pathData: string;
};

const HandDrawnPath: React.FC<HandDrawnPathProps> = ({ pathData }) => {
  const filterId = useRef(`hand-drawn-filter-${Math.random().toString(36).substr(2, 9)}`).current;

  const [seed, setSeed] = useState(0);

  // useEffect(() => {
  //     let counter = 0;
  //     const interval = setInterval(() => {
  //         counter++;
  //         const newSeed = (Date.now() + counter) % 1000;
  //         setSeed(newSeed);
  //     }, 100);

  //     return () => clearInterval(interval);
  // }, []);

  return (
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={filterId + seed}>
          <feTurbulence type="fractalNoise" baseFrequency="0.021" numOctaves="3" seed={seed} result="turbulence" />
          <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path d={pathData} strokeWidth={2} stroke="#333" fill="transparent" filter={`url(#${filterId + seed})`} />
    </svg>
  );
};


const App = () => {
  const pathData = "M10 80 C 40 10, 65 18, 95 80 S 150 150, 380 80";

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      <div style={{
        width: '100%',
        height: '600px',
        border: '1px solid #bbb',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <Space2D>
          <ArgumentCanvas />
        </Space2D>
      </div>

      <JitterPath pathData={pathData} jitterAmount={10} />
      <HandDrawnPath pathData={pathData} />
    </div>
  );
}


export default App;
