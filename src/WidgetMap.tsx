import { BatteryWidget } from "./widgets/BatteryWidget";
import { Clock, ClockSettings } from "./widgets/Clock";
import { Notepad } from "./widgets/Notepad";
import { Search, SearchSettings } from "./widgets/Search";
import { Shortcut, ShortcutSettings } from "./widgets/Shortcut";
import { ToDoList } from "./widgets/ToDoList";
import { Weather } from "./widgets/Weather";
//import { CountdownTimer } from "./widgets/TimerW";
import { TimerWidget } from "./widgets/TimerW2";

const WidgetMap = {
  battery: {
    component: BatteryWidget,
    size: { width: 2, height: 1 },
  },

  clock: {
    component: Clock,
    size: { width: 4, height: 2 },
    settings: {
      use24HourClock: false,
      showDate: true,
      showYear: true,
    } satisfies ClockSettings,
  },

  notepad: {
    component: Notepad,
    size: { width: 4, height: 2 },
  },

  search: {
    component: Search,
    resizable: { x: true, y: false },
    size: { width: 8, height: 1 },
    settings: { showIcon: true, showButton: true } satisfies SearchSettings,
  },

  shortcut: {
    component: Shortcut,
    resizable: { x: false, y: false },
    size: { width: 1, height: 1 },
    settings: {
      website: "",
      openInNewTab: false,
    } satisfies ShortcutSettings,
  },

  todo: {
    component: ToDoList,
    size: { width: 4, height: 2 },
  },

  weather: {
    component: Weather,
    size: { width: 6, height: 1 },
  },

  timer: {
    component: TimerWidget,
    //component: CountdownTimer,
    size: { width: 4, height: 1 },
  },
};

export default WidgetMap;
