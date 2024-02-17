import { useContext, useEffect, useState } from "react";
import Space2D, { Space2DContext } from "./Space2D";
import Block from "./Block";
import Pillar from "./Pillar";


const ArgumentCanvas = () => {
    const { data, worldPosToView, worldVectorToView } = useContext(Space2DContext);

    const [pillarPos, setPillarPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [pillarSize, setPillarSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    const pillarWidth = 0.3;
    const pillarHeight = 0.3;

    useEffect(() => {
        const { x, y } = worldPosToView({ x: 0, y: 0 });
        const newSize = worldVectorToView({ x: pillarWidth, y: pillarHeight });

        setPillarPos({ x, y });
        setPillarSize({ width: newSize.x, height: newSize.y });
    }, [ data, worldPosToView, worldVectorToView]);

    return <>
        <svg width="100%" height="100%">
            {/* <Block x={20} y={20} width={400} height={50} padding={10}/> */}
            <Pillar {...pillarPos} {...pillarSize} channelWidth={12}/>
            {/* <Pillar x={200} y={200} width={100} height={400} channelWidth={12}/> */}
            {/* <Pillar x={230} y={70} width={100} height={400} channelWidth={12}/>
            <Block x={135} y={470} width={200} height={100} padding={10}/>
            <Block x={350} y={500} width={200} height={70} padding={10}/> */}
        </svg>
    </>
};


export default ArgumentCanvas;