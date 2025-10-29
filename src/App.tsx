import React, { createContext, useEffect, useState } from "react";
import Widget, { WidgetState } from "./Widget";
import WidgetMap from "./WidgetMap";
import Header from "./Header";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { nanoid } from "nanoid";
import styles from "./App.css";
import { MyCalendar, MyCalendar2 } from "./widgets/calanderwidget";
import { MySamCal } from "./widgets/calandersample";
import { NoteForm } from "./widgets/notepadwidget"
import { MyCalendar3 } from "./widgets/calander5";

interface AppContextType {
  widgets: WidgetState<any>[];
  editing: boolean;
  deleting: boolean;
  menuOpen: boolean;

  setWidgets: React.Dispatch<React.SetStateAction<WidgetState<any>[]>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  saveTemplate: () => void;
  loadTemplate: () => boolean;

  addWidget: (type: string) => WidgetState<any>;
  removeWidget: (id: string) => void;
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
  const [deleting, setDeleting] = useState(false);
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

  function addWidget(type: string) {
    if (!Object.keys(WidgetMap).includes(type)) {
      console.error("Invalid widget type");
      return;
    }

    const widget: WidgetState<any> = {
      id: nanoid(6),
      type: type,
      size: { ...WidgetMap[type].size },
      position: { gridX: 0, gridY: 0 },
      settings: { ...WidgetMap[type].settings },
    };

    setWidgets([...widgets, widget]);
    return widget;
  }

  function removeWidget(id: string) {
    setWidgets(widgets.filter((w) => w.id !== id));
  }

  useEffect(() => {
    if (!loadTemplate()) {
      setWidgets(FallbackTemplate);
    }
  }, []);

  return (
    <div
      className={styles.content}
      onClick={(e) => {
        if (e.target === e.currentTarget) setMenuOpen(false);
      }}
    >
      <AppContext.Provider
        value={{
          widgets,
          editing,
          deleting,
          menuOpen,

          setWidgets,
          setEditing,
          setDeleting,
          setMenuOpen,

          saveTemplate,
          loadTemplate,

          addWidget,
          removeWidget,
        }}
      >
        <Header></Header>
        <Grid width={24} height={12}>
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

<<<<<<< HEAD
      <Grid width={24} height={12} editing={editing}>
        <Widget
          size={{ width: 10, height: 1 }}
          position={{ gridX: 7, gridY: 2 }}
        >
          <TestBox></TestBox>
        </Widget>

        <Widget position={{ gridX: 8, gridY: 4 }}>
          <TestBox></TestBox>
        </Widget>

        <Widget
          size={{ width: 1, height: 4 }}
          position={{ gridX: 15, gridY: 4 }}
          resizeable={false}
        >
          <TestBox></TestBox>
        </Widget>
        

        <Widget>
          <MyCalendar3>

          </MyCalendar3>
        </Widget>

        
      </Grid>
=======
        <Menu active={menuOpen}></Menu>
      </AppContext.Provider>
>>>>>>> refs/remotes/origin/main
    </div>
  );
};

export default App;
