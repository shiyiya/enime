import { remote, ipcRenderer } from "electron";
import {useCallback, useEffect, useState} from "react";
import {useStore} from "react-redux";
import { isEqual } from "lodash";

export function useConfig(callback) {
  let config = remote.getGlobal('config'), store = useStore();

  let lastUpdated;

  const unsubscribe = store.subscribe(() => {
    let thisLastUpdated = store.getState().config.timestamp;
    if (isEqual(lastUpdated, thisLastUpdated)) {
      lastUpdated = thisLastUpdated;
      config = remote.getGlobal('config');
      if (callback) callback(config);
    }
  });

  useEffect(() => {
    return unsubscribe();
  });

  return new Proxy(config, {
    set(target, p, value, receiver) {
      console.log(...arguments);
      ipcRenderer.sendSync('updateConfig', arguments);
      return true;
    }
  });
}
