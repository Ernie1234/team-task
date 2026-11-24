import type { AppearanceType } from "../validation/user";

/** Personal appearance: colour theme, light/dark mode, font, text size, corners */
export type Appearance = AppearanceType;
export type Mode = Appearance["mode"];
export type Radius = Appearance["radius"];
