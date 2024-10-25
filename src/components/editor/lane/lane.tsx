import { Group, Rect } from "react-konva";
import { GRID_HEIGHT, GRID_WIDTH } from "../../../../constants";
import { useAppContext } from "@/components/context/app-context";
import { useState } from "react";
import { BTButton } from "../bt/bt";
import { FXButton } from "../fx/fx";

const COLOR = "grey";

type LaneProps = {
  length: number;
};

const componentMap = {
  BT: BTButton,
  FX: FXButton,
};

export const Lane = ({ length }: LaneProps) => {
  const { tool } = useAppContext();

  const [children, setChildren] = useState<JSX.Element[]>([]);

  return (
    <Group
      onClick={(evt) => {
        const isDoubleClick = evt.evt.detail === 2;
        if (!isDoubleClick) return;
        const Component = componentMap[tool as keyof typeof componentMap];
        setChildren((c) => [
          ...c,
          <Component
            x={Math.floor(evt.evt.layerX / GRID_WIDTH) * GRID_WIDTH}
            y={Math.floor(evt.evt.layerY / GRID_HEIGHT) * GRID_WIDTH}
          />,
        ]);
      }}
      width={length}
    >
      {/* Lane outlines */}
      <Rect y={0} width={length} height={GRID_HEIGHT} strokeWidth={2} stroke={COLOR} />
      <Rect y={GRID_HEIGHT} width={length} height={GRID_HEIGHT} strokeWidth={2} stroke={COLOR} />
      <Rect y={GRID_HEIGHT * 2} width={length} height={GRID_HEIGHT} strokeWidth={2} stroke={COLOR} />
      <Rect y={GRID_HEIGHT * 3} width={length} height={GRID_HEIGHT} strokeWidth={2} stroke={COLOR} />

      <Grid offset={0} length={length} />
      <Grid offset={GRID_HEIGHT} length={length} />
      <Grid offset={GRID_HEIGHT * 2} length={length} />
      <Grid offset={GRID_HEIGHT * 3} length={length} />

      {children}
    </Group>
  );
};

const Grid = ({ offset, length }: { offset: number; length: number }) => {
  const amount = length / GRID_WIDTH;

  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <Rect
          key={i}
          x={i * GRID_WIDTH}
          height={GRID_HEIGHT + offset}
          width={GRID_WIDTH}
          opacity={0.1}
          stroke="grey"
          strokeWidth={1}
        />
      ))}
    </>
  );
};
