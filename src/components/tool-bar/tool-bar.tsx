import { useAppContext } from "../context/app-context";

export const Toolbar = () => {
  const { tool, setAppContext } = useAppContext();

  const selectTool = (name: typeof tool) => setAppContext({ tool: name });
  const selectedClasses = (name: string) => (name === tool ? "btn-primary" : "");

  return (
    <div className="join justify-center flex">
      <button onClick={() => selectTool("BT")} className={`btn hover:btn-primary join-item ${selectedClasses("BT")}`}>
        BT
      </button>
      <button onClick={() => selectTool("FX")} className={`btn hover:btn-primary join-item ${selectedClasses("FX")}`}>
        FX
      </button>
      <button onClick={() => selectTool("RL")} className={`btn hover:btn-primary join-item ${selectedClasses("RL")}`}>
        RL
      </button>
      <button onClick={() => selectTool("LL")} className={`btn hover:btn-primary join-item ${selectedClasses("LL")}`}>
        LL
      </button>
    </div>
  );
};
