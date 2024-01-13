import React, { useEffect } from 'react';

type JitterPathProps = {
    pathData: string;
    jitterAmount: number;
};

const JitterPath: React.FC<JitterPathProps> = ({ pathData, jitterAmount }) => {
    const jitterPath = (pathData: string, jitterAmount: number): string => {
        return pathData.replace(/(\d+(\.\d+)?)/g, match => {
            let num = parseFloat(match);
            return (num + (Math.random() - 0.5) * jitterAmount).toString();
        });
    };

    useEffect(() => {
        const newPathData = jitterPath(pathData, jitterAmount);
        document.getElementById("jitteredPath")?.setAttribute('d', newPathData);
    }, [pathData, jitterAmount]);

    return (
        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
            <path id="jitteredPath" d={pathData} stroke="black" fill="transparent" />
        </svg>
    );
};

export default JitterPath;
