import { useEffect, useState } from "react";

export const useGamepad = ({ pollRate = 60 }: { pollRate?: number } = {}) => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);

  useEffect(() => {
    const handleConnected = (e: GamepadEvent) => {
      console.log("Gamepad connected", e.gamepad);
      setGamepad(navigator.getGamepads()[e.gamepad.index]);
    };

    const handleDisconnected = (e: GamepadEvent) => {
      console.log("Gamepad disconnected", e.gamepad);
      setGamepad(null);
    };

    window.addEventListener("gamepadconnected", handleConnected);
    window.addEventListener("gamepaddisconnected", handleDisconnected);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnected);
      window.removeEventListener("gamepaddisconnected", handleDisconnected);
    };
  }, []);

  useEffect(() => {
    if (!gamepad) return;

    const interval = setInterval(() => {
      setGamepad(navigator.getGamepads()[gamepad.index]);
    }, pollRate / 1000);

    return () => clearInterval(interval);
  }, [gamepad]);

  return { gamepad };
};
