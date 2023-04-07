import find from 'lodash/find';
export const CARD_TYPES = [
  'CHANNEL_EARNING',
  'CHANNEL_MEMBERS',
  'USER_CHANNEL_EARNING',
  'USER_FOLLOWERS',
  'AUDIO_SHOW',
  'LIVE_STREAM'
];

export const FIELD_KEY_MAP = {
  CHANNEL_EARNING: 'channels',
  CHANNEL_MEMBERS: 'channels',
  USER_CHANNEL_EARNING: 'users',
  USER_FOLLOWERS: 'users',
  AUDIO_SHOW: 'audioRooms',
  LIVE_STREAM: 'liveStreams'
};

export const NAME_MAP = {
  users: 'Users',
  channels: 'Channels',
  audioRooms: 'Audio Rooms',
  liveStreams: 'Live Streams'
};

export const METHOD_MAP = {
  users: 'getUserBasicProfileList',
  channels: 'verifyBulkChannelUrls',
  liveStreams: 'verifyBulkLiveStreams',
  audioRooms: 'verifyBulkAudioRooms',
  recommendationChannels: 'verifyBulkChannelUrls'
};
export const RESPONSE_MAP = {
  users: 'getBasicUserDetailListResponse',
  channels: 'verifyBulkChannelUrlsResponse',
  liveStreams: 'verifyBulkLiveStreamsResponse',
  audioRooms: 'verifyBulkAudioRoomsResponse',
  recommendationChannels: 'verifyBulkChannelUrlsResponse'
};

export const KEYS_MAP = {
  users: 'userIds',
  channels: 'channelUrls',
  liveStreams: 'liveStreamIds',
  audioRooms: 'rooms',
  recommendationChannels: 'channelUrls'
};

export const RESPONSE_KEYS_MAP = {
  users: 'profiles',
  channels: 'groups',
  liveStreams: 'liveStreams',
  audioRooms: 'rooms',
  recommendationChannels: 'groups'
};
export const FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    lg: { span: 10 }
  }
};

export const D_FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    lg: { span: 11 }
  }
};

export const FORM_ITEM_LAYOUT_WITHOUT_LABEL = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
    lg: { span: 11, offset: 8 }
  }
};

export const spreadKeys = (key, dataArr = []) => {
  let result = {};
  if (dataArr && dataArr.length) {
    for (let i = 0; i < dataArr.length; i++) {
      result[`${key}-${dataArr[i]}`] = dataArr[i];
    }
  }
  return result;
};

export const getZkArray = (dataSource, arr, type) => {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    const obj = find(dataSource, obj => obj[type] === arr[i]);
    result.push(obj ? obj : { [type]: arr[i], cardValue: 0 });
  }
  return result;
};

export const hasErrorsInForm = fieldsError => {
  return Object.keys(fieldsError).some(field => {
    let val = fieldsError[field];
    if (typeof val === 'object') {
      let arr = Object.keys(val);
      if (arr && arr.length) {
        for (let i = 0; i < arr.length; i++) {
          if (!(val[arr[i]] === undefined || val[arr[i]] === null)) {
            return true;
          }
        }
        return false;
      }
    } else {
      return val;
    }
  });
};

export const getArrFromObj = obj => {
  const result = [];
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    result.push(obj[keys[i]]);
  }
  return result;
};

export const containsInactiveData = (formValues, activeStatusData, key) => {
  let hasInactiveData = false;
  let inactiveData = getInactiveKeys(activeStatusData);
  for (let i = 0; i < inactiveData.length; i++) {
    if (formValues[key] && formValues[key].includes(inactiveData[i])) {
      hasInactiveData = true;
      break;
    }
  }
  return hasInactiveData;
};

export const getInactiveKeys = activeStatusData => {
  const keys = Object.keys(activeStatusData);
  const inactiveKeys = [];
  for (let i = 0; i < keys.length; i++) {
    if (!activeStatusData[keys[i]]) {
      inactiveKeys.push(keys[i]);
    }
  }
  return inactiveKeys;
};

export const getMobileNumberFromData = (searchType, data) => {
  return searchType && searchType.toLowerCase().includes('user')
    ? data.mobileNumber
    : searchType && searchType.toLowerCase().includes('channel')
    ? data.creator.mobileNumber
    : data.host.profile.mobileNumber;
};

export const getActiveStatusFromData = (searchType, data) => {
  const addActiveStatus =
    searchType.includes('audioRooms') || searchType.includes('liveStreams');
  const activeStatus = addActiveStatus
    ? data.state === 0 || !data.hasOwnProperty('state')
      ? true
      : false
    : null;
  return { addActiveStatus, activeStatus };
};
