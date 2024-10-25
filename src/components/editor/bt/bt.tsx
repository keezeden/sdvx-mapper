import { Rect, Transformer } from "react-konva";
import Konva from "konva";
import { GRID_HEIGHT, GRID_WIDTH } from "../../../../constants";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/components/context/app-context";

const COLOR = "teal";

type BTButtonProps = {
  x?: number;
  y?: number;
};

export const BTButton = ({ x, y }: BTButtonProps) => {
  const { bpm } = useAppContext();

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
        height={GRID_HEIGHT}
        width={GRID_WIDTH}
        x={x}
        y={y}
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
            height: GRID_HEIGHT,
            width: Math.round((node.width() * scaleX) / GRID_WIDTH) * GRID_WIDTH,
            duration: 0,
          });
        }}
        onDragEnd={(e) => {
          e.target.to({
            y: Math.round(e.target.y() / GRID_HEIGHT) * GRID_HEIGHT,
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