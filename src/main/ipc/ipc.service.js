import { Dependencies, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
@Dependencies(EventEmitter2)
export class IpcService {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    emit(event, payload) {
        this.eventEmitter.emit(event, payload);
    }
}
