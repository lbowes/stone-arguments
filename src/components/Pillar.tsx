import React from 'react';


interface PillarProps {
    x: number;
    y: number;
    width: number;
    height: number;
    channelWidth: number;
}

let clipPathIdCounter = 0;

const Pillar: React.FC<PillarProps> = ({ x, y, width, height, channelWidth }) => {
    const numberOfRects = Math.ceil(width / (channelWidth * 2));
    const channels = [];
    const clipPathId = `clip-${clipPathIdCounter++}`;

    const shadowHeight = 8;

    for (let i = 0; i < numberOfRects; i++) {
        channels.push(
            <rect
                key={i}
                x={x + channelWidth * 0.5 + i * channelWidth * 2}
                y={y + channelWidth * 2}
                width={channelWidth}
                height={height - channelWidth * 4}
                rx={channelWidth * 0.5}
                ry={channelWidth * 0.5}
                style={{ fill: 'white' }}
                filter="url(#inset-shadow)"
            />
        );
    }

    return <>
        <defs>
            <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset dx="-2" dy="2" />
                <feGaussianBlur stdDeviation="4" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="black" floodOpacity="0.4" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>

            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#000', stopOpacity: 0.6 }} />
                <stop offset="20%" style={{ stopColor: '#000', stopOpacity: 0.25 }} />
                <stop offset="60%" style={{ stopColor: '#000', stopOpacity: 0.04 }} />
            </linearGradient>

            <linearGradient id="bottom-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'transparent' }} />
                <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 0.1 }} />
            </linearGradient>

            <linearGradient id="top-shadow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'transparent' }} />
                <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 0.1 }} />
            </linearGradient>

            <clipPath id={clipPathId}>
                <rect x={x} y={y} width={width} height={height}/>
            </clipPath>
        </defs>

        <rect x={x} y={y} width={width} height={height} style={{ fill: 'white' }} />
            <g clipPath={`url(#${clipPathId})`}>
                {channels}
            </g>
        <rect x={x} y={y} width={width} height={height} style={{ fill: 'url(#gradient)', opacity: 0.5 }} />

        <rect x={x} y={y + height - shadowHeight} width={width} height={`${shadowHeight}`} style={{ fill: 'url(#bottom-shadow)' }} />
        <rect x={x} y={y} width={width} height={`${shadowHeight}`} style={{ fill: 'url(#top-shadow)' }} />
    </>;
};


export default Pillar;
