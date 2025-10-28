import React, { createContext, useEffect, useState } from "react";
import Widget, { WidgetState } from "./Widget";
import WidgetMap from "./WidgetMap";
import Header from "./Header";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { nanoid } from "nanoid";
import styles from "./App.css";

interface AppContextType {
  widgets: WidgetState<any>[];
  editing: boolean;
  menuOpen: boolean;

  setWidgets: React.Dispatch<React.SetStateAction<WidgetState<any>[]>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  saveTemplate: () => void;
  loadTemplate: () => boolean;

  // addWidget: (type: string) => void;
  // removeWidget: (id: string) => void;
}

export const AppContext = createContext<AppContextType>(null);

const FallbackTemplate: WidgetState<any>[] = [
  {
    id: nanoid(6),
    type: "clock",
    size: { ...WidgetMap["clock"].size },
    position: { gridX: 10, gridY: 1 },
    settings: { ...WidgetMap["clock"].settings },
  },
  {
    id: nanoid(6),
    type: "search",
    size: { ...WidgetMap["search"].size },
    position: { gridX: 8, gridY: 3 },
    settings: { ...WidgetMap["search"].settings },
  },
];

const App = () => {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [widgets, setWidgets] = useState<WidgetState<any>[]>([]);

  // TODO: This system will eventually keep an
  // array of templates and store the index of
  // the active template. For the time being,
  // this uses a single template structure.

  function saveTemplate() {
    localStorage.setItem("template", JSON.stringify(widgets));
  }

  function loadTemplate(): boolean {
    const template = localStorage.getItem("template");

    if (template === null) {
      console.warn("No template stored");
      return false;
    }

    setWidgets(JSON.parse(template) as WidgetState<any>[]);
    return true;
  }

  useEffect(() => {
    if (!loadTemplate()) {
      setWidgets(FallbackTemplate);
    }
  }, []);

  return (
    <div className={styles.content}>
      <AppContext.Provider
        value={{
          widgets,
          editing,
          menuOpen,

          setWidgets,
          setEditing,
          setMenuOpen,

          saveTemplate,
          loadTemplate,
        }}
      >
        <Header></Header>
        <Grid width={24} height={12} editing={editing}>
          {widgets.map((state) => {
            const map = WidgetMap[state.type];
            const Component = map.component;
            return (
              <Widget
                size={state.size || map.size}
                position={state.position}
                resizeable={map.resizable}
                id={state.id}
                key={state.id}
              >
                <Component {...state}></Component>
              </Widget>
            );
          })}
        </Grid>

        <Menu active={menuOpen}></Menu>
      </AppContext.Provider>
    </div>
  );
};

export default App;
