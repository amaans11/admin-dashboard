import * as types from '../shared/actionTypes';
import initialState from './initialState';

export default function dynamicUpsellingReducer(
  state = initialState.dynamicUpselling,
  action
) {
  switch (action.type) {
    case types.GET_DYNAMIC_UPSELLING_CONFIG_SUCCESS:
      return {
        ...state,
        config: action.config
      };
    case types.GET_DYNAMIC_UPSELLING_OFFERS_BY_GAME_SUCCESS:
      return {
        ...state,
        offersByGameResponse: action.offers.offers
      };
    case types.CREATE_DYNAMIC_UPSELLING_OFFER_SUCCESS:
      return {
        ...state,
        createOfferResponse: action.response
      };
    case types.UPDATE_DYNAMIC_UPSELLING_OFFER_SUCCESS:
      return {
        ...state,
        updateOfferResponse: action.response
      };
    case types.CLONE_DYNAMIC_UPSELLING_OFFER:
      return {
        ...state,
        cloneOffer: action.cloneDetails,
        editType: action.editType
      };
    case types.CLEAR_DYNAMIC_UPSELLING_OFFER:
      return {
        ...state,
        cloneOffer: undefined,
        editType: undefined
      };
    case types.CREATE_UPSELL_OFFER_NAME_SUCCESS:
      return { ...state, createUpsellOfferNameResponse: action.response };
    case types.UPDATE_UPSELL_OFFER_NAME_SUCCESS:
      return { ...state, updateUpsellOfferNameResponse: action.response };
    case types.GET_UPSELL_OFFER_NAMES_SUCCESS:
      return { ...state, getUpsellOfferNamesResponse: action.response };
    case types.GET_UPSELL_ALL_SUPPORTED_COUNTRIES:
      return { ...state, getUpsellAllSupportedCountriesResponse: action.res };
    default:
      return state;
  }
}
