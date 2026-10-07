#!/usr/bin/env node
// Builds Quartz's content/ folder from the Obsidian vault without touching the vault.
// Publishes: everything in Journal/ (at the site root), plus only the attachments
// and bases that Journal notes actually link or embed. Diary/ and Templates are never copied.
//
// Usage: node scripts/sync-content.mjs [outDir]   (default: ./content)

import fs from "node:fs"
import path from "node:path"

const VAULT = path.resolve(import.meta.dirname, "../../Personal Vault")
const JOURNAL = path.join(VAULT, "Journal")
const ATTACHMENTS = path.join(VAULT, "Assets/Attachments")
const BASES = path.join(VAULT, "Assets/Bases")
const OUT = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, "../content"))

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith(".")) return []
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  // keep mtimes so "last modified" dates on the site stay accurate
  const { atime, mtime } = fs.statSync(src)
  fs.utimesSync(dest, atime, mtime)
}

// Index a folder by file name so [[name.ext]] links resolve the way Obsidian does
function indexByName(dir) {
  const map = new Map()
  for (const f of fs.existsSync(dir) ? walk(dir) : []) {
    const name = path.basename(f)
    if (map.has(name)) console.warn(`! duplicate file name, using first: ${name}`)
    else map.set(name, f)
  }
  return map
}

// Safety: never delete through a symlink (content/ used to point at the vault itself)
if (fs.existsSync(OUT)) {
  if (fs.lstatSync(OUT).isSymbolicLink()) {
    console.error(`${OUT} is a symlink. Remove it first (rm content), then re-run.`)
    process.exit(1)
  }
  fs.rmSync(OUT, { recursive: true })
}

const notes = walk(JOURNAL)
for (const f of notes) copy(f, path.join(OUT, path.relative(JOURNAL, f)))

// Collect link targets: [[target#x|alias]], ![[...]], and [text](target)
const targets = new Set()
for (const f of notes.filter((f) => f.endsWith(".md"))) {
  const text = fs.readFileSync(f, "utf8")
  for (const m of text.matchAll(/!?\[\[([^\]|#]+)/g)) targets.add(m[1].trim())
  for (const m of text.matchAll(/\]\(([^)\s#]+)/g)) {
    if (!/^[a-z]+:/i.test(m[1])) targets.add(decodeURIComponent(m[1]).trim())
  }
}

const attachments = indexByName(ATTACHMENTS)
const bases = indexByName(BASES)
const copied = []
for (const t of targets) {
  const name = path.basename(t)
  if (attachments.has(name)) {
    const src = attachments.get(name)
    copy(src, path.join(OUT, "Assets/Attachments", path.relative(ATTACHMENTS, src)))
    copied.push(name)
  } else if (bases.has(name)) {
    // Vault paths include "Journal/", but Journal is the site root here
    const src = bases.get(name)
    const dest = path.join(OUT, "Assets/Bases", path.relative(BASES, src))
    copy(src, dest)
    const text = fs.readFileSync(dest, "utf8").replace(/(file\.folder\s*==\s*")Journal\//g, "$1")
    fs.writeFileSync(dest, text)
    copied.push(name)
  } else if (/\.[A-Za-z0-9]{1,5}$/.test(name) && !name.endsWith(".md")) {
    console.warn(`! linked file not found in Assets: ${t}`)
  }
}

console.log(`Copied ${notes.length} Journal files and ${copied.length} attachments/bases to ${OUT}`)
for (const name of copied.sort()) console.log(`  + ${name}`)
