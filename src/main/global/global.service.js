import { Injectable } from '@nestjs/common';
import path from 'path';
import { app } from 'electron';

@Injectable()
export class GlobalService {
    isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }

    getBuildPath() {
        return app.isPackaged ? path.join(process.resourcesPath, 'build') : path.resolve(__dirname, path.join('..', '..', '..', 'build'));
    }

    getIconPath() {
        return path.join(this.getBuildPath(), 'icons');
    }

    getAssetPath() {
        return path.join(this.getBuildPath(), 'assets');
    }
}
