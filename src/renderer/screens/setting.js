import React, {useEffect, useState} from 'react';
import {useConfig} from "../hooks/config";
import { SETTINGS } from "../../shared/settings/settings";
import { useHistory } from "react-router-dom";

const cap = str => str[0].toUpperCase() + str.slice(1);

export default function Setting() {
  const [config, setConfig] = useState(useConfig(updatedConfig => {
    setConfig(updatedConfig);
  })), hist = useHistory();
  let boolcount = 0;

  return (
    <div className="settings-top">
      <h2>Settings</h2>
      <div className="settings-opts">
        {
          Object.keys(SETTINGS).map((i, _) => {
            return (
              <>
                <h3 className="settings-sec">{cap(i)}</h3>
                {
                  Object.keys(SETTINGS[i]).map((j, _) => {
                    const pog = SETTINGS[i][j], t = typeof pog.default;

                    if (t === "boolean") {
                      return (
                        <div className="settings-opt bool">
                          <span className="settings-title">{SETTINGS[i][j].title}</span>
                          <div className="switch">
                            <input type="checkbox" id={"switch-" + (++boolcount)} className="switch-input"/>
                            <label htmlFor={"switch-" + boolcount} className="switch-label"/>
                          </div>
                        </div>
                      )
                    } else if (pog.choices) {
                      return (
                        <div className="settings-opt select">
                          <span className="settings-title">{SETTINGS[i][j].title}</span>
                          <select value={config[i][j]} onChange={v => {
                            config[i][j] = v.target.value; console.log("changed", v.target.value);
                          }}>
                            {pog.choices.map(c => <option value={c}>{c}</option>)}
                          </select></div>
                      )
                    } else if (t === "string") {
                      return (
                        <div className="settings-opt text">
                          <span className="settings-title">{SETTINGS[i][j].title}</span>
                          <input type="text" className="txtinpt"/></div>
                      )
                    }
                  })
                }
              </>
            )
          })
        }
      </div>
      <button onClick={() => hist.push("/")}>back</button>
    </div>
  )
}
