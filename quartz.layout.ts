import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderClickBehavior: "collapse",
      sortFn: (a, b) => {
        if (!a.slugSegment || !b.slugSegment) return 0;

        const pinned = ["about", "journal"];
        const aIndex = pinned.indexOf(a.slugSegment.toLowerCase());
        const bIndex = pinned.indexOf(b.slugSegment.toLowerCase());

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        const inReflections = (node: typeof a) =>
          node.slug?.toLowerCase().startsWith("pages/reflections/");

        if (inReflections(a) && inReflections(b)) {
          return b.slugSegment.localeCompare(a.slugSegment);
        }

        return a.displayName.localeCompare(b.displayName);
      },
      filterFn: (node) => node.name !== "Assets",
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      folderClickBehavior: "collapse",
      sortFn: (a, b) => {
        if (!a.slugSegment || !b.slugSegment) return 0;

        const pinned = ["about", "journal"];
        const aIndex = pinned.indexOf(a.slugSegment.toLowerCase());
        const bIndex = pinned.indexOf(b.slugSegment.toLowerCase());

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        const inReflections = (node: typeof a) =>
          node.slug?.toLowerCase().startsWith("pages/reflections/");

        if (inReflections(a) && inReflections(b)) {
          return b.slugSegment.localeCompare(a.slugSegment);
        }

        return a.displayName.localeCompare(b.displayName);
      },
      filterFn: (node) => node.name !== "Assets",
    }),
  ],
  right: [],
}