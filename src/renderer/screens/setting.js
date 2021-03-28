import React, {useEffect, useState} from 'react';
import {useConfig} from "../hooks/config";
import { SETTINGS } from "../../shared/settings/settings";
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { useHistory } from "react-router-dom";

const cap = str => str[0].toUpperCase() + str.slice(1);

export default function Setting() {
  const config = useConfig(), hist = useHistory(), items = [];
  
  useEffect(() => {
    let boolcount = 0;
    for(let i in SETTINGS) {
      items.push(<h3 className="settings-sec">{cap(i)}</h3>);
      for (let j in SETTINGS[i]) {
        const pog = SETTINGS[i][j], t = typeof pog.default;
        if(t === "boolean")
          items.push(<div className="settings-opt bool">
            <span className="settings-title">{SETTINGS[i][j].title}</span>
            <div className="switch">
              <input type="checkbox" id={"switch-" + (++ boolcount)} className="switch-input"/>
              <label for={"switch-" + boolcount} className="switch-label"></label>
            </div></div>)
        else if(pog.choices)
          items.push(<div className="settings-opt select">
            <span className="settings-title">{SETTINGS[i][j].title}</span>
            <select value={global.config[i][j]} onChange={v => { global.config[i][v] = v.target.value; console.log("changed", v.target.value); }}>
              {pog.choices.map(c => <option value={c}>{c}</option>)}
            </select></div>)
        else if(t === "string")
          items.push(<div className="settings-opt text">
            <span className="settings-title">{SETTINGS[i][j].title}</span>
            <input type="text" className="txtinpt"/></div>)
      }
    }
  }, []); 


  return (
    <div className="settings-top">
      <h2>Settings</h2>
      <div className="settings-opts">
        {items}
      </div>
      <button onClick={() => hist.push("/")}>back</button>
    </div>
  )
}
