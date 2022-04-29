import { app } from 'electron';
import { restoreOrCreateWindow } from './window';
import Application from './app';
import { getResource } from './helper';
import { getPluginEntry } from './helper/mpv';

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
    app.quit();
    process.exit(0);
}

const application: Application = new Application();

app.on("second-instance", restoreOrCreateWindow);

app.on("window-all-closed", () => {
    application.stop();

    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.commandLine.appendSwitch("enable-webgl");
app.commandLine.appendSwitch("disable-web-security");
app.commandLine.appendSwitch("enable-npapi");
app.commandLine.appendSwitch("force_high_performance_gpu");
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("ignore-gpu-blacklist");

const pluginDir = getResource("./library/mpv");
if (process.platform !== "linux") process.chdir(pluginDir);

app.commandLine.appendSwitch(
    'register-pepper-plugins',
    getPluginEntry(pluginDir)
);

app.on("activate", restoreOrCreateWindow);
app.whenReady().then(() => {
    application.start();

    restoreOrCreateWindow();
});

if (import.meta.env.DEV) {
    /*
    app.whenReady()
        .then(() => import("electron-devtools-installer"))
        .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
            loadExtensionOptions: {
                allowFileAccess: true,
            },
        }))
        .catch(e => console.error('Failed install extension:', e));
     */
}

/*
if (process.env.PROD) {
    app.whenReady()
        .then(() => import("electron-updater"))
        .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) => console.error('Failed check updates:', e));
}
 */