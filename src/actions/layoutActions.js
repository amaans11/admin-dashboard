import * as actionType from "../shared/actionTypes";

export function sideBarToggle(sideMenu) {
  return { type: actionType.SIDE_MENU_TOGGLE, sideMenu };
}
