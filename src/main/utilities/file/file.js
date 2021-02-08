import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import dir from './dir.js'
import * as path from "path";

function getPath (...paths) {
  return join(
    dir,
    ...paths
  )
}

function getFile (...paths) {
  const path = getPath(...paths)

  return JSON.parse(readFileSync(path, 'utf-8'))
}

function writeFile (data, ...paths) {
  const path = getPath(...paths)
  ensureDirectoryExistence(path);

  writeFileSync(path, JSON.stringify(data), 'utf-8')
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  mkdirSync(dirname);
}

export default {
  getPath,
  getFile,
  writeFile
}
