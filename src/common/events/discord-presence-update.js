export class DiscordPresenceUpdateEvent {
    status;
    paused;
    data;

    constructor(status, paused, data) {
        this.status = status;
        this.paused = paused;
        this.data = data;
    }
}
