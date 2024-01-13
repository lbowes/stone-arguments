import React, { useState, useRef, useEffect } from 'react';


type SpaceState = {
    pos: { x: number, y: number },
    size: { width: number, height: number }
};

interface Space2DProps {
    state?: SpaceState;
    children?: React.ReactNode;
}

export interface Space2DContextType {
    pos: { x: number; y: number };
    size: { width: number; height: number };
    spacePosToScreen: (point: { x: number, y: number }) => { x: number, y: number };
    screenPosToSpace: (point: { x: number, y: number }) => { x: number, y: number };
    spaceVectorToScreen: (vector: { x: number, y: number }) => { x: number, y: number};
}

const defaultContext: Space2DContextType = {
    pos: { x: 0, y: 0 },
    size: { width: 1, height: 1 },
    spacePosToScreen: (point: { x: number, y: number }) => ({ x: 0, y: 0 }),
    screenPosToSpace: (point: { x: number, y: number }) => ({ x: 0, y: 0 }),
    spaceVectorToScreen: (vector: { x: number, y: number }) => ({ x: 0, y: 0 })
};

export const Space2DContext = React.createContext<Space2DContextType>(defaultContext);


const Space2D: React.FC<Space2DProps> = ({ state, children }) => {
    const divRef = useRef<HTMLDivElement>(null);

    const defaultState: SpaceState = {
        pos: { x: 0, y: 0 },
        size: { width: 1, height: 1 }
    };

    const [internalState, setInternalState] = useState<SpaceState>(state || defaultState);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState(internalState.pos);

    const [parentSize_scr, setParentSize_scr] = useState({ width: 0, height: 0 });
    const [parentPosTL_scr, setParentPosTL_scr] = useState({ x: 0, y: 0 });

    const [context, setContext] = useState(defaultContext);

    useEffect(() => {
        const spacePosToScreen = (point: { x: number, y: number }) => {
            return {
                x: parentPosTL_scr.x + (point.x - internalState.pos.x) / internalState.size.width * parentSize_scr.width,
                y: parentPosTL_scr.y + (point.y - internalState.pos.y) / internalState.size.height * parentSize_scr.height,
            };
        };

        const spaceVectorToScreen = (vector: { x: number, y: number }) => {
            const vector_scr = {
                x: vector.x / internalState.size.width * parentSize_scr.width,
                y: vector.y / internalState.size.height * parentSize_scr.height,
            };

            return vector_scr;
        };

        const screenPosToSpace = (point: { x: number, y: number }) => {
            return {
                x: internalState.pos.x + (point.x - parentPosTL_scr.x) / parentSize_scr.width * internalState.size.width,
                y: internalState.pos.y + (point.y - parentPosTL_scr.y) / parentSize_scr.height * internalState.size.height,
            };
        }

        setContext({
            pos: internalState.pos,
            size: internalState.size,
            spacePosToScreen,
            screenPosToSpace,
            spaceVectorToScreen
        });
    }, [parentPosTL_scr, parentSize_scr, internalState.pos, internalState.size]);

    const updateParentPosTL_scr = () => {
        if(!divRef.current)
            return;

        const rect = divRef.current.getBoundingClientRect();

        const newPos_scr = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY
        };

        setParentPosTL_scr(newPos_scr);
    };

    const updateParentSize_scr = () => {
        if(!divRef.current)
            return;

        const newParentSize_scr = {
            width: divRef.current.clientWidth,
            height: divRef.current.clientHeight
        };

        setParentSize_scr(newParentSize_scr);
    };

    useEffect(() => {
        updateParentPosTL_scr();
        updateParentSize_scr();

        window.addEventListener('resize', () => {
            updateParentPosTL_scr();
            updateParentSize_scr();
        });

        return () => {
            window.removeEventListener('resize', () => {
                updateParentPosTL_scr();
                updateParentSize_scr();
            });
        };
    }, []);


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.button === 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            setInitialPosition(internalState.pos);
        }
    };

    useEffect(() => {
        const div = divRef.current;
        if (!div)
            return;

        // Wheel event handler
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const zoomSensitivity = 0.1;
            const zoomFactor = e.deltaY > 0 ? (1 + zoomSensitivity) : (1 - zoomSensitivity);

            setInternalState(prevState => {
                const mousePos_scr = { x: e.clientX, y: e.clientY };

                // Work out how far through the space the mouse is (between 0 and 1)
                const mousePos_0_1 = {
                    x: (mousePos_scr.x - parentPosTL_scr.x) / parentSize_scr.width,
                    y: (mousePos_scr.y - parentPosTL_scr.y) / parentSize_scr.height,
                }

                // work out the new position of the mouse in world space
                const newMousePos_space = {
                    x: prevState.pos.x + mousePos_0_1.x * prevState.size.width,
                    y: prevState.pos.y + mousePos_0_1.y * prevState.size.height,
                };

                // work out the new size of the viewport in world space
                const newSize_space = {
                    width: prevState.size.width * zoomFactor,
                    height: prevState.size.height * zoomFactor
                };

                // finally work out the new position of the window in world space
                const newPos_space = {
                    x: newMousePos_space.x - mousePos_0_1.x * newSize_space.width,
                    y: newMousePos_space.y - mousePos_0_1.y * newSize_space.height
                };

                return {
                    pos: newPos_space,
                    size: newSize_space
                };
            });
        };
        div.addEventListener('wheel', handleWheel, { passive: false });

        const handleResize = () => {
            setInternalState(prevState => {
                // The height in world-space remains constant
                const constantWorldSpaceHeight = prevState.size.height;
                const newWorldSpaceWidth = (parentSize_scr.width / parentSize_scr.height) * constantWorldSpaceHeight;
                const widthChange = newWorldSpaceWidth - prevState.size.width;

                const newPos = {
                    x: prevState.pos.x - (widthChange / 2),
                    y: prevState.pos.y
                };

                return {
                    pos: newPos,
                    size: {
                        width: newWorldSpaceWidth,
                        height: constantWorldSpaceHeight
                    }
                };
            });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            div.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isDragging)
            return

        const currentX = e.clientX;
        const currentY = e.clientY;

        if(currentX < parentPosTL_scr.x || currentX > parentPosTL_scr.x + parentSize_scr.width || currentY < parentPosTL_scr.y || currentY > parentPosTL_scr.y + parentSize_scr.height) {
            setIsDragging(false);
            e.stopPropagation();
            return;
        }

        const dx = currentX - dragStart.x;
        const dy = currentY - dragStart.y;

        // Convert movement in screen space to movement in space coordinates
        const movementX = dx * (internalState.size.width / parentSize_scr.width);
        const movementY = dy * (internalState.size.height / parentSize_scr.height);

        setInternalState(prevState => ({
            ...prevState,
            pos: {
                x: initialPosition.x - movementX,
                y: initialPosition.y - movementY
            }
        }));
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsDragging(false);
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.button === 1) {
            setIsDragging(false);
            e.stopPropagation();
        }
    };

    return (
        <div
            ref={divRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box'
            }}
            onMouseDown={(e) => { handleMouseDown(e); }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <Space2DContext.Provider value={context}>
                {children}
            </Space2DContext.Provider>
        </div>
    );
};


export default Space2D;
