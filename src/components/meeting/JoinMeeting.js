import { useRef, useContext } from 'react';

import withMeeting from '../common/Meeting';

import { showNotification } from '../../services/common';

import Context from '../../context';

import { realTimeDb } from '../../firebase';

function JoinMeeting(props) {
  const { toggleJoinMeeting, saveAndJoinMeeting } = props;

  const { cometChat, setIsLoading } = useContext(Context);

  const meetingIdRef = useRef();

  const hideJoinMeetingModal = () => {
    toggleJoinMeeting(false);
  };

  const joinMeeting = async () => {
    const id = meetingIdRef.current.value;
    if (!id) {
      showNotification('Please input the meeting id');
      return;
    }
    const meeting = await getMeetingById(id);
    try {
      setIsLoading(true);
      if (!meeting) {
        showNotification('The meeting id does not exist');
        setIsLoading(false);
        return;
      }
      hideJoinMeetingModal();
      setIsLoading(false);
      await joinGroup(meeting.guid);
      saveAndJoinMeeting(meeting);
    } catch (error) {
      if (error && error.code === 'ERR_ALREADY_JOINED') { 
        saveAndJoinMeeting(meeting);
      }
      setIsLoading(false);
    }
  };

  const getMeetingById = async id => {
    if (!id) return null;
    const snapshot = await realTimeDb.ref().child('meetings').orderByChild('guid').equalTo(id).get();
    const val = snapshot.val();
    if (val) {
      const keys = Object.keys(val);
      return val[keys[0]];
    }
    return null;
  };

  const joinGroup = async (guid) => {
    const password = "";
    const groupType = cometChat.GROUP_TYPE.PUBLIC;
    
    return await cometChat.joinGroup(guid, groupType, password);
  };

  return (
    <div className="join">
      <div className="join__content">
        <div className="join__container">
          <div className="join__title">Join Meeting</div>
          <div className="join__close">
            <img alt="close" onClick={hideJoinMeetingModal} src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png" />
          </div>
        </div>
        <div className="join__subtitle"></div>
        <div className="join__form">
          <input type="text" placeholder="Meeting Id" ref={meetingIdRef} />
          <button className="join__btn" onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default withMeeting(JoinMeeting);