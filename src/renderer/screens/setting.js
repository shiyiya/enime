import React, {useEffect, useState} from 'react';
import { ipcRenderer } from "electron";
import { SETTINGS } from "../../shared/settings/settings";
import { useHistory } from "react-router-dom";

const cap = str => str[0].toUpperCase() + str.slice(1),
  update = async (key, val) => {
    if(!await ipcRenderer.invoke("config-save", key, val))
      return false;
    const [cat, kat] = key.split(".");
    global.config[cat][kat] = val;
    return true;
  };



export default function Setting() {
  const forceUpdate = useState()[1].bind(null, {}), hist = useHistory();
  let boolcount = 0;

  return (
    <div className="settings-top">
      <div className="settings-heading"><div className="back-button" onClick={() => hist.push("/")}><div className="back-arrow"></div></div><h2>Settings</h2></div>
      <div className="settings-opts">
        {
          Object.keys(SETTINGS).map((i, _) => {
            return (
              <>
                <h3 className="settings-sec" key={_}>{cap(i.toUpperCase())}</h3>
                {
                  Object.keys(SETTINGS[i]).map(j => {
                    const pog = SETTINGS[i][j], t = typeof pog.default,
                      propname = i + "." + j;

                    if (t === "boolean")
                      return (
                        <div className="settings-opt bool">
                          <div className="settings-text">
                            <span className="settings-title">{SETTINGS[i][j].title}</span>
                            <span className="settings-desc">{SETTINGS[i][j].desc}</span>
                          </div>
                          <div className="switch">
                            <input type="checkbox" id={"switch-" + (++boolcount)} className="switch-input" checked={global.config[i][j]} onChange={async v => {
                              if(await update(propname, v.target.checked)) forceUpdate();
                            }}/>
                            <label htmlFor={"switch-" + boolcount} className="switch-label"/>
                          </div>
                        </div>
                      )
                    else if (pog.choices)
                      return (
                        <div className="settings-opt select">
                          <div className="settings-text">
                            <span className="settings-title">{SETTINGS[i][j].title}</span>
                            <span className="settings-desc">{SETTINGS[i][j].desc}</span>
                          </div>
                          <select value={global.config[i][j]} onChange={async v => {
                            if(await update(propname, v.target.value)) forceUpdate();
                          }}>
                            {pog.choices.map(c => <option value={c}>{c}</option>)}
                          </select></div>
                      )
                    else if (t === "string")
                      return (
                        <div className="settings-opt text">
                          <div className="settings-text">
                            <span className="settings-title">{SETTINGS[i][j].title}</span>
                            <span className="settings-desc">{SETTINGS[i][j].desc}</span>
                          </div>
                          {SETTINGS[i][j].oauth &&
                          <button className="settings-oauth" onClick={async () => { if(await update(propname, await SETTINGS[i][j].oauth.auth())) forceUpdate();}}>{SETTINGS[i][j].oauth.text}</button>
                          }
                          {!SETTINGS[i][j].oauth &&
                          <input type="text" className="txtinpt" value={global.config[i][j]} onChange={async v => {
                            if(await update(propname, v.target.value)) forceUpdate();
                          }}/>
                          }
                        </div>
                      )
                  })
                }
              </>
            )
          })
        }
      </div>
    </div>
  )
}
