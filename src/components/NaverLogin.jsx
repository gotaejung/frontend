import { useEffect } from 'react';

const NaverLogin = () => {


  useEffect(() => {
    if (window.naver_id_login) {
      // Client ID
      const naverLogin = new window.naver_id_login("TadebOjQaTTUUg3kWJSr", window.location.origin + "/auth/naver/callback");
      const state = naverLogin.getUniqState();
      naverLogin.setButton("white", 2, 40);
      naverLogin.setDomain(window.location.origin);
      naverLogin.setState(state);
      naverLogin.setPopup();
      naverLogin.init_naver_id_login();
    }
  }, []);




  return (
    <div id="naver_id_login"></div>
  );
}

export default NaverLogin