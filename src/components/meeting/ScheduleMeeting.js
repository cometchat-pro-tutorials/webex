import { useRef, useContext } from 'react';

import { v4 as uuidv4 } from "uuid";

import { createCometChatGroup, showNotification, insertFirebaseDatabase } from '../../services/common';

import Context from '../../context';

function ScheduleMeeting(props) {
  const { toggleScheduleMeeting } = props;

  const { user, cometChat, setIsLoading, setHasNewMeeting } = useContext(Context);

  const meetingNameRef = useRef();

  const hideScheduleMeetingModal = () => {
    toggleScheduleMeeting(false);
  };

  const scheduleMeeting = async () => {
    const name = meetingNameRef.current.value;
    const guid = uuidv4();
    if (!name || !guid) {
      return;
    }
    try {
      setIsLoading(true);
      await insertFirebaseDatabase({ key: 'meetings', id: guid, payload: { guid, owner: user.id, name } });
      await createCometChatGroup({ cometChat, guid, name });
      showNotification(`${name} was created successfully, you can share the meeting id to other users`);
      hideScheduleMeetingModal();
      setIsLoading(false);
      setHasNewMeeting(true);
    } catch (error) {
      console.log(error);
      showNotification('Cannot create your meeting. Please try again');
      setIsLoading(false);
    }
  };

  return (
    <div className="schedule">
      <div className="schedule__content">
        <div className="schedule__container">
          <div className="schedule__title">Schedule Meeting</div>
          <div className="schedule__close">
            <img alt="close" onClick={hideScheduleMeetingModal} src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png" />
          </div>
        </div>
        <div className="schedule__subtitle"></div>
        <div className="schedule__form">
          <input type="text" placeholder="Meeting Name" ref={meetingNameRef} />
          <button className="schedule__btn" onClick={scheduleMeeting}>
            Schedule a Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;