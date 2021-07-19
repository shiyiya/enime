import { app } from 'electron';
import serve from 'electron-serve';
import { logger, createWindow } from './helpers';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const installExtensions = async () => {
  const devToolsInstaller = await import('electron-devtools-installer');

  const installExtension = devToolsInstaller.default, { REACT_DEVELOPER_TOOLS, /*REDUX_DEVTOOLS*/ } = devToolsInstaller;
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  return installExtension([REACT_DEVELOPER_TOOLS/*, REDUX_DEVTOOLS*/], {
    forceDownload,
    loadExtensionOptions: {
      allowFileAccess: true
    }
  })
}

const getAppIcon = () => {
  switch (process.platform) {
    case 'win32':
      return path.join(RESOURCES_PATH, 'icon.ico');
    case 'darwin':
      return path.join(RESOURCES_PATH, 'icon.icns');
    default:
      return path.join(RESOURCES_PATH, 'icon.png');
  }
}

(async () => {
  await app.whenReady();

  logger.log('Creating main window...');

  const mainWindow = createWindow('main', {
    autoHideMenuBar: true,
    useContentSize: process.platform !== 'linux',
    title: 'Enime',
    icon: getAppIcon(),
    webPreferences: {
      plugins: true,
      enableRemoteModule: true,
      nodeIntegrationInSubFrames: true,
      worldSafeExecuteJavaScript: false,
      webSecurity: false
    }
  });

  logger.log('Window created.');

  if (isProd) {
    await (async () => {
      (await import('source-map-support')).install();
    })()

    await mainWindow.loadURL('app://./home.html');
  } else {
    logger.log('Installing extensions...');

    await installExtensions();

    logger.log('Extensions installed.');

    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
