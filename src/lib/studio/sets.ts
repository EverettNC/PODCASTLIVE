export const DEFAULT_INTRO = "/backdrop/intro.png";

/** The standing set behind the three seats. Everett's three versions; Standing is the default. */
export const SET_BACKDROPS = [
  { id: "standing", label: "Standing", src: "/backdrop/FNTA_Backdrop_Standing_1920x1080.png" },
  { id: "logo", label: "Logo", src: "/backdrop/FNTA_Backdrop_Standing_Logo_1920x1080.png" },
  { id: "bright", label: "Bright", src: "/backdrop/FNTA_Backdrop_Standing_Bright_1920x1080.png" },
] as const;
export const DEFAULT_SHOW = SET_BACKDROPS[0].src;
