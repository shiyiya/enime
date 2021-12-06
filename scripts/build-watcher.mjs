import fs from 'fs/promises';
import { spawn } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
import _ from 'lodash';

export class BuildWatcher {
    constructor(transpiler) {
        this.isWatcherReady = false
        this.isAppStarted = false
        this.app = null
        this.transpiler = transpiler
        this.fsWatcher = null
    }

    getBuildFilePath(sourceFilePath) {
        const buildFileName = path.basename(sourceFilePath, '.js') + '.js'
        const buildFileFolder = path.dirname(sourceFilePath).replace('src', 'dist')
        return path.join(buildFileFolder, buildFileName)
    }

    async removeFile(sourceFilePath) {
        const buildFilePath = this.getBuildFilePath(sourceFilePath)
        await fs.unlink(buildFilePath)
        await fs.unlink(buildFilePath + '.map')
    }

    async removeFolder(sourceFolderPath) {
        const buildFolderPath = sourceFolderPath.replace('src', 'dist')
        await fs.rmdir(buildFolderPath, { recursive: true })
    }

    async start() {
        console.log(chalk.red('RM\t'), 'dist')
        await this.removeFolder('dist')

        this.fsWatcher = chokidar
            .watch(['src/main/**', 'src/common/**'], {
                ignored: new RegExp('[-.]spec.js'),
                usePolling: true,
                cwd: './',
            })
            .on('add', async fileName => {
                if (path.extname(fileName) !== '.js') {
                    return
                }
                console.log(chalk.green('ADD\t'), fileName)
                const buildFilePath = this.getBuildFilePath(fileName)
                await this.transpiler(fileName, buildFilePath)
            })
            .on('change', async fileName => {
                if (path.extname(fileName) !== '.js') {
                    return
                }
                console.log(chalk.yellow('CHANGE\t'), fileName)
                const buildFilePath = this.getBuildFilePath(fileName)
                await this.transpiler(fileName, buildFilePath)
            })
            .on('unlink', async fileName => {
                if (path.extname(fileName) !== '.js') {
                    return
                }
                console.log(chalk.red('RM\t'), fileName)
                await this.removeFile(fileName)
            })
            .on('unlinkDir', async path => {
                console.log(chalk.red('RMDIR\t'), path)
                await this.removeFolder(path)
            })
            .on('ready', () => {
                console.log(chalk.blue('READY\t'), 'Successfully created a production build')
                this.isWatcherReady = true

                this.fsWatcher.close();
            })
    }
}
