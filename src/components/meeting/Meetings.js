import { useEffect, useState, useContext, useCallback, useRef } from 'react';

import ScheduleMeeting from './ScheduleMeeting';
import withMeeting from '../common/Meeting';

import Context from '../../context';

import { realTimeDb } from '../../firebase';
import JoinMeeting from './JoinMeeting';

function Meetings(props) {
  const { saveAndJoinMeeting } = props;

  const [isScheduleMeetingShown, setIsScheduleMeetingShown] = useState(false);
  const [isJoinMeetingShown, setIsJoinMeetingShown] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const { user, hasNewMeeting, setIsLoading } = useContext(Context);

  const firebaseMeetingsRef = useRef(realTimeDb.ref().child('meetings'));
  const tempRef = firebaseMeetingsRef.current;

  const loadMeetings = useCallback(() => {
    if (user) {
      setIsLoading(true);
      firebaseMeetingsRef.current.orderByChild('owner').equalTo(user.id).on("value", function (snapshot) {
        const val = snapshot.val();
        if (val) {
          const keys = Object.keys(val);
          const meetings = keys.map(key => val[key]);
          setMeetings(() => meetings);
        }
        setIsLoading(false);
      });
    }
  }, [user, setIsLoading, firebaseMeetingsRef]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  useEffect(() => {
    if (hasNewMeeting) {
      loadMeetings();
    }
  }, [hasNewMeeting, loadMeetings]);

  useEffect(() => {
    return () => {
      setIsJoinMeetingShown(() => false);
      setIsScheduleMeetingShown(() => false);
      tempRef.off();
    };
  }, [tempRef]);

  const showScheduleMeeting = () => {
    setIsScheduleMeetingShown(() => true);
  };

  const showJoinMeeting = () => {
    setIsJoinMeetingShown(() => true);
  };

  const renderMeetings = () => {
    if (meetings && meetings.length) {
      return meetings.map(meeting => (
        <div className="meetings__list-item" key={meeting.guid}>
          <p className="meetings__list-item-title">{meeting.name}</p>
          <p>Meeting Id: {meeting.guid}</p>
          <button onClick={startMeeting(meeting)}>Start Meeting</button>
        </div>
      ));
    }
    return <></>;
  }

  const startMeeting = meeting => () => {
    saveAndJoinMeeting(meeting);
  };

  return (
    <div className="meetings__container">
      <div className="meetings__wrapper">
        <div className="meetings__header">
          <h3>My WebEx Meetings</h3>
          <div>
            <div>
              <button onClick={showScheduleMeeting}>Schedule a Meeting</button>
              <button onClick={showJoinMeeting}>Join a Meeting</button>
            </div>
          </div>
        </div>
        <div className="meetings__list">
          {renderMeetings()}
        </div>
      </div>
      {isScheduleMeetingShown && <ScheduleMeeting toggleScheduleMeeting={setIsScheduleMeetingShown} />}
      {isJoinMeetingShown && <JoinMeeting toggleJoinMeeting={setIsJoinMeetingShown} />}
    </div>
  );
}

export default withMeeting(Meetings);