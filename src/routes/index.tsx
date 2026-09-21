import { createFileRoute } from "@tanstack/react-router";
import { EveningApp } from "@/components/evening-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Evening" },
      { name: "description", content: "ערב אינטימי של קרבה, מתח ומשחק לזוגות." },
      { property: "og:title", content: "Evening" },
      { property: "og:description", content: "ערב אינטימי של קרבה, מתח ומשחק לזוגות." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EveningApp,
});