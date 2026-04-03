import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Local Pantry",
    short_name: "Local Pantry",
    description: "Seasonal groceries from local farms",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ec",
    theme_color: "#2f4635",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
