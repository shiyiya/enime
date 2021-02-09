import { ipcRenderer } from 'electron';

export function streamTorrent(torrentLink) {
  return ipcRenderer.invoke('enime:stream-torrent', torrentLink)
}
