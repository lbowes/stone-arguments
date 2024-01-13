import { useRef, useEffect, useState } from 'react';


interface BlockProps {
    x: number;
    y: number;
    width: number;
    height: number;
    padding: number;
}

const Block: React.FC<BlockProps> = ({ x, y, width, height, padding }) => {
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

    const points = [
        // Outer rectangle
        [0, 0], // A
        [width, 0], // B
        [width, height], // C
        [0, height], // D

        // Inner rectangle
        [padding, padding], // E
        [width - padding, padding], // F
        [width - padding, height - padding], // G
        [padding, height - padding], // H
    ]

    const toString = (indices: number[]): string => {
        return indices.map(i => `${x + points[i][0]},${y + points[i][1]}`).join(' ');
    };

    const left = toString([0, 3, 7, 4]);
    const top = toString([0, 1, 5, 4]);
    const bottom = toString([3, 7, 6, 2]);
    const middle = toString([4, 5, 6, 7]);
    const right = toString([1, 2, 6, 5]);

    const verticalColor = '#ddd';
    const middleColor = '#eaeaea';
    const crackColor = '#d4d4d4';

    return <>
        {/* noise filter for notches */}
        <defs>
            <filter id={filterId + seed}>
                <feTurbulence type="fractalNoise" baseFrequency="0.021" numOctaves="3" result="turbulence" />
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>

        {/* background for notches */}
        <rect x={x} y={y} width={width} height={height} style={{ fill: crackColor }} />

        {/* faces of the block */}
        <polygon points={left} style={{ fill: '#aaa' }}/>
        <polygon points={top} style={{ fill: verticalColor }} />
        <polygon points={bottom} style={{ fill: verticalColor }} />
        <polygon points={middle} style={{ fill: middleColor }}  filter={`url(#${filterId + seed})`} />
        <polygon points={right} style={{ fill: '#f8f8f8' }} />
    </>;
};


export default Block;