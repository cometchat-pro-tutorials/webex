import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Context from '../../context';

const Header = () => {
  const { user, setUser, cometChat } = useContext(Context);

  const history = useHistory();

  const logout = async () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      await logoutCometChat();
      removeAuthedInfo();
      backToLoginPage();
    }
  }

  const logoutCometChat = async () => {
    await cometChat.logout();
  };

  const removeAuthedInfo = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  const backToLoginPage = () => {
    history.push('/login');
  };

  return (
    <div className="header">
      <div className="header__left">
        {
          user && (
            <div className="header__right">
              <div className="header__image-wrapper">
                <img src={user.avatar} alt={user.email} />
              </div>
            </div>
          )
        }
      </div>
      <span className="header__logout" onClick={logout}><span>Logout</span></span>
    </div>
  );
}

export default Header;