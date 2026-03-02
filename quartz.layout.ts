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
		  if (!a.name || !b.name) return 0;

		  const pinned = ["about", "journal"];
		  const aIndex = pinned.indexOf(a.name.toLowerCase());
		  const bIndex = pinned.indexOf(b.name.toLowerCase());

		  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
		  if (aIndex !== -1) return -1;
		  if (bIndex !== -1) return 1;

		  // Custom order for Notes subfolders only (depth 2 = inside Notes)
		  if (a.depth === 2 && b.depth === 2) {
			const notesOrder: Record<string, number> = {
			  reflections: 0,
			  pages: 1,
			  entries: 2,
			};
			const aSubIndex = notesOrder[a.name.toLowerCase()] ?? 999;
			const bSubIndex = notesOrder[b.name.toLowerCase()] ?? 999;
			if (aSubIndex !== bSubIndex) return aSubIndex - bSubIndex;
		  }

		  return a.name.localeCompare(b.name);
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

// components for pages that display lists of pages  (e.g. tags or folders)
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
		  if (!a.name || !b.name) return 0;

		  const pinned = ["about", "journal"];
		  const aIndex = pinned.indexOf(a.name.toLowerCase());
		  const bIndex = pinned.indexOf(b.name.toLowerCase());

		  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
		  if (aIndex !== -1) return -1;
		  if (bIndex !== -1) return 1;

		  // Custom order for Notes subfolders only (depth 2 = inside Notes)
		  if (a.depth === 2 && b.depth === 2) {
			const notesOrder: Record<string, number> = {
			  reflections: 0,
			  pages: 1,
			  entries: 2,
			};
			const aSubIndex = notesOrder[a.name.toLowerCase()] ?? 999;
			const bSubIndex = notesOrder[b.name.toLowerCase()] ?? 999;
			if (aSubIndex !== bSubIndex) return aSubIndex - bSubIndex;
		  }

		  return a.name.localeCompare(b.name);
		},
		filterFn: (node) => node.name !== "Assets",
	}),
  ],
  right: [],
}
