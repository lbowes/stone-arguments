interface BlockProps {
    x: number;
    y: number;
    width: number;
    height: number;
    padding: number;
}

const Block: React.FC<BlockProps> = ({ x, y, width, height, padding }) => {
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

    return <>
        <polygon points={left} style={{ fill: '#aaa' }} />
        <polygon points={top} style={{ fill: verticalColor }} />
        <polygon points={bottom} style={{ fill: verticalColor }} />
        <polygon points={middle} style={{ fill: middleColor }} />
        <polygon points={right} style={{ fill: '#f8f8f8' }} />
    </>;
};


export default Block;