/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const development = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  development
) {
  require('electron-debug')();
}

import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from '@nadeshikon/electron-devtools-installer';

const installExtensions = async () => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  return installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
    forceDownload,
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })
    .then(console.log)
    .catch(console.log);
};

// @ts-ignore
import { getPluginEntry } from 'mpv.js-vanilla';

let os;
// eslint-disable-next-line default-case
switch (process.platform) {
  case 'darwin':
    os = 'mac';
    break;
  case 'win32':
    os = 'win';
    break;
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const pluginDir = path.join(RESOURCES_PATH, "libraries", 'mpv', os);
console.log(pluginDir);
// See pitfalls section for details.
if (process.platform !== 'linux') {
  process.chdir(pluginDir);
}

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

// Fix for latest Electron.
app.commandLine.appendSwitch('no-sandbox');
// To support a broader number of systems.
app.commandLine.appendSwitch('ignore-gpu-blacklist');

app.commandLine.appendSwitch(
  'register-pepper-plugins',
  getPluginEntry(pluginDir)
);

const getAssetPath = paths => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (development) await installExtensions();

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    useContentSize: process.platform !== "linux",
    title: "Enime",
    show: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
      enableRemoteModule: true
    },
  });

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

import * as discordRpc from "../src/main/services/presence/discord-rpc";
discordRpc.start();

import {getHandlers, register} from "./main/services/ipc/ipc-handler";
import RecentReleases from "./main/services/ipc/impl/recent-releases";
import PresenceStatus from "./main/services/ipc/impl/presence-status";
register(new RecentReleases());
register(new PresenceStatus());

for (let [channel, func] of Object.entries(getHandlers())) {
  ipcMain.handle(channel, async (event, data) => {
    return await func(event, data);
  })
}

import * as torrentStream from "./main/services/stream/torrent/stream-torrent";
torrentStream.start();

import * as stateStorage from "./shared/storage/state-storage";
global.store = stateStorage.configureStore(null, 'main');
