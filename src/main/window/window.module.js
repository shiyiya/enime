import { Module, Logger } from '@nestjs/common';
import { app, BrowserWindow } from 'electron';
import { join, resolve } from 'path';
import { GlobalService } from '../global/global.service';
import fs from 'fs';

const PLUGIN_MIME_TYPE = 'application/x-mpvjs';
import path from 'path';

function containsNonASCII(str) {
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            return true;
        }
    }
    return false;
}

export function getPluginEntry(pluginDir, pluginName = 'mpvjs.node') {
    const fullPluginPath = path.join(pluginDir, pluginName);
    // Try relative path to workaround ASCII-only path restriction.
    let pluginPath = path.relative(process.cwd(), fullPluginPath);
    if (path.dirname(pluginPath) === ".") {
        // "./plugin" is required only on Linux.
        if (process.platform === "linux") {
            pluginPath = `.${path.sep}${pluginPath}`;
        }
    } else {
        // Relative plugin paths doesn't work reliably on Windows, see
        // <https://github.com/Kagami/mpv.js/issues/9>.
        if (process.platform === "win32") {
            pluginPath = fullPluginPath;
        }
    }
    if (containsNonASCII(pluginPath)) {
        if (containsNonASCII(fullPluginPath)) {
            throw new Error("Non-ASCII plugin path is not supported");
        } else {
            pluginPath = fullPluginPath;
        }
    }
    return `${pluginPath};${PLUGIN_MIME_TYPE}`;
}

@Module({
    providers: [{
        provide: 'WEB_CONTENTS',
        async useFactory() {
            const development = GlobalService.prototype.isDevelopment();

            app.on('window-all-closed', () => {
                if (process.platform !== 'darwin') {
                    app.quit();
                }
            });

            app.once('before-quit', () => {
                window.removeAllListeners('close');
            });

            let os;
            switch (process.platform) {
                case 'darwin':
                    os='mac'
                    break;
                case 'win32':
                    os = 'win'
                    break;
            }

            const pluginDir = path.join(app.getAppPath(), `./build/assets/mpv/${os}`);

            if (process.platform !== 'linux') {
                process.chdir(pluginDir);
            }

            fs.accessSync(`./mpvjs.node`, fs.R_OK);

            app.commandLine.appendSwitch('enable-webgl');
            app.commandLine.appendSwitch('disable-web-security');
            app.commandLine.appendSwitch('enable-npapi');
            app.commandLine.appendSwitch('force_high_performance_gpu');
            app.commandLine.appendSwitch('no-sandbox');
            app.commandLine.appendSwitch('ignore-gpu-blacklist');
            app.commandLine.appendSwitch('register-pepper-plugins', getPluginEntry(pluginDir));

            await app.whenReady();

            const win = new BrowserWindow({
                width: 1000,
                height: 800,
                autoHideMenuBar: true,
                useContentSize: process.platform !== 'linux',
                webPreferences: {
                    plugins: true,
                    nodeIntegration: true,
                    webSecurity: false,
                    contextIsolation: true,
                    enableRemoteModule: true,
                    worldSafeExecuteJavaScript: false,
                    preload: resolve(__dirname, './bridge/index.js')
                },
            });

            win.maximize();

            if (!app.isPackaged) {
                await win.loadURL(`http://localhost:${process.env.PORT || 8081}`);
            } else {
                await win.loadFile('dist/renderer/index.html');
            }

            win.on('closed', () => {
                win.destroy();
            });

            if (development) {
                win.webContents.openDevTools();
            }

            return win.webContents;
        }
    }],
    exports: ['WEB_CONTENTS']
})
export class WindowModule {
    constructor() {
    }
}
