import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Login from './components/login/Login';
import Home from './components/home/Home';
import Meeting from './components/meeting/Meeting';
import Meetings from './components/meeting/Meetings';
import Loading from './components/common/Loading';
import PrivateRoute from './components/common/PrivateRoute';
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import Context from './context';
import './index.css';

const items = [
  {
    id: 1,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 32, 32" data-test="dashboard" className="" fill="currentColor" width="100%" height="100%" data-scale="24" data-autoscale="false" style={{ stroke: 'none' }}><path d="M11.99 3.5h-6A2.5 2.5 0 003.49 6v3a2.5 2.5 0 002.5 2.5h6a2.5 2.5 0 002.5-2.5V6a2.5 2.5 0 00-2.5-2.5zm-.001 11h-6a2.5 2.5 0 00-2.5 2.5v9a2.5 2.5 0 002.5 2.5h6a2.5 2.5 0 002.5-2.5v-9a2.5 2.5 0 00-2.5-2.5zm14.001 6h-6a2.5 2.5 0 00-2.5 2.5v3a2.5 2.5 0 002.5 2.5h6a2.5 2.5 0 002.5-2.5v-3a2.5 2.5 0 00-2.5-2.5zm.02-17h-6a2.5 2.5 0 00-2.5 2.5v9a2.5 2.5 0 002.5 2.5h6a2.5 2.5 0 002.5-2.5V6a2.5 2.5 0 00-2.5-2.5z"></path></svg>,
    name: 'Dashboard',
    route: '/'
  },
  {
    id: 2,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 32, 32" data-test="calendar-month" className="" fill="currentColor" width="100%" height="100%" data-scale="24" data-autoscale="false" style={{ stroke: 'none' }}><path d="M23 5.5V3a1 1 0 00-2 0v2.5H11V3a1 1 0 00-2 0v2.5A4.505 4.505 0 004.5 10v14A4.505 4.505 0 009 28.5h14a4.504 4.504 0 004.5-4.5V10A4.505 4.505 0 0023 5.5zM10 24.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0-6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0-6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm6 12a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0-6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0-6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm6 12a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0-6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm0-6a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"></path></svg>,
    name: 'Meetings',
    route: '/meetings'
  },
];

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);
  // menu id.
  const [id, setId] = useState(null);
  // chose meeting.
  const [meeting, setMeeting] = useState(null);
  // detect whether a new meeting was created so the list of meetings will be refreshed. 
  const [hasNewMeeting, setHasNewMeeting] = useState(false);

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem('auth');
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  const initCometChat = async () => {
    const { CometChat } = await import('@cometchat-pro/chat');
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
  };

  const initMeeting = () => { 
    const meeting = localStorage.getItem('meeting');
    if (meeting) {
      setMeeting(JSON.parse(meeting));
    }
  };

  const initMenu = () => {
    const url = window.location.href;
    items.forEach(item => {
      if (url.includes(item.route)) { 
        setId(() => item.id);
      }
    });
  }

  useEffect(() => {
    initAuthUser();
    initCometChat();
    initMeeting();
    initMenu();
  }, []);

  return (
    <Context.Provider value={{ isLoading, setIsLoading, user, setUser, cometChat, id, setId, items, meeting, setMeeting, hasNewMeeting, setHasNewMeeting }}>
      <Router>
        {user && !meeting && <>
          <Header />
          <Sidebar />
        </>}
        <div className={`${user && !meeting ? 'app__container' : ''}`}>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/meeting" component={Meeting} />
            <PrivateRoute exact path="/meetings" component={Meetings} />
            <Route exact path="/login">
              <Login />
            </Route>
          </Switch>
        </div>
      </Router>
      {isLoading && <Loading />}
    </Context.Provider>
  );
}

export default App;
