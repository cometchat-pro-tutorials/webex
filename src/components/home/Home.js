import { useContext } from 'react';
import { useHistory } from 'react-router';

import withMeeting from '../../components/common/Meeting';

import { createCometChatGroup, navigate } from '../../services/common';

import Context from '../../context';

import banner from '../../images/hand.svg';

function Home(props) {
  const { saveAndJoinMeeting } = props;
  const { cometChat, user, items, setId, setIsLoading } = useContext(Context);

  const push = useHistory().push;

  const startMeeting = async () => {
    const guid = user.guid;
    const name = user.fullname
    const meeting = { guid, name };
    try {
      setIsLoading(true);
      await createCometChatGroup({ cometChat, guid, name });
      saveAndJoinMeeting(meeting);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error && error.code === 'ERR_GUID_ALREADY_EXISTS') {
        saveAndJoinMeeting(meeting);
      }
    }
  };

  const scheduleMeeting = () => {
    const route = '/meetings';
    // set menu id.
    setId(() => findMenuIdByRoute(route));
    navigate({ route: '/meetings', push });
  };

  const findMenuIdByRoute = route => {
    const item = items.find(item => item.route === route);
    return item.id;
  };

  return (
    <div className="home__container">
      <div className="home__left">
        <div className="home__banner">
          <p>Hi, {user?.fullname}!</p>
          <div className="home__banner-img">
            <img src={banner} alt="banner" />
          </div>
        </div>
        <h3>My Personal Meeting Room</h3>
        <input defaultValue={user?.guid} readOnly />
        <div className="home__actions">
          <button onClick={startMeeting}>Start a Meeting</button>
          <button onClick={scheduleMeeting}>Schedule</button>
        </div>
      </div>
      <div className="home__right">
        <div className="home__right-banner">
          <h3 className="home__right-banner-title">Try Webex on desktop</h3>
          <p>Install the Webex desktop app to use for easy access and a few more features.</p>
        </div>
        <div className="home__right_middle-banner">
          <div className="home__banner-wrapper">
            <div className="home__right-banner">
              <h3 className="home__right-banner-title">Add your people</h3>
              <p>Add people we think you know so you can start collaborating as soon as possible!</p>
            </div>
            <div className="home__right-banner">
              <h3 className="home__right-banner-title">Get your project going</h3>
              <p>Spaces work well for a group of people working on a specific topic or project</p>
            </div>
          </div>
        </div>
        <div className="home__right-banner">
          <h3 className="home__right-banner-title">Connect with your teammates!</h3>
          <p>You can connect with your teammates easily with WebEx.</p>
        </div>
      </div>
    </div>
  );
}

export default withMeeting(Home);
