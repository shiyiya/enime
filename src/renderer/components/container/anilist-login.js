import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import Iframe from 'react-iframe'

const OAUTH_URL = 'https://anilist.co/api/v2/oauth/authorize?client_id=5121&response_type=token';

const AnilistLogin = () => {
  const [contentPage, setContentPage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  return (
    <Modal
      isOpen={true}
    >
      <Iframe url={OAUTH_URL} width="100%" height="100%" onLoad={(event) => {
        const url = event.target.contentWindow.location.href;
        if (url.includes("#access_token")) setAccessToken(/#access_token=(?<token>.*)&token_type/g.exec(url).groups.token);
      }}/>
    </Modal>
  )
}

export default AnilistLogin;
