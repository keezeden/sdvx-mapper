import { useAppContext } from "@/components/context/app-context";
import { useEffect, useState } from "react";
import { Layer, Rect } from "react-konva";
import { GRID_WIDTH } from "../../../../constants";

const COLOR = "red";
const UPDATE_RATE = 1000 / 60;

export const Timeline = () => {
  const [pos, setPos] = useState(0);

  const { sound, bpm } = useAppContext();

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
    <Layer y={400} scaleY={-1}>
      <Rect
        draggable
        onDragMove={(evt) => {
          evt.target.y(0);
        }}
        onDragEnd={(evt) => {
          if (!sound) return;

          const beatsPerSecond = bpm / 60;
          const pos = evt.target.x() / (beatsPerSecond * GRID_WIDTH);
          sound.seek(pos);

          setPos(evt.target.x());
        }}
        x={pos}
        height={400}
        width={5}
        fill={COLOR}
      />
    </Layer>
  );
};
