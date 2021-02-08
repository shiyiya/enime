import { remote } from "electron"
const { app } = remote;
import { join } from 'path'

export default process.env.NODE_ENV !== 'development'
  ? join(process.env.PORTABLE_EXECUTABLE_DIR || app.getPath('userData'), 'appFiles')
  : join(app.getPath('home'), '.enime-test')
