import React, { createContext, useEffect, useRef, useState } from "react";
import Widget, { WidgetState } from "./Widget";
import WidgetMap from "./WidgetMap";
import Header from "./Header";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { nanoid } from "nanoid";
import { toPng } from "html-to-image";
import styles from "./App.css";

export interface Template {
  name: string;
  image: string;
  widgets: WidgetState<any>[];
  // settings:
  // theme:
}

interface AppContextType {
  widgets: WidgetState<any>[];
  templates: Template[];
  activeTemplate: number;
  editing: boolean;
  deleting: boolean;
  menuOpen: boolean;

  setWidgets: React.Dispatch<React.SetStateAction<WidgetState<any>[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;

  saveTemplate: (name?: string) => void;
  loadTemplate: (index?: number) => void;

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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTemplate, setActiveTemplate] = useState(0);

  const gridRef = useRef(null);

  async function saveTemplate(name?: string) {
    const template = {
      name: name ?? templates[activeTemplate]?.name ?? "Default",
      image: await toPng(gridRef.current, {
        canvasWidth: 240,
        canvasHeight: 135,
      }),
      widgets: structuredClone(widgets),
    };

    if (name === null || name === undefined) {
      const _templates = [...templates];
      _templates[activeTemplate] = template;
      setTemplates([..._templates]);
    } else {
      setTemplates([...templates, template]);
      setActiveTemplate(templates.length);
    }

    writeTemplates();
  }

  function loadTemplate(index?: number) {
    const i = index ?? activeTemplate;
    if (i >= templates.length) return;
    setWidgets(templates[i].widgets);
    setActiveTemplate(i);
    localStorage.setItem("activeTemplate", JSON.stringify(i));
  }

  function readTemplates() {
    const _templates: Template[] =
      JSON.parse(localStorage.getItem("templates")) ?? [];
    const _activeTemplate: number =
      JSON.parse(localStorage.getItem("activeTemplate")) ?? 0;

    if (_templates.length === 0) {
      _templates.push({
        name: "Default",
        image: null,
        widgets: structuredClone(FallbackTemplate),
      });
    }

    setTemplates(_templates);
    setActiveTemplate(_activeTemplate);

    setWidgets(_templates[_activeTemplate].widgets);
  }

  function writeTemplates() {
    localStorage.setItem("templates", JSON.stringify(templates));
    localStorage.setItem("activeTemplate", JSON.stringify(activeTemplate));
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
    readTemplates();
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
          templates,
          activeTemplate,
          editing,
          deleting,
          menuOpen,

          setWidgets,
          setTemplates,
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
        <Grid width={24} height={12} ref={gridRef}>
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
