import { useEffect, useContext, useCallback } from 'react';
import { useHistory } from 'react-router';

import { CometChatMessages } from '../../cometchat-pro-react-ui-kit/CometChatWorkspace/src';
import MeetingHeader from './MeetingHeader';

import Context from '../../context';

const Meeting = () => { 
  const { meeting, cometChat, setMeeting } = useContext(Context);

  const history = useHistory();

  const removeMeeting = () => {
    setMeeting(null);
    localStorage.removeItem('meeting');
  }

  useEffect(() => {
    return () => {
      // remove the meeting from React context.
      removeMeeting();
    }
  });

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const startDirectCall = useCallback(() => {
    if (cometChat && meeting) {
      const sessionID = meeting.guid;
      const audioOnly = false;
      const defaultLayout = true;
      const callSettings = new cometChat.CallSettingsBuilder()
        .enableDefaultLayout(defaultLayout)
        .setSessionID(sessionID)
        .setIsAudioOnlyCall(audioOnly)
        .build();
      cometChat.startCall(
        callSettings,
        document.getElementById("call__screen"),
        new cometChat.OngoingCallListener({
          onUserListUpdated: userList => {
          },
          onCallEnded: call => {
            goBack();
          },
          onError: error => {
            goBack();
          },
          onMediaDeviceListUpdated: deviceList => {
          },
          onUserMuted: (userMuted, userMutedBy) => {
          },
          onScreenShareStarted: () => {
          },
          onScreenShareStopped: () => {
          }
        })
      );
    }
  }, [cometChat, meeting, goBack]);

  useEffect(() => {
    if (meeting && cometChat) {
      startDirectCall();
    }
  }, [meeting, cometChat, startDirectCall]);

  if (!meeting || !cometChat) {
    goBack();
    return <></>;
  }

  return (
    <>
      <MeetingHeader />
      <div className="meeting">
        <div className="meeting__left">
          <div id="call__screen"></div>
        </div>
        <div className="meeting__right">
          <CometChatMessages chatWithGroup={meeting.guid} />
        </div>
      </div>
    </>
  );
};

export default Meeting;