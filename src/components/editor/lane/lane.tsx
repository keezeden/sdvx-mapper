import { Group, Rect } from "react-konva";
import { GRID_HEIGHT, GRID_WIDTH } from "../../../../constants";
import { useAppContext } from "@/components/context/app-context";
import { useEffect, useState } from "react";
import { BTButton } from "../bt/bt";
import { FXButton } from "../fx/fx";
import { useGamepad } from "@/hooks/gamepad";

const COLOR = "grey";
const POINTER_COLOR = "red";
const UPDATE_RATE = 1000 / 60;

type LaneProps = {
  length: number;
};

const componentMap = {
  BT: BTButton,
  FX: FXButton,
};

export const Lane = ({ length }: LaneProps) => {
  const { tool, sound, bpm } = useAppContext();

  const [children, setChildren] = useState<JSX.Element[]>([]);

  const { gamepad } = useGamepad();

  useEffect(() => {
    if (!gamepad) return;
    if (!sound) return;

    const [start, bta, btb, btc, btd, fxl, fxr] = gamepad?.buttons;
    const [ll, rl] = gamepad?.axes;

    const press = (tool: "BT" | "FX", lane: number) => {
      const seek = sound.seek();

      const beatsPerSecond = bpm / 60;
      const pos = seek * beatsPerSecond * GRID_WIDTH;

      const Component = componentMap[tool as keyof typeof componentMap];
      setChildren((c) => [...c, <Component x={pos} y={lane * GRID_HEIGHT} />]);
    };

    if (bta.pressed) press("BT", 0);
    if (btb.pressed) press("BT", 1);
    if (btc.pressed) press("BT", 2);
    if (btd.pressed) press("BT", 3);

    if (fxl.pressed) press("FX", 0);
    if (fxr.pressed) press("FX", 2);
  }, [gamepad]);

  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!sound) return;

    // NOTE: Is this bad?
    const interval = setInterval(() => {
      if (sound.playing()) {
        const seek = sound.seek();

        const beatsPerSecond = bpm / 60;
        const pos = seek * beatsPerSecond * GRID_WIDTH;
        setPos(pos);
      }
    }, UPDATE_RATE);

    return () => clearInterval(interval);
  }, [sound]);

  return (
    <Group
      x={-pos}
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
