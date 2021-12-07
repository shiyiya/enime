import { Module, Logger } from '@nestjs/common';
import { app, BrowserWindow } from 'electron';
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
                    nodeIntegrationInSubFrames: true,
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
