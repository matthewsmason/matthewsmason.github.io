import { QuartzTransformerPlugin } from "../types"
import { Root, Element } from "hast"
import { visit } from "unist-util-visit"
import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import {
  FilePath,
  FullSlug,
  transformLink,
  slugifyFilePath,
  simplifySlug,
  TransformOptions,
} from "../../util/path"

interface BaseView {
  type: string
  name: string
  filters?: any
  order?: string[]
  sort?: Array<{ property: string; direction: string }>
  limit?: number
  columnSize?: Record<string, number>
}

interface BaseFile {
  properties?: Record<string, any>
  views?: BaseView[]
  formulas?: Record<string, string>
}

interface Options {
  /**
   * Path to the content directory (relative to the quartz root).
   * Defaults to "content".
   */
  contentDir: string
}

const defaultOptions: Options = {
  contentDir: "content",
}

// ────────────────────────────────────────────────────────────────────────────
// Utility: extract display text from any link format
// ────────────────────────────────────────────────────────────────────────────

/**
 * Extract all "display names" (the human-readable text) from a string that
 * may contain wikilinks `[[target|alias]]` and/or markdown links `[text](url)`.
 * Returns an array of display names found.
 */
function extractLinkDisplayNames(str: string): string[] {
  const names: string[] = []

  // Wikilinks: [[target|alias]] or [[target]]
  const wikiRe = /\[\[([^\[\]\|#\\]+)(?:#[^\[\]\|#\\]+)?(?:\|([^\[\]#]*))?\]\]/g
  let m: RegExpExecArray | null
  while ((m = wikiRe.exec(str)) !== null) {
    names.push((m[2] ?? m[1]).trim())
  }

  // Markdown links: [display text](url)
  const mdRe = /\[([^\]]*)\]\([^)]+\)/g
  while ((m = mdRe.exec(str)) !== null) {
    names.push(m[1].trim())
  }

  return names
}

/**
 * Extract all link targets (the file/note being linked to) from a string.
 * For wikilinks: the target path. For markdown links: the basename without extension.
 */
function extractLinkTargets(str: string): string[] {
  const targets: string[] = []

  // Wikilinks: [[target|alias]]
  const wikiRe = /\[\[([^\[\]\|#\\]+)(?:#[^\[\]\|#\\]+)?(?:\|[^\[\]#]*)?\]\]/g
  let m: RegExpExecArray | null
  while ((m = wikiRe.exec(str)) !== null) {
    targets.push(m[1].trim())
  }

  // Markdown links: [text](url)
  const mdRe = /\[([^\]]*)\]\(([^)]+)\)/g
  while ((m = mdRe.exec(str)) !== null) {
    let url = m[2].trim()
    // Decode URL encoding (%20 → space, etc.)
    try {
      url = decodeURIComponent(url)
    } catch {
      // ignore decode errors
    }
    // Get basename without extension
    const basename = path.basename(url, path.extname(url))
    targets.push(basename)
    // Also add the display text as a target for matching
    targets.push(m[1].trim())
  }

  return targets
}

/**
 * Check if a frontmatter value "contains" a given link target.
 * Works with both wikilink and markdown link formats in the frontmatter value.
 */
function valueContainsLink(value: any, linkTarget: string): boolean {
  if (!value) return false
  const valueStr = Array.isArray(value) ? value.join(" ") : String(value)

  // Direct string match
  if (valueStr.includes(linkTarget)) return true

  // Extract all targets from the value and check
  const targets = extractLinkTargets(valueStr)
  const displayNames = extractLinkDisplayNames(valueStr)
  const allNames = [...targets, ...displayNames]

  return allNames.some(
    (name) =>
      name.toLowerCase() === linkTarget.toLowerCase() ||
      name.toLowerCase().includes(linkTarget.toLowerCase()),
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Slugify view names
// ────────────────────────────────────────────────────────────────────────────

function slugifyViewName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ────────────────────────────────────────────────────────────────────────────
// Filter evaluation
// ────────────────────────────────────────────────────────────────────────────

function evaluateFilter(
  filter: string,
  fileSlug: string,
  filePath: string,
  frontmatter: Record<string, any>,
): boolean {
  const trimmed = filter.trim()

  // ── file.folder == "Hardware/Server Boards" ──
  const folderMatch = trimmed.match(/^file\.folder\s*==\s*"(.+)"$/)
  if (folderMatch) {
    const targetFolder = folderMatch[1].replace(/\\/g, "/")
    const fileDir = path.dirname(filePath).replace(/\\/g, "/")
    return fileDir === targetFolder
  }

  // ── file.name == "SomeName" ──
  const nameMatch = trimmed.match(/^file\.name\s*==\s*"(.+)"$/)
  if (nameMatch) {
    const targetName = nameMatch[1]
    const fileName = path.basename(filePath, path.extname(filePath))
    return fileName === targetName
  }

  // ── file.hasTag("tagname") ──
  const tagMatch = trimmed.match(/^file\.hasTag\("(.+)"\)$/)
  if (tagMatch) {
    const tag = tagMatch[1]
    const tags = frontmatter.tags ?? []
    return Array.isArray(tags) ? tags.includes(tag) : false
  }

  // ── file.hasLink("NoteName") ──
  const linkMatch = trimmed.match(/^file\.hasLink\("(.+)"\)$/)
  if (linkMatch) {
    const target = linkMatch[1]
    const allValues = JSON.stringify(frontmatter)
    return allValues.includes(`[[${target}`) || allValues.includes(target)
  }

  // ── .contains(link("Target")) or .contains(link("Target", "alias")) ──
  const containsLinkRegex =
    /^(?:note\["([^"]+)"\]|note\['([^']+)'\]|([a-zA-Z_][\w\s]*))\.contains\(link\("([^"]+)"(?:\s*,\s*"([^"]*)")?\)\)$/
  const containsLinkMatch = trimmed.match(containsLinkRegex)
  if (containsLinkMatch) {
    const prop = (containsLinkMatch[1] ?? containsLinkMatch[2] ?? containsLinkMatch[3])?.trim()
    const linkTarget = containsLinkMatch[4]
    if (!prop) return true
    return valueContainsLink(frontmatter[prop], linkTarget)
  }

  // ── Array equality: prop == [...] ──
  // Handles both bracket-notation and simple property names.
  // The array content may contain wikilinks or markdown links.
  // Examples:
  //   note["run from"] == ["[[OnDemand|od]]"]
  //   platform == ["[Yosemite](../Platforms/Yosemite.md)"]
  const arrayEqRegex =
    /^(?:note\["([^"]+)"\]|note\['([^']+)'\]|([a-zA-Z_][\w\s]*))\s*==\s*\[(.+)\]$/
  const arrayEqMatch = trimmed.match(arrayEqRegex)
  if (arrayEqMatch) {
    const prop = (arrayEqMatch[1] ?? arrayEqMatch[2] ?? arrayEqMatch[3])?.trim()
    const arrayContent = arrayEqMatch[4]
    if (!prop) return true
    const value = frontmatter[prop]
    if (!value) return false
    const valueStr = Array.isArray(value) ? value.join(" ") : String(value)

    // Extract link targets from the filter's array content (both wikilink and markdown)
    const filterTargets = extractLinkTargets(arrayContent)
    const filterDisplayNames = extractLinkDisplayNames(arrayContent)
    const allFilterNames = [...filterTargets, ...filterDisplayNames]

    if (allFilterNames.length === 0) {
      // No links found in the array, do plain string comparison
      const plainContent = arrayContent.replace(/^"(.*)"$/, "$1").trim()
      return valueStr.includes(plainContent)
    }

    // Extract link targets from the frontmatter value
    const valueTargets = extractLinkTargets(valueStr)
    const valueDisplayNames = extractLinkDisplayNames(valueStr)
    const allValueNames = [...valueTargets, ...valueDisplayNames]

    // Check if any filter target matches any value target
    return allFilterNames.some((filterName) =>
      allValueNames.some(
        (valueName) => valueName.toLowerCase() === filterName.toLowerCase(),
      ) || valueStr.toLowerCase().includes(filterName.toLowerCase()),
    )
  }

  // ── Bracket-notation string equality: note["prop"] == "value" ──
  const bracketEqRegex =
    /^(?:note\["([^"]+)"\]|note\['([^']+)'\])\s*==\s*"(.+)"$/
  const bracketEqMatch = trimmed.match(bracketEqRegex)
  if (bracketEqMatch) {
    const prop = (bracketEqMatch[1] ?? bracketEqMatch[2])?.trim()
    const target = bracketEqMatch[3]
    if (!prop) return true
    const value = frontmatter[prop]
    return String(value) === target
  }

  // ── Bracket-notation string inequality: note["prop"] != "value" ──
  const bracketNeqRegex =
    /^(?:note\["([^"]+)"\]|note\['([^']+)'\])\s*!=\s*"(.+)"$/
  const bracketNeqMatch = trimmed.match(bracketNeqRegex)
  if (bracketNeqMatch) {
    const prop = (bracketNeqMatch[1] ?? bracketNeqMatch[2])?.trim()
    const target = bracketNeqMatch[3]
    if (!prop) return true
    const value = frontmatter[prop]
    return String(value) !== target
  }

  // ── Simple property equality: prop == "value" ──
  const eqMatch = trimmed.match(/^([a-zA-Z_][\w\s]*)\s*==\s*"(.+)"$/)
  if (eqMatch) {
    const prop = eqMatch[1].trim()
    const target = eqMatch[2]
    const value = frontmatter[prop]
    return String(value) === target
  }

  // ── Simple property inequality: prop != "value" ──
  const neqMatch = trimmed.match(/^([a-zA-Z_][\w\s]*)\s*!=\s*"(.+)"$/)
  if (neqMatch) {
    const prop = neqMatch[1].trim()
    const target = neqMatch[2]
    const value = frontmatter[prop]
    return String(value) !== target
  }

  // Default: pass the filter if we can't parse it
  console.warn(`[ObsidianBases] Unrecognized filter expression, passing by default: "${trimmed}"`)
  return true
}

function evaluateFilters(
  filters: any,
  fileSlug: string,
  filePath: string,
  frontmatter: Record<string, any>,
): boolean {
  if (!filters) return true

  if (typeof filters === "string") {
    return evaluateFilter(filters, fileSlug, filePath, frontmatter)
  }

  if (filters.and) {
    return filters.and.every((f: any) =>
      typeof f === "string"
        ? evaluateFilter(f, fileSlug, filePath, frontmatter)
        : evaluateFilters(f, fileSlug, filePath, frontmatter),
    )
  }

  if (filters.or) {
    return filters.or.some((f: any) =>
      typeof f === "string"
        ? evaluateFilter(f, fileSlug, filePath, frontmatter)
        : evaluateFilters(f, fileSlug, filePath, frontmatter),
    )
  }

  if (filters.not) {
    return !filters.not.every((f: any) =>
      typeof f === "string"
        ? evaluateFilter(f, fileSlug, filePath, frontmatter)
        : evaluateFilters(f, fileSlug, filePath, frontmatter),
    )
  }

  return true
}

// ────────────────────────────────────────────────────────────────────────────
// Resolve frontmatter values to HAST (handles both wikilinks and md links)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a frontmatter value that may contain wikilinks and/or markdown-style
 * links into HAST nodes with proper <a> elements.
 *
 * Supported formats:
 *   - Wikilinks:     [[Target]], [[Target|Alias]], [[Path/Target|Alias]]
 *   - Markdown links: [Display Text](../path/to/file.md), [Text](slug)
 *   - Mixed:         [[Foo]], [Bar](../Bar.md), plain text
 */
function resolveValueToHast(
  value: any,
  currentSlug: FullSlug,
  allSlugs: FullSlug[],
): Element | import("hast").Text {
  if (value === null || value === undefined) {
    return { type: "text", value: "" }
  }

  const str = Array.isArray(value) ? value.join(", ") : String(value)

  // Combined regex that matches EITHER a wikilink OR a markdown link.
  // Wikilink: [[target#header|alias]]
  // Markdown: [display](url)
  // We process them in order of appearance.
  const combinedRegex =
    /\[\[([^\[\]\|#\\]+)(?:#[^\[\]\|#\\]+)?(?:\|([^\[\]#]*))?\]\]|\[([^\]]*)\]\(([^)]+)\)/g

  const children: (Element | import("hast").Text)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = combinedRegex.exec(str)) !== null) {
    // Add any text before this match
    const prevText = str.substring(lastIndex, match.index)
    if (prevText) {
      children.push({ type: "text", value: prevText })
    }

    if (match[1] !== undefined) {
      // ── Wikilink match ──
      const fp = match[1].trim()
      const alias = match[2]?.trim()
      const transformOpts: TransformOptions = {
        strategy: "shortest",
        allSlugs,
      }
      const url = transformLink(currentSlug, fp, transformOpts)

      children.push({
        type: "element",
        tagName: "a",
        properties: { href: url, className: ["internal"] },
        children: [{ type: "text", value: alias ?? fp }],
      })
    } else if (match[3] !== undefined) {
      // ── Markdown link match ──
      const displayText = match[3].trim()
      let rawUrl = match[4].trim()

      // Decode URL encoding (%20 → space, etc.)
      try {
        rawUrl = decodeURIComponent(rawUrl)
      } catch {
        // ignore decode errors
      }

      // Remove .md extension if present, then use transformLink to resolve
      const cleanUrl = rawUrl.replace(/\.md$/, "")
      // Extract just the basename for slug resolution (strip relative path segments)
      const slugTarget = cleanUrl.includes("/")
        ? path.basename(cleanUrl)
        : cleanUrl

      const transformOpts: TransformOptions = {
        strategy: "shortest",
        allSlugs,
      }
      const resolvedUrl = transformLink(currentSlug, slugTarget, transformOpts)

      children.push({
        type: "element",
        tagName: "a",
        properties: { href: resolvedUrl, className: ["internal"] },
        children: [{ type: "text", value: displayText }],
      })
    }

    lastIndex = match.index + match[0].length
  }

  const remainingText = str.substring(lastIndex)
  if (remainingText) {
    children.push({ type: "text", value: remainingText })
  }

  if (children.length === 0) {
    return { type: "text", value: str }
  }

  if (children.length === 1) {
    return children[0]
  }

  return {
    type: "element",
    tagName: "span",
    properties: {},
    children,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Property value extraction
// ────────────────────────────────────────────────────────────────────────────

function getPropertyValue(
  property: string,
  filePath: string,
  frontmatter: Record<string, any>,
): any {
  if (property === "file.name") {
    return path.basename(filePath, path.extname(filePath))
  }
  if (property === "file.folder") {
    return path.dirname(filePath)
  }
  if (property === "file.ext") {
    return path.extname(filePath)
  }
  if (property === "file.tags") {
    const tags = frontmatter.tags ?? []
    return Array.isArray(tags) ? tags.join(", ") : String(tags)
  }
  // Strip "note." prefix if present
  const prop = property.startsWith("note.") ? property.slice(5) : property
  return frontmatter[prop]
}

// ────────────────────────────────────────────────────────────────────────────
// Build the HAST table for a given base view
// ────────────────────────────────────────────────────────────────────────────

function buildBaseTable(
  baseFilePath: string,
  viewSlug: string,
  currentSlug: FullSlug,
  allSlugs: FullSlug[],
  contentDir: string,
): Element | null {
  try {
    const baseContent = fs.readFileSync(baseFilePath, "utf-8")
    const baseData = yaml.load(baseContent) as BaseFile

    if (!baseData?.views || baseData.views.length === 0) return null

    // Find the matching view
    let view: BaseView | undefined
    if (!viewSlug) {
      view = baseData.views[0]
    } else {
      view = baseData.views.find(
        (v) => slugifyViewName(v.name) === viewSlug.toLowerCase(),
      )
    }

    if (!view) {
      console.warn(
        `[ObsidianBases] No matching view for slug "${viewSlug}" in ${baseFilePath}. ` +
          `Available views: ${baseData.views.map((v) => `"${v.name}" (slug: "${slugifyViewName(v.name)}")`).join(", ")}`,
      )
      return null
    }

    const allFiles = collectAllFiles(contentDir)

    const matchingFiles = allFiles.filter((f) =>
      evaluateFilters(view!.filters, f.slug, f.relativePath, f.frontmatter),
    )

    if (view.sort) {
      matchingFiles.sort((a, b) => {
        for (const sortRule of view!.sort!) {
          const prop = sortRule.property
          const dir = sortRule.direction === "DESC" ? -1 : 1
          const aVal = String(
            getPropertyValue(prop, a.relativePath, a.frontmatter) ?? "",
          )
          const bVal = String(
            getPropertyValue(prop, b.relativePath, b.frontmatter) ?? "",
          )
          const cmp = aVal.localeCompare(bVal)
          if (cmp !== 0) return cmp * dir
        }
        return 0
      })
    }

    const limitedFiles = view.limit
      ? matchingFiles.slice(0, view.limit)
      : matchingFiles

    const columns = view.order ?? ["file.name"]

    const displayNames: Record<string, string> = {}
    if (baseData.properties) {
      for (const [key, val] of Object.entries(baseData.properties)) {
        if (val && typeof val === "object" && val.displayName) {
          displayNames[key] = val.displayName
        }
      }
    }

    const headerCells: Element[] = columns.map((col) => ({
      type: "element",
      tagName: "th",
      properties: {},
      children: [
        {
          type: "text",
          value: displayNames[col] ?? col.replace(/^(note\.|file\.)/, ""),
        },
      ],
    }))

    const headerRow: Element = {
      type: "element",
      tagName: "tr",
      properties: {},
      children: headerCells,
    }

    const bodyRows: Element[] = limitedFiles.map((f) => {
      const cells: Element[] = columns.map((col) => {
        if (col === "file.name") {
          const fileName = path.basename(
            f.relativePath,
            path.extname(f.relativePath),
          )
          const fileSlug = slugifyFilePath(f.relativePath as FilePath)
          const url = transformLink(currentSlug, simplifySlug(fileSlug), {
            strategy: "shortest",
            allSlugs,
          })
          return {
            type: "element" as const,
            tagName: "td",
            properties: {},
            children: [
              {
                type: "element" as const,
                tagName: "a",
                properties: { href: url, className: ["internal"] },
                children: [{ type: "text" as const, value: fileName }],
              },
            ],
          }
        }

        const cellValue = getPropertyValue(col, f.relativePath, f.frontmatter)
        const resolvedValue = resolveValueToHast(cellValue, currentSlug, allSlugs)

        return {
          type: "element" as const,
          tagName: "td",
          properties: {},
          children: [resolvedValue],
        }
      })

      return {
        type: "element" as const,
        tagName: "tr",
        properties: {},
        children: cells,
      }
    })

    const table: Element = {
      type: "element",
      tagName: "table",
      properties: { className: ["base-table"] },
      children: [
        {
          type: "element",
          tagName: "thead",
          properties: {},
          children: [headerRow],
        },
        {
          type: "element",
          tagName: "tbody",
          properties: {},
          children: bodyRows,
        },
      ],
    }

    const wrapper: Element = {
      type: "element",
      tagName: "div",
      properties: { className: ["base-table-wrapper"] },
      children: [
        {
          type: "element",
          tagName: "p",
          properties: { className: ["base-table-caption"] },
          children: [
            {
              type: "text",
              value: `${view.name} (${limitedFiles.length} results)`,
            },
          ],
        },
        table,
      ],
    }

    return wrapper
  } catch (e) {
    console.warn(
      `[ObsidianBases] Failed to process base file: ${baseFilePath}`,
      e,
    )
    return null
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Parse markdown-format .base src attributes
// ────────────────────────────────────────────────────────────────────────────

function parseBaseSrc(src: string): { baseName: string; viewSlug: string } | null {
  const hashIndex = src.indexOf("#")
  let urlPart: string
  let fragment: string
  if (hashIndex >= 0) {
    urlPart = src.substring(0, hashIndex)
    fragment = src.substring(hashIndex + 1)
  } else {
    urlPart = src
    fragment = ""
  }

  if (!urlPart.endsWith(".base")) return null

  const baseName = urlPart.split("/").pop() ?? urlPart

  const viewSlug = fragment
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return { baseName, viewSlug }
}

// ────────────────────────────────────────────────────────────────────────────
// Main plugin
// ────────────────────────────────────────────────────────────────────────────

export const ObsidianBases: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "ObsidianBases",
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree: Root, file) => {
            const currentSlug = file.data.slug!
            const allSlugs = ctx.allSlugs
            const contentDir = path.resolve(opts.contentDir)

            visit(tree, "element", (node, index, parent) => {
              // ─── Case 1: Wikilink-style transclusion ───
              if (
                node.tagName === "blockquote" &&
                node.properties?.className &&
                (node.properties.className as string[]).includes("transclude")
              ) {
                const dataUrl = node.properties.dataUrl as string
                if (!dataUrl || !dataUrl.endsWith(".base")) return

                const dataBlock = (node.properties.dataBlock as string) ?? ""
                const viewSlug = dataBlock.replace(/^#/, "")

                const baseFilePath = findBaseFile(contentDir, dataUrl)
                if (!baseFilePath) {
                  console.warn(`[ObsidianBases] Could not find base file for: ${dataUrl}`)
                  return
                }

                const wrapper = buildBaseTable(baseFilePath, viewSlug, currentSlug, allSlugs, contentDir)
                if (wrapper && parent && index !== undefined) {
                  parent.children[index] = wrapper as any
                }
                return
              }

              // ─── Case 2: Markdown-style embed as <img> ───
              if (node.tagName === "img") {
                const src = node.properties?.src as string
                if (!src) return

                const parsed = parseBaseSrc(src)
                if (!parsed) return

                const baseFilePath = findBaseFile(contentDir, parsed.baseName)
                if (!baseFilePath) {
                  console.warn(`[ObsidianBases] Could not find base file for: ${src}`)
                  return
                }

                const wrapper = buildBaseTable(baseFilePath, parsed.viewSlug, currentSlug, allSlugs, contentDir)
                if (wrapper && parent && index !== undefined) {
                  parent.children[index] = wrapper as any
                }
                return
              }

              // ─── Case 3: Markdown-style embed wrapped in <p> ───
              if (node.tagName === "p" && node.children?.length === 1) {
                const child = node.children[0]
                if (
                  child.type === "element" &&
                  child.tagName === "img"
                ) {
                  const src = child.properties?.src as string
                  if (!src) return

                  const parsed = parseBaseSrc(src)
                  if (!parsed) return

                  const baseFilePath = findBaseFile(contentDir, parsed.baseName)
                  if (!baseFilePath) {
                    console.warn(`[ObsidianBases] Could not find base file for: ${src}`)
                    return
                  }

                  const wrapper = buildBaseTable(baseFilePath, parsed.viewSlug, currentSlug, allSlugs, contentDir)
                  if (wrapper && parent && index !== undefined) {
                    parent.children[index] = wrapper as any
                  }
                  return
                }
              }

              // ─── Case 4: Markdown-style as <a> link ───
              if (node.tagName === "a") {
                const href = node.properties?.href as string
                if (!href) return

                const parsed = parseBaseSrc(href)
                if (!parsed) return

                const baseFilePath = findBaseFile(contentDir, parsed.baseName)
                if (!baseFilePath) return

                const wrapper = buildBaseTable(baseFilePath, parsed.viewSlug, currentSlug, allSlugs, contentDir)
                if (wrapper && parent && index !== undefined) {
                  parent.children[index] = wrapper as any
                }
                return
              }
            })
          }
        },
      ]
    },
  }
}

// ────────────────────────────────────────────────────────────────────────────
// File system helpers
// ────────────────────────────────────────────────────────────────────────────

function findBaseFile(contentDir: string, slugifiedName: string): string | null {
  const nameOnly = slugifiedName.split("/").pop() ?? slugifiedName
  const targetBase = nameOnly.replace(/\.base$/, "")

  function searchDir(dir: string): string | null {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          const found = searchDir(fullPath)
          if (found) return found
        } else if (entry.name.endsWith(".base")) {
          const baseName = entry.name.replace(/\.base$/, "")
          const slugified = baseName.replace(/\s/g, "-").replace(/&/g, "-and-")
          if (slugified.toLowerCase() === targetBase.toLowerCase()) {
            return fullPath
          }
        }
      }
    } catch {
      // ignore permission errors
    }
    return null
  }

  return searchDir(contentDir)
}

interface FileInfo {
  slug: string
  relativePath: string
  frontmatter: Record<string, any>
}

function collectAllFiles(contentDir: string): FileInfo[] {
  const files: FileInfo[] = []

  function scanDir(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          scanDir(fullPath)
        } else if (entry.name.endsWith(".md")) {
          try {
            const content = fs.readFileSync(fullPath, "utf-8")
            const frontmatter = extractFrontmatter(content)
            const relativePath = path.relative(contentDir, fullPath).replace(/\\/g, "/")
            const slug = slugifyFilePath(relativePath as FilePath)
            files.push({ slug, relativePath, frontmatter })
          } catch {
            // skip files that can't be read
          }
        }
      }
    } catch {
      // ignore permission errors
    }
  }

  scanDir(contentDir)
  return files
}

function extractFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  try {
    return (yaml.load(match[1]) as Record<string, any>) ?? {}
  } catch {
    return {}
  }
}
