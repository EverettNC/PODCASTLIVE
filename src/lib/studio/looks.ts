export type HostLook = {
  id: string;
  name: string;
  src: string;
  thumb: string;
  note: string;
};

export const HOST_LOOKS: HostLook[] = [
  {
    id: "leather",
    name: "Original",
    src: "/avatar/host.jpg",
    thumb: "/avatar/host-leather-thumb.jpg",
    note: "Cap and scarf",
  },
  {
    id: "tee",
    name: "Black tee",
    src: "/avatar/host-tee.jpg",
    thumb: "/avatar/host-tee-thumb.jpg",
    note: "Floor",
  },
  {
    id: "blazer",
    name: "Blazer",
    src: "/avatar/host-blazer.jpg",
    thumb: "/avatar/host-blazer-thumb.jpg",
    note: "Night",
  },
  {
    id: "knit",
    name: "Burgundy",
    src: "/avatar/host-knit.jpg",
    thumb: "/avatar/host-knit-thumb.jpg",
    note: "Brand",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    src: "/avatar/host-hoodie.jpg",
    thumb: "/avatar/host-hoodie-thumb.jpg",
    note: "Late",
  },
  {
    id: "oxford",
    name: "Oxford",
    src: "/avatar/host-oxford.jpg",
    thumb: "/avatar/host-oxford-thumb.jpg",
    note: "Day",
  },
];

export const DEFAULT_LOOK = "leather";

export function lookById(id: string) {
  return HOST_LOOKS.find((l) => l.id === id) ?? HOST_LOOKS[0];
}
