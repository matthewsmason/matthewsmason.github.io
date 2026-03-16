import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Matthew Mason",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "matthewmason.blog",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
	theme: {
	  cdnCaching: true,
	  typography: {
		header: "Plus Jakarta Sans",
		body: "Plus Jakarta Sans",
		code: "JetBrains Mono",
	  },
	  colors: {
		lightMode: {
		  light: "#f5f6f8",
		  lightgray: "#dddfe4",
		  gray: "#8b8e96",
		  darkgray: "#2e3338",
		  dark: "#1e1f22",
		  secondary: "#0079d9",
		  tertiary: "#005faa",
		  highlight: "rgba(0, 121, 217, 0.08)",
		},
		darkMode: {
		  light: "#1e1f22",
		  lightgray: "#35383f",
		  gray: "#6b6f7a",
		  darkgray: "#dcdee2",
		  dark: "#f0f1f3",
		  secondary: "#4493f8",
		  tertiary: "#2f7de0",
		  highlight: "rgba(68, 147, 248, 0.1)",
		},
	  },
	},
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
	  Plugin.ObsidianBases(),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
