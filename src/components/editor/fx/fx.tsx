import { Rect, Transformer } from "react-konva";
import Konva from "konva";
import { GRID_HEIGHT, GRID_WIDTH } from "../../../../constants";
import { useEffect, useRef, useState } from "react";

const COLOR = "orange";

type FXButtonProps = {
  x?: number;
  y?: number;
};

export const FXButton = ({ x = 0, y = 0 }: FXButtonProps) => {
  const rectRef = useRef<Konva.Rect>();
  const transformerRef = useRef<Konva.Transformer>();

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (!rectRef.current) return;
    if (!transformerRef.current) return;

    if (isSelected) {
      const transformer = transformerRef.current as any;
      transformer.nodes([rectRef.current]);
      transformer.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        // @ts-ignore
        ref={rectRef}
        onClick={() => setIsSelected(!isSelected)}
        draggable
        height={GRID_HEIGHT * 2}
        width={GRID_WIDTH}
        y={Math.round(y / GRID_HEIGHT) * GRID_HEIGHT}
        x={Math.round(x / GRID_WIDTH) * GRID_WIDTH}
        fill={COLOR}
        onTransformEnd={(e) => {
          if (!rectRef.current) return;
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = rectRef.current as any;
          const scaleX = node.scaleX();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          rectRef.current.to({
            y: Math.round(node.y() / GRID_HEIGHT) * GRID_HEIGHT,
            x: Math.round(node.x() / GRID_WIDTH) * GRID_WIDTH,
            height: GRID_HEIGHT * 2,
            width: Math.round((node.width() * scaleX) / GRID_WIDTH) * GRID_WIDTH,
            duration: 0,
          });
        }}
        onDragEnd={(e) => {
          e.target.to({
            y: Math.round(e.target.y() / (2 * GRID_HEIGHT)) * (2 * GRID_HEIGHT),
            x: Math.round(e.target.x() / GRID_WIDTH) * GRID_WIDTH,
            duration: 0,
          });
        }}
      />
      {isSelected && (
        <Transformer
          // @ts-ignore
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={["middle-right", "middle-left"]}
        />
      )}
    </>
  );
};
