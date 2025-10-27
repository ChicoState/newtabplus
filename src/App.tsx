import React, { createContext, useContext, useState } from "react";
import Widget, { WidgetState } from "./Widget";
import { WidgetMap } from "./WidgetMap";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { nanoid } from "nanoid";
import styles from "./App.css";
import {
  PencilSimpleIcon,
  CheckIcon,
  XIcon,
  ListIcon,
} from "@phosphor-icons/react";

interface AppContextType {
  widgets: WidgetState<any>[];
  setWidgets: React.Dispatch<React.SetStateAction<WidgetState<any>[]>>;
}

export const AppContext = createContext<AppContextType>(null);

// Example deserialized data
// TODO: write import function
const TestData: WidgetState<any>[] = [
  {
    id: nanoid(6),
    type: "clock",
    size: null,
    position: { gridX: 10, gridY: 1 },
    settings: WidgetMap["clock"].settings,
  },
  {
    id: nanoid(6),
    type: "search",
    size: null,
    position: { gridX: 8, gridY: 3 },
    settings: WidgetMap["search"].settings,
  },
];

const App = () => {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [widgets, setWidgets] = useState<WidgetState<any>[]>(TestData);

  return (
    <div className={styles.content}>
      <AppContext.Provider value={{ widgets, setWidgets }}>
        <div className={styles.header}>
          <div className={styles.row}>
            {editing && (
              <button
                className={[styles.container, styles.button].join(" ")}
                onClick={() => {
                  setEditing(!editing);
                }}
              >
                <XIcon weight="bold"></XIcon>
                Cancel
              </button>
            )}

            <button
              className={[styles.container, styles.button].join(" ")}
              onClick={() => {
                setEditing(!editing);
              }}
            >
              {editing && <CheckIcon weight="bold"></CheckIcon>}
              {!editing && <PencilSimpleIcon weight="bold"></PencilSimpleIcon>}
              {editing ? "Done" : "Edit"}
            </button>

            <button
              className={[styles.container, styles.button].join(" ")}
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
            >
              <ListIcon weight="bold"></ListIcon>
              Settings
            </button>
          </div>
        </div>

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
