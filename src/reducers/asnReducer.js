import * as types from '../shared/actionTypes';

export default function asnReducer(state = {}, action) {
  switch (action.type) {
    case types.GET_ASN_PC_ZK_DATA_SUCCESS:
      return { ...state, getAsnPcZkResponse: action.res };
    case types.POST_ASN_PC_ZK_DATA_SUCCESS:
      return { ...state, postAsnPcZkResponse: action.res };
    case types.GET_CHANNELS_BY_USER_SUCCESS:
      return { ...state, getChannelsByUserResponse: action.res };
    case types.GET_LIVE_STREAMS_BY_USER_SUCCESS:
      return { ...state, getLiveStreamsByUserResponse: action.res };
    case types.GET_AUDIO_ROOMS_BY_USER_SUCCESS:
      return { ...state, getAudioRoomsByUserResponse: action.res };
    case types.VERIFY_BULK_LIVE_STREAMS_SUCCESS:
      return { ...state, verifyBulkLiveStreamsResponse: action.res };
    case types.VERIFY_BULK_AUDIO_ROOMS_SUCCESS:
      return { ...state, verifyBulkAudioRoomsResponse: action.res };
    case types.VERIFY_BULK_CHANNEL_URLS_SUCCESS:
      return { ...state, verifyBulkChannelUrlsResponse: action.res };
    case types.GET_LIVE_STREAMS_LIST_SUCCESS:
      return { ...state, getLiveStreamListResponse: action.res };
    case types.END_LIVE_STREAM_SUCCESS:
      return { ...state, endLiveStreamResponse: action.res };
    case types.GET_LS_BLOCKED_USERS_SUCCESS:
      return { ...state, getLsBlockedUsersResponse: action.res };
    case types.UPDATE_LS_BLOCKUSER_STATUS_SUCCESS:
      return { ...state, updateLsBlockUserResponse: action.res };
    case types.SOCIAL_PROCESS_BULK_AMOUNT_SUCCESS:
      return { ...state, processBulkPaymentResponse: action.res };
    case types.BLOCK_USER_FEATURE_SUCCESS:
      return { ...state, blockUserFeatureResponse: action.res };
    case types.UNBLOCK_USER_FEATURE_SUCCESS:
      return { ...state, unblockUserFeatureResponse: action.res };
    default:
      return state;
  }
}
