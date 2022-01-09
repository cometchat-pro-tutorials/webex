import { useEffect, useRef, useContext, useCallback } from "react";
import validator from "validator";
import { useHistory } from 'react-router-dom';

import withModal from "../common/Modal";
import SignUp from "../register/SignUp";

import Context from "../../context";

import { auth, realTimeDb } from "../../firebase";

import { showNotification } from "../../services/common";

const Login = (props) => {
  const { toggleModal } = props;

  const { cometChat, setUser, setIsLoading, } = useContext(Context);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const history = useHistory();

  const goToHomePage = useCallback(() => {
    history.push('/');
  }, [history]);

  const removeAuthedInfo = useCallback(() => {
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    const authenticatedUser = JSON.parse(localStorage.getItem('auth'));
    if (authenticatedUser) {
      goToHomePage();
    } else {
      removeAuthedInfo();
    }
  }, [history, setUser, goToHomePage, removeAuthedInfo]);

  const login = async () => {
    try {
      setIsLoading(true);
      const { email, password } = getInputs();
      if (isUserCredentialsValid(email, password)) {
        await loginWithFirebase(email, password);
        const user = await getUserByEmail(email);
        await loginWithCometChat(user);
      } else {
        setIsLoading(false);
        showNotification(`Your user's name or password is not correct`);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getInputs = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    return { email, password };
  };

  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  const loginWithFirebase = async (email, password) => {
    return await auth.signInWithEmailAndPassword(email, password);
  };

  const getUserByEmail = async (email) => {
    if (!email) return;
    const snapshot = await realTimeDb.ref().child('users').orderByChild('email').equalTo(email).get();
    const val = snapshot.val();
    if (val) {
      const keys = Object.keys(val);
      const user = val[keys[0]];
      return user;
    }
    return null;
  };

  const loginWithCometChat = async (user) => {
    if (!user) return;
    const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
    const cometChatUser = await cometChat.login(user.id, authKey);
    if (cometChatUser) {
      saveAuthedInfo(user);
      setIsLoading(false);
      goToHomePage();
    }
  };

  const saveAuthedInfo = (user) => {
    setUser(user);
    localStorage.setItem('auth', JSON.stringify(user));
  };

  return (
    <div className="login__container">
      <div className="login__welcome">
        <div className="login__logo">
          <img src='https://assets-global.website-files.com/5f3c19f18169b65d9d0bf384/5f3c19f18169b655820bf3d4_asset%2021.svg' alt='logo' />
        </div>
        <p>Build <span style={{ color: "#2B91A4", fontWeight: 'bold' }}>Webex Clone</span> with React</p>
      </div>
      <div className="login__form-container">
        <div className="login__form">
          <input
            type="text"
            placeholder="Email or phone number"
            ref={emailRef}
          />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <button className="login__submit-btn" onClick={login}>
            Login
          </button>
          <span className="login__forgot-password">Forgot password?</span>
          <span className="login__signup" onClick={() => toggleModal(true)}>Create New Account</span>
        </div>
      </div>
    </div>
  );
}

export default withModal(SignUp)(Login);
