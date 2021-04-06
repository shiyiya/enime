import {isRenderer} from "../../../shared/utilities/process";

let electron = require('electron')
import { join } from 'path'

if (isRenderer()) electron = require('@electron/remote')

export default process.env.NODE_ENV !== 'development'
  ? join(process.env.PORTABLE_EXECUTABLE_DIR || electron.app.getPath('userData'), 'appFiles')
  : join(electron.app.getPath('home'), '.enime-test')
