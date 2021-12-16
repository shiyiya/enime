const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'EnimeBridge', {
      app: {
        emit(event, payload) {
          ipcRenderer.send('app.emit', [event, payload]);
        },
        cwd() {
          ipcRenderer.send('app.cwd', process.cwd())
        }
      }
    }
);
