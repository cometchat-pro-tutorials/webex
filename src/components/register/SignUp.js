import { useRef, useContext } from "react";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

import Context from "../../context";

import { auth } from "../../firebase";

import { showNotification, insertFirebaseDatabase } from "../../services/common";

const SignUp = (props) => {
  const { toggleModal } = props;

  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const { cometChat, setIsLoading } = useContext(Context);

  const signup = async () => {
    try {
      const { fullname, email, password, confirmPassword } = getInputs();
      if (isSignupValid({ fullname, email, password, confirmPassword })) {
        setIsLoading(true);
        await createFirebaseAccount({ email, password });
        const id = uuidv4();
        // personal meeting id.
        const guid = uuidv4();
        const avatar = generateAvatar();
        const createdAccount = createAccount({ id, fullname, email, avatar, guid });
        await insertFirebaseDatabase({ key: 'users', id, payload: createdAccount });
        await createCometChatAccount({ id, fullname, avatar });
        setIsLoading(false);
        showNotification(`${email} was created successfully! Please sign in with your created account`);
        toggleModal(false);
      } else {
        setIsLoading(false);
        showNotification(`Cannot create your account, ${email} might be existed, please try again!`);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getInputs = () => {
    const fullname = fullnameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    return { fullname, email, password, confirmPassword };
  };

  const isSignupValid = ({ fullname, email, password, confirmPassword }) => {
    if (validator.isEmpty(fullname)) {
      showNotification("Please input your fullname");
      return false;
    }
    if (!validator.isEmail(email)) {
      showNotification("Please input your email");
      return false;
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
      showNotification("Please input your password. You password must have at least 6 characters");
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      showNotification("Please input your confirm password");
      return false;
    }
    if (password !== confirmPassword) {
      showNotification("Confirm password and password must be the same");
      return false;
    }
    return true;
  };

  const generateAvatar = () => {
    const avatars = [
      'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
      'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
      'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
      'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
      'https://data-us.cometchat.io/assets/images/avatars/wolverine.png'
    ];
    const avatarPosition = Math.floor(Math.random() * avatars.length);
    return avatars[avatarPosition];
  };

  const createFirebaseAccount = async ({ email, password }) => {
    return await auth.createUserWithEmailAndPassword(email, password);
  };

  const createAccount = ({ id, fullname, email, avatar, guid }) => {
    return { id, fullname, email, avatar, guid }
  };

  const createCometChatAccount = async ({ id, fullname, avatar }) => {
    const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
    const user = new cometChat.User(id);
    user.setName(fullname);
    user.setAvatar(avatar);
    return await cometChat.createUser(user, authKey);
  };

  return (
    <div className="signup">
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title">Sign Up</div>
          <div className="signup__close">
            <img
              alt="close"
              onClick={() => toggleModal(false)}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
            />
          </div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          <input type="text" placeholder="Fullname" ref={fullnameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          <button className="signup__btn" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
