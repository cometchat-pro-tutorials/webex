import { useContext } from 'react';
import { useHistory } from 'react-router';

import Context from '../../context';

import { saveDataToLocalStorage, navigate } from '../../services/common';

const withMeeting = WrapperComponent => {
  return function (props) { 
    const { setMeeting } = useContext(Context);

    const push = useHistory().push;

    const saveAndJoinMeeting = (meeting) => {
      saveDataToLocalStorage({ key: 'meeting', payload: JSON.stringify(meeting) });
      setMeeting(meeting);
      navigate({ route: '/meeting', push });
    };
    
    return (
      <>
        <WrapperComponent saveAndJoinMeeting={saveAndJoinMeeting} {...props} />
      </>
    )
  }
}

export default withMeeting;