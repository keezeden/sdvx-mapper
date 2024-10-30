import { useGamepad } from "@/hooks/gamepad";

export const GamepadConfig = () => {
  const { gamepad } = useGamepad();

  if (!gamepad) return <div>Connect a gamepad</div>;

  const [start, bta, btb, btc, btd, fxl, fxr] = gamepad?.buttons;
  const [ll, rl] = gamepad?.axes;

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center gap-8">
        <div className="flex justify-center items-center border size-8">{ll.toFixed(1)}</div>
        <div className="flex justify-center items-center border size-8">{rl.toFixed(1)}</div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <div className="flex justify-center items-center border size-6">{start.pressed ? "O" : "I"}</div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <div className="flex justify-center items-center border size-6">{bta.pressed ? "O" : "I"}</div>
        <div className="flex justify-center items-center border size-6">{btb.pressed ? "O" : "I"}</div>
        <div className="flex justify-center items-center border size-6">{btc.pressed ? "O" : "I"}</div>
        <div className="flex justify-center items-center border size-6">{btd.pressed ? "O" : "I"}</div>
      </div>

      <div className="flex justify-center items-center gap-4">
        <div className="flex justify-center items-center border size-6">{fxl.pressed ? "O" : "I"}</div>
        <div className="flex justify-center items-center border size-6">{fxr.pressed ? "O" : "I"}</div>
      </div>
    </div>
  );
};
