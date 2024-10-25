"use client";
import { AudioBar } from "@/components/audio-bar/audio-bar";
import { useAppContext } from "@/components/context/app-context";
import { Lane } from "@/components/editor/lane/lane";
import { Timeline } from "@/components/editor/timeline/timeline";
import { Layer, Stage } from "react-konva";
import { GRID_HEIGHT, GRID_WIDTH } from "../../constants";
import { Toolbar } from "@/components/tool-bar/tool-bar";
import { useRef, useState } from "react";
import Konva from "konva";

export const Home = () => {
  const { setAppContext, sound, bpm } = useAppContext();

  const SONG_LENGTH = sound ? (sound?.duration() / 60) * bpm * GRID_WIDTH : 3000;

  const stageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    if (!stageRef.current) return;

    const stage = stageRef.current as Konva.Stage;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition() ?? { x: 0, y: 0 };

    // Calculate the new scale based on the wheel delta
    const scaleBy = 1.2;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // Adjust the position of the stage to zoom in on the pointer position
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div className="h-screen w-screen grid grid-cols-8">
      <div className="col-span-2 flex flex-col gap-4 p-8">
        <AudioBar />
        <Toolbar />
        <input
          type="number"
          className="input input-bordered"
          value={bpm}
          onChange={(evt) => setAppContext({ bpm: parseInt(evt.target.value) })}
        />
      </div>
      <div className="overflow-x-scroll col-span-6">
        <Stage
          onWheel={handleWheel}
          scaleX={scale.x}
          scaleY={scale.y}
          ref={stageRef}
          draggable
          y={300}
          className="h-full w-full"
          width={SONG_LENGTH + 400}
          height={GRID_HEIGHT * 4 + 400}
        >
          <Layer>
            <Lane length={SONG_LENGTH} />
          </Layer>
          <Timeline />
        </Stage>
      </div>
    </div>
  );
};
