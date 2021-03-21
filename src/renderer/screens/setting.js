import React, {useEffect, useState} from 'react';
import {useConfig} from "../hooks/config";

export default function Setting() {
  const config = useConfig();

  return (
    <div>
      <div>
        Torrent Source Provider: {config.providers.torrent}
      </div>
      <div>
        Information Provider: {config.providers.information}
      </div>
    </div>
  )
}
