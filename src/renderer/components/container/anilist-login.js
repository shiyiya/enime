import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-modal';

const OAUTH_URL = 'https://anilist.co/api/v2/oauth/authorize?client_id=5121&response_type=token';

const AnilistLogin = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
    >
      <iframe src={OAUTH_URL} width="100%" height="100%" onLoad={(event) => {
        const url = event.target.contentWindow.location.href;
        if (url.includes("#access_token")) props.onAccessToken(/#access_token=(?<token>.*)&token_type/g.exec(url).groups.token);
      }}/>
    </Modal>
  )
}

export default AnilistLogin;
