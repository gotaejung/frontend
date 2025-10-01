import KakaoLogin from './KakaoLogin';
import NaverLogin from './NaverLogin';

const SocialLogin = () => {
  return (
    <div className="flex items-center space-x-4">
      <KakaoLogin />
      <NaverLogin />
    </div>
  );
};

export default SocialLogin;