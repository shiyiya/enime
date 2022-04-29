import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getResource } from '../helper';

export async function createWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        autoHideMenuBar: true,
        useContentSize: process.platform !== "linux",
        webPreferences: {
            plugins: true,
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: true
        },
        icon: getResource("./icon/win/icon.ico")
    });

    window.maximize();

    if (!app.isPackaged) {
        await window.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
    } else {
        await window.loadFile("../renderer/dist/index.html");
    }

    window.on("closed", () => {
        window.destroy();
    });

    window.on("ready-to-show", () => {
        window.show();

        if (import.meta.env.DEV) {
            window.webContents.openDevTools();
        }
    });

    return window;
}

export async function restoreOrCreateWindow() {
    let window: BrowserWindow = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

    if (!window) {
        window = await createWindow();
    }

    if (window.isMinimized()) {
        window.restore();
    }

    window.focus();
}