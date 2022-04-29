import path from 'path';
import { app } from 'electron';

export function getResource(relativePath: string): string {
    return app.isPackaged ? path.join(process.resourcesPath, "public", relativePath) : path.join(__dirname, "../../../", "public", relativePath);
}