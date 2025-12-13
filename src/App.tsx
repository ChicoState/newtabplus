import React, { createContext, useEffect, useRef, useState } from "react";
import Widget, { WidgetState } from "./Widget";
import WidgetMap from "./WidgetMap";
import Header from "./Header";
import Menu from "./Menu";
import { Grid } from "./Grid";
import { nanoid } from "nanoid";
import { toPng } from "html-to-image";
import styles from "./App.css";
import OpeningTheme from "./themeOpenPage";

export interface Template {
  name: string;
  image: string;
  widgets: WidgetState<any>[];
  pinned: boolean;
  // settings:
  // theme:
}

interface AppContextType {
  widgets: WidgetState<any>[];
  templates: Template[];
  activeTemplate: number;
  editing: boolean;
  deleting: boolean;
  hidden: boolean;
  menuOpen: boolean;
  theme: 'light' | 'dark';

  setWidgets: React.Dispatch<React.SetStateAction<WidgetState<any>[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;

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
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  let [widgets, setWidgets] = useState<WidgetState<any>[]>([]);
  let [templates, setTemplates] = useState<Template[]>([]);
  let [activeTemplate, setActiveTemplate] = useState(0);
  const [openingTheme, setOpeningTheme] = useState(() => {
    const completed = localStorage.getItem("theme_setup_completed");
    return completed !== "true";
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const gridRef = useRef(null);

  async function saveTemplate(name?: string) {
    try {
      const templateWithoutImage = {
        name: name ?? templates[activeTemplate]?.name ?? "Default",
        image: null,
        widgets: structuredClone(widgets),
        pinned: false,
      };

      let _templates: Template[];
      let _activeTemplate: number;

      if (name === null || name === undefined) {
        _templates = [...templates];
        _templates[activeTemplate] = templateWithoutImage;
        _activeTemplate = activeTemplate;
      } else {
        _templates = [...templates, templateWithoutImage];
        _activeTemplate = templates.length;
      }

      localStorage.setItem("templates", JSON.stringify(_templates));
      localStorage.setItem("activeTemplate", JSON.stringify(_activeTemplate));

      templates = _templates;
      activeTemplate = _activeTemplate;
      setTemplates(templates);
      if (name !== null && name !== undefined) {
        setActiveTemplate(activeTemplate);
      }

      try {
        const image = await toPng(gridRef.current, {
          canvasWidth: 240,
          canvasHeight: 135,
        });

        _templates[_activeTemplate].image = image;
        templates = _templates;
        localStorage.setItem("templates", JSON.stringify(templates));
        setTemplates([...templates]);
      } catch (screenshotError) {
        console.warn("Screenshot failed, but template was saved:", screenshotError);
      }
    } catch (error) {
      console.error("Error in saveTemplate:", error);
    }
  }

  function loadTemplate(index?: number) {
    const i = index ?? activeTemplate;
    if (i >= templates.length) return;

    widgets = structuredClone(templates[i].widgets);
    activeTemplate = i;
    setWidgets(widgets);
    setActiveTemplate(activeTemplate);
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
        pinned: false,
      });
    }

    templates = _templates;
    activeTemplate = _activeTemplate;
    setTemplates(templates);
    setActiveTemplate(activeTemplate);

    widgets = _templates[_activeTemplate].widgets;
    setWidgets(widgets);
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

    const blurAmount = localStorage.getItem("theme_blurAmount");
    if (blurAmount !== null) {
      document.documentElement.style.setProperty('--blur-amount', `${blurAmount}px`);
    }

    const selectedFont = localStorage.getItem("theme_font");
    if (selectedFont && selectedFont !== "") {
      document.documentElement.style.setProperty('--app-font', selectedFont);
    }

    const lightMode = localStorage.getItem("theme_lightMode");
    if (lightMode === "true") {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []);

  if (openingTheme) {
    return <OpeningTheme onContinue={() => {
      setOpeningTheme(false);
      localStorage.setItem("theme_setup_completed", "true");

      const blurAmount = localStorage.getItem("theme_blurAmount");
      if (blurAmount !== null) {
        document.documentElement.style.setProperty('--blur-amount', `${blurAmount}px`);
      }

      const lightMode = localStorage.getItem("theme_lightMode");
      if (lightMode === "true") {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    }} />;
  }

  return (
    <div
      className={`${styles.content} ${theme === 'light' ? 'lightMode' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setMenuOpen(false);
          setHidden(false);
        }
      }}
    >
      <AppContext.Provider
        value={{
          widgets,
          templates,
          activeTemplate,
          editing,
          deleting,
          hidden,
          menuOpen,
          theme,

          setWidgets,
          setTemplates,
          setEditing,
          setDeleting,
          setHidden,
          setMenuOpen,
          setTheme,

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
            if (!map) return null;
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
