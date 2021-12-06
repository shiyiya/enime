import { Module, Logger } from '@nestjs/common';
import {app, BrowserWindow, dialog} from 'electron';
import { join, resolve } from 'path';
import { GlobalService } from '../global/global.service';

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

            await app.whenReady();

            const win = new BrowserWindow({
                width: 1000,
                height: 800,
                webPreferences: {
                    nodeIntegration: true,
                    webSecurity: false,
                    contextIsolation: true,
                    preload: resolve(__dirname, './bridge/index.js')
                },
            });

            win.maximize();

            const URL = !app.isPackaged
                ? `http://localhost:${process.env.PORT}`
                : `file://${join(app.getAppPath(), 'dist/renderer/index.html')}`;

            win.loadURL(URL);

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
