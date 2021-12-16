import { Controller, Dependencies } from '@nestjs/common';
import { IpcService } from './ipc.service';
import { HandleIPCMessage } from 'nestjs-electron-ipc-transport';

@Controller()
@Dependencies(IpcService)
export class IpcController {
    constructor(ipcService) {
        this.ipcService = ipcService;
    }

    @HandleIPCMessage('app.emit')
    emit([event, payload]) {
        this.ipcService.emit(event, payload);
    }

    @HandleIPCMessage('app.cwd')
    cwd() {
        console.log(process.cwd())
    }
}
