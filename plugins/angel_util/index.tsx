import { storage } from "@vendetta/plugin";


// External Files
import CNS from './comps/CopyNoShare'
import LPMQOL from './comps/LongPressMessageQOL'

// Functions
function makeDefaults(object, defaults): void {
  if (object != undefined) {
    if (defaults != undefined) {
      for (const key of Object.keys(defaults)) {
        if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
          if (typeof object[key] !== "object") object[key] = {};
          makeDefaults(object[key], defaults[key]);
        } else {
          object[key] ??= defaults[key];
        }
      }
    }
  }
}

makeDefaults(storage, {
  bool: {
    copy_no_share: false,
    lpm_qol: false,
  },
  settings: {
    patch: false
  }
})

const patches = [
  ...CNS,
  ...LPMQOL
];

export const onUnload = () => patches.forEach(p => p());
export { default as settings } from "./pages/Settings";