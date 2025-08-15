import { lazy, Suspense } from "react";

const modules = {
  App: lazy(() => import("./app/App")),
  Agenda: lazy(() => import("./agenda/Agenda")),
  InfoPage: lazy(() => import("./info_page/InfoPage")),
  Groups: lazy(() => import("./groups/Groups")),
  Contact: lazy(() => import("./contact/Contact")),
  Downloads: lazy(() => import("./downloads/Downloads")),
  People: lazy(() => import("./people/People")),
  Success: lazy(() => import("./contact/Success")),
};

export default function Split({ module }: { module: keyof typeof modules }) {
  const Module = modules[module];
  return (
    <Suspense fallback={<article aria-busy={true}>loading</article>}>
      <Module />
    </Suspense>
  );
}
