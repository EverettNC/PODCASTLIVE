/** Voice ids the mill accepts, as the Deck lists them. */
export const VOICES = [
  { id: "helix", label: "Helix", note: "Bold commentary" },
  { id: "kepler", label: "Kepler", note: "Charismatic" },
  { id: "castor", label: "Castor", note: "Down to earth" },
  { id: "orion", label: "Orion", note: "Cinematic" },
  { id: "perseus", label: "Perseus", note: "Confident" },
  { id: "leo", label: "Leo", note: "Authoritative" },
  { id: "rex", label: "Rex", note: "Clear" },
  { id: "ursa", label: "Ursa", note: "Warm podcast" },
  { id: "lumen", label: "Lumen", note: "Articulate" },
  { id: "eve", label: "Eve", note: "Energetic" },
  { id: "atlas", label: "Atlas", note: "Commanding" },
  { id: "sal", label: "Sal", note: "Smooth" },
] as const;

export const DEFAULT_VOICE = "helix";
