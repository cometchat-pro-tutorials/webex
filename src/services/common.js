import { realTimeDb } from "../firebase";

export const createCometChatGroup = async ({ cometChat, guid, name }) => {
  const groupType = cometChat.GROUP_TYPE.PUBLIC;
  const password = "";
  const group = new cometChat.Group(guid, name, groupType, password);
  await cometChat.createGroup(group);
};

export const showNotification = message => {
  alert(message);
};

export const insertFirebaseDatabase = async ({ key, id, payload }) => {
  await realTimeDb.ref(`${key}/${id}`).set(payload);
};

export const saveDataToLocalStorage = ({ key, payload }) => {
  localStorage.setItem(key, payload);
};

export const navigate = ({ route, push }) => { 
  push(route);
};