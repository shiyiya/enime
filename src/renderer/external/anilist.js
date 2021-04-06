let authWindow;
export default class Anilist {
  static login() {
    const { BrowserWindow } = require("@electron/remote")
    return new Promise((resolve) => {
      authWindow = new BrowserWindow({
        width: 400,
        height: 600,
        center: true,
        maximizable: false,
        minimizable: false,
        resizable: false,
        show: false,
        title: "AniList Login",
        darkTheme: true,
        backgroundColor: "#111",
        webPreferences: {contextIsolation: false},
      })

      authWindow
        .loadURL(
          `https://anilist.co/api/v2/oauth/authorize?client_id=5121&response_type=token`,
        )
        .catch(err => console.log(err))

      authWindow.webContents.on("will-redirect", (_, url) => {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.hash.slice(1));
        const token = params.get("access_token");

        if (!token) return;

        resolve(token);
        if (!authWindow) return;
        authWindow.close();
        authWindow = null;
      })

      authWindow.show();
    })
  }
}
