import {
  GET_DYNAMIC_UPSELLING_CONFIG_SUCCESS,
  INT_API_URL,
  GET_DYNAMIC_UPSELLING_OFFERS_BY_GAME_SUCCESS,
  CREATE_DYNAMIC_UPSELLING_OFFER_SUCCESS,
  UPDATE_DYNAMIC_UPSELLING_OFFER_SUCCESS,
  CLONE_DYNAMIC_UPSELLING_OFFER,
  CLEAR_DYNAMIC_UPSELLING_OFFER,
  CREATE_UPSELL_OFFER_NAME_SUCCESS,
  UPDATE_UPSELL_OFFER_NAME_SUCCESS,
  GET_UPSELL_OFFER_NAMES_SUCCESS,
  GET_UPSELL_ALL_SUPPORTED_COUNTRIES
} from '../shared/actionTypes';
import axios from 'axios';

export function getDynamicUpsellingConfig(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + 'api/tournament/dynamic-upselling/config', {
        params: data
      })
      .then(result => {
        dispatch(getDynamicUpsellingConfigSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function getDynamicUpsellingConfigSuccess(config) {
  return { type: GET_DYNAMIC_UPSELLING_CONFIG_SUCCESS, config };
}

export function getDynamicUpsellingOffersByGame(data) {
  return dispatch => {
    return axios
      .get(INT_API_URL + `api/tournament/dynamic-upselling/offers`, {
        params: data
      })
      .then(result => {
        dispatch(getDynamicUpsellingOffersByGameSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}
export function getDynamicUpsellingOffersByGameSuccess(offers) {
  return { type: GET_DYNAMIC_UPSELLING_OFFERS_BY_GAME_SUCCESS, offers };
}

export function createDynamicUpsellOffer(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/dynamic-upselling/create`, data)
      .then(result => {
        dispatch(createDynamicUpsellOfferSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function createDynamicUpsellOfferSuccess(response) {
  return { type: CREATE_DYNAMIC_UPSELLING_OFFER_SUCCESS, response };
}

export function updateDynamicUpsellOffer(data) {
  return dispatch => {
    return axios
      .post(INT_API_URL + `api/tournament/dynamic-upselling/update`, data)
      .then(result => {
        dispatch(updateDynamicUpsellOfferSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function updateDynamicUpsellOfferSuccess(response) {
  return { type: UPDATE_DYNAMIC_UPSELLING_OFFER_SUCCESS, response };
}
export function cloneDynamicUpsellingOffer(cloneDetails, editType) {
  return { type: CLONE_DYNAMIC_UPSELLING_OFFER, cloneDetails, editType };
}

export function resetCloneOffer() {
  return { type: CLEAR_DYNAMIC_UPSELLING_OFFER };
}

// Upselling offer name
export const createUpsellOfferName = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + `api/tournament/dynamic-upselling/create-offer-name`,
      data
    );
    dispatch(createUpsellOfferNameSuccess(result.data.payload));
  };
};

export const createUpsellOfferNameSuccess = response => {
  return { type: CREATE_UPSELL_OFFER_NAME_SUCCESS, response };
};

export const updateUpsellOfferName = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + `api/tournament/dynamic-upselling/update-offer-name`,
      data
    );
    dispatch(updateUpsellOfferNameSuccess(result.data.payload));
  };
};

export const updateUpsellOfferNameSuccess = response => {
  return { type: UPDATE_UPSELL_OFFER_NAME_SUCCESS, response };
};

export const getUpsellOfferNames = data => {
  return async dispatch => {
    const result = await axios.post(
      INT_API_URL + `api/tournament/dynamic-upselling/list-offer-names`,
      data
    );
    dispatch(getUpsellOfferNamesSuccess(result.data.payload));
  };
};

export const getUpsellOfferNamesSuccess = response => {
  return { type: GET_UPSELL_OFFER_NAMES_SUCCESS, response };
};

export function getUpsellAllSupportedCountries() {
  return dispatch => {
    return axios
      .get(
        INT_API_URL + `api/tournament/dynamic-upselling/all-supported-countries`
      )
      .then(result => {
        dispatch(getUpsellAllSupportedCountriesSuccess(result.data.payload));
      })
      .catch(error => {
        throw error;
      });
  };
}
export function getUpsellAllSupportedCountriesSuccess(res) {
  return { type: GET_UPSELL_ALL_SUPPORTED_COUNTRIES, res };
}
