import { createContext } from "react";

const SettingsContext = createContext<Settings>(null);

interface Settings {}

interface ThemeSettings {}

interface TemplateSettings {}
