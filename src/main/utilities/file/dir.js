import * as electron from "electron"
const app = electron.remote ? electron.remote.app : electron.app;
import { join } from 'path'

export default process.env.NODE_ENV !== 'development'
  ? join(process.env.PORTABLE_EXECUTABLE_DIR || app.getPath('userData'), 'appFiles')
  : join(app.getPath('home'), '.enime-test')
