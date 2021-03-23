import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import dir from './dir.js'
import * as path from "path";

export function getPath (...paths) {
  return join(
    dir,
    ...paths
  )
}

export function exists(...paths) {
  return existsSync(getPath(...paths));
}

export function getFile (...paths) {
  const path = getPath(...paths)

  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function writeFile (data, ...paths) {
  const path = getPath(...paths)
  ensureDirectoryExistence(path);

  writeFileSync(path, JSON.stringify(data), 'utf-8')
}

export function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (existsSync(dirname))
    return true;
  ensureDirectoryExistence(dirname);
  mkdirSync(dirname);
}
