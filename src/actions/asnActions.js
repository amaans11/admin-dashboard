import axios from 'axios';
import {
  INT_API_URL,
  GET_ASN_PC_ZK_DATA_SUCCESS,
  POST_ASN_PC_ZK_DATA_SUCCESS,
  GET_CHANNELS_BY_USER_SUCCESS,
  VERIFY_BULK_LIVE_STREAMS_SUCCESS,
  VERIFY_BULK_AUDIO_ROOMS_SUCCESS,
  VERIFY_BULK_CHANNEL_URLS_SUCCESS,
  GET_AUDIO_ROOMS_BY_USER_SUCCESS,
  GET_LIVE_STREAMS_BY_USER_SUCCESS,
  GET_LIVE_STREAMS_LIST_SUCCESS,
  GET_LS_BLOCKED_USERS_SUCCESS,
  UPDATE_LS_BLOCKUSER_STATUS_SUCCESS,
  END_LIVE_STREAM_SUCCESS,
  SOCIAL_PROCESS_BULK_AMOUNT_SUCCESS,
  BLOCK_USER_FEATURE_SUCCESS,
  UNBLOCK_USER_FEATURE_SUCCESS
} from '../shared/actionTypes';

export function getAsnZkConfig() {
  return dispatch => {
    return axios.get(INT_API_URL + 'api/asn/product-config').then(result => {
      dispatch(getAsnZkConfigSuccess(result.data.payload));
    });
  };
}

export const getAsnZkConfigSuccess = res => ({
  type: GET_ASN_PC_ZK_DATA_SUCCESS,
  res
});

export function postAsnZkConfig(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/product-config', { data })
      .then(result => {
        dispatch(postAsnZkConfigSuccess(result.data.payload));
      });
  };
}

export const postAsnZkConfigSuccess = res => ({
  type: POST_ASN_PC_ZK_DATA_SUCCESS,
  res
});

export function getChannelsByUser(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/asn/channels-by-user', {
        params: data
      })
      .then(result => {
        dispatch(getChannelsByUserSuccess(result.data.payload));
      });
  };
}

export const getChannelsByUserSuccess = res => ({
  type: GET_CHANNELS_BY_USER_SUCCESS,
  res
});
export function getAudioRoomsByUser(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/asn/audio-rooms-by-user', {
        params: data
      })
      .then(result => {
        dispatch(getAudioRoomsByUserSuccess(result.data.payload));
      });
  };
}

export const getAudioRoomsByUserSuccess = res => ({
  type: GET_AUDIO_ROOMS_BY_USER_SUCCESS,
  res
});

export function getLiveStreamsByUser(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/asn/live-streams-by-user', {
        params: data
      })
      .then(result => {
        dispatch(getLiveStreamsByUserSuccess(result.data.payload));
      });
  };
}

export const getLiveStreamsByUserSuccess = res => ({
  type: GET_LIVE_STREAMS_BY_USER_SUCCESS,
  res
});
export function verifyBulkLiveStreams(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/verify-live-streams', {
        liveStreamIds: data.liveStreamIds.filter(stream =>
          stream.toUpperCase().startsWith('LS')
        )
      })
      .then(result => {
        dispatch(verifyBulkLiveStreamsSuccess(result.data.payload));
      });
  };
}

export const verifyBulkLiveStreamsSuccess = res => ({
  type: VERIFY_BULK_LIVE_STREAMS_SUCCESS,
  res
});

export function verifyBulkAudioRooms(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/verify-audio-rooms', data)
      .then(result => {
        dispatch(verifyBulkAudioRoomsSuccess(result.data.payload));
      });
  };
}

export const verifyBulkAudioRoomsSuccess = res => ({
  type: VERIFY_BULK_AUDIO_ROOMS_SUCCESS,
  res
});

export function verifyBulkChannelUrls(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/verify-channel-urls', data)
      .then(result => {
        dispatch(verifyBulkChannelUrlsSuccess(result.data.payload));
      });
  };
}

export const verifyBulkChannelUrlsSuccess = res => ({
  type: VERIFY_BULK_CHANNEL_URLS_SUCCESS,
  res
});

export function getLiveStreamList(params) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/asn/live-streams-list', { params })
      .then(result => {
        dispatch(getLiveStreamListSuccess(result.data.payload));
      });
  };
}

export const getLiveStreamListSuccess = res => ({
  type: GET_LIVE_STREAMS_LIST_SUCCESS,
  res
});

export function endLiveStream(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/end-live-stream', data)
      .then(result => {
        dispatch(endLiveStreamSuccess(result.data.payload));
      });
  };
}

export const endLiveStreamSuccess = res => ({
  type: END_LIVE_STREAM_SUCCESS,
  res
});

export function getLiveStreamBlockedUserList() {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/asn/live-streams-blocked-users')
      .then(result => {
        dispatch(getLiveStreamBlockedUserListSuccess(result.data.payload));
      });
  };
}

export const getLiveStreamBlockedUserListSuccess = res => ({
  type: GET_LS_BLOCKED_USERS_SUCCESS,
  res
});

export function updateLSBlockUserStatus(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/live-stream-update-block-user', data)
      .then(result => {
        dispatch(updateLSBlockUserStatusSuccess(result.data.payload));
      });
  };
}

export const updateLSBlockUserStatusSuccess = res => ({
  type: UPDATE_LS_BLOCKUSER_STATUS_SUCCESS,
  res
});

export function processBulkPayment(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/process-amounts', data)
      .then(result => {
        dispatch(processBulkPaymentSuccess(result.data.payload));
      });
  };
}

export const processBulkPaymentSuccess = res => ({
  type: SOCIAL_PROCESS_BULK_AMOUNT_SUCCESS,
  res
});

export function blockUserFeature(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/block-user-feature', data)
      .then(result => {
        dispatch(blockUserFeatureSuccess(result.data.payload));
      });
  };
}

export const blockUserFeatureSuccess = res => ({
  type: BLOCK_USER_FEATURE_SUCCESS,
  res
});

export function unblockUserFeature(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + 'api/asn/unblock-user-feature', data)
      .then(result => {
        dispatch(unblockUserFeatureSuccess(result.data.payload));
      });
  };
}

export const unblockUserFeatureSuccess = res => ({
  type: UNBLOCK_USER_FEATURE_SUCCESS,
  res
});
