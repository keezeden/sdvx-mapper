import { Howl } from "howler";
import { useAppContext } from "../context/app-context";

const FILE = "song.mp3";

export const AudioBar = () => {
  const { sound, setAppContext } = useAppContext();

  const load = () => {
    if (sound) {
      sound.unload();
      setAppContext({ sound: null });
    }

    const howl = new Howl({
      src: [FILE],
      volume: 0.2,
    });

    howl.on("load", () => {
      setAppContext({ sound: howl });
    });
  };

  return (
    <div className="join w-full justify-center flex">
      <button className="btn hover:btn-primary join-item" onClick={load}>
        Load
      </button>
      {sound && (
        <>
          <button
            className="btn hover:btn-primary join-item"
            onClick={() => {
              if (sound.playing()) return;
              sound.play();
            }}
          >
            Play
          </button>
          <button className="btn hover:btn-primary join-item" onClick={() => sound.pause()}>
            Pause
          </button>
          <button className="btn hover:btn-primary join-item" onClick={() => console.log(sound.duration())}>
            Length
          </button>
        </>
      )}
    </div>
  );
};
