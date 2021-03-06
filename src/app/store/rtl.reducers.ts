import { ActionReducerMap } from '@ngrx/store';
import { ErrorPayload } from '../shared/models/errorPayload';
import { RTLConfiguration, LightningNode, GetInfoRoot } from '../shared/models/RTLconfig';

import * as fromCL from '../clightning/store/cl.reducers';
import * as fromLND from '../lnd/store/lnd.reducers';
import * as RTLActions from './rtl.actions';

export interface RootState {
  effectErrorsRoot: ErrorPayload[];
  selNode: LightningNode;
  appConfig: RTLConfiguration;
  nodeData: GetInfoRoot
}

const initNodeSettings = { flgSidenavOpened: true, flgSidenavPinned: true, menu: 'Vertical', menuType: 'Regular', theme: 'dark-blue', satsToBTC: false, channelBackupPath: '' };
const initNodeAuthentication = { nodeAuthType: 'CUSTOM', configPath: '', bitcoindConfigPath: '' };

const initRootState: RootState = {
  effectErrorsRoot: [],
  selNode: {settings: initNodeSettings, authentication: initNodeAuthentication},
  appConfig: {
    selectedNodeIndex: -1,
    sso: { rtlSSO: 0, logoutRedirectLink: '/login' },
    nodes: [{ settings: initNodeSettings, authentication: initNodeAuthentication}]
  },
  nodeData: {}
};

export function RootReducer(state = initRootState, action: RTLActions.RTLActions) {
  switch (action.type) {
    case RTLActions.CLEAR_EFFECT_ERROR_ROOT:
      const clearedEffectErrors = [...state.effectErrorsRoot];
      const removeEffectIdx = state.effectErrorsRoot.findIndex(err => {
        return err.action === action.payload;
      });
      if (removeEffectIdx > -1) {
        clearedEffectErrors.splice(removeEffectIdx, 1);
      }
      return {
        ...state,
        effectErrorsRoot: clearedEffectErrors
      };
    case RTLActions.EFFECT_ERROR_ROOT:
      return {
        ...state,
        effectErrorsRoot: [...state.effectErrorsRoot, action.payload]
      };
    case RTLActions.RESET_ROOT_STORE:
      return {
        ...initRootState,
        appConfig: state.appConfig,
        selNode: action.payload,
      };
    case RTLActions.SET_SELECTED_NODE:
      return {
        ...state,
        selNode: action.payload.lnNode
      };
    case RTLActions.SET_NODE_DATA:
      return {
        ...state,
        nodeData: action.payload
      };
    case RTLActions.SET_NODE_PENDING_CHANNELS_DATA:
      const newNodeData = state.nodeData;
      newNodeData.numberOfPendingChannels = action.payload;
      return {
        ...state,
        nodeData: newNodeData
      };
    case RTLActions.SET_RTL_CONFIG:
      return {
        ...state,
        appConfig: action.payload
      };
    default:
      return state;
  }

}

export interface RTLState {
  root: RootState;
  lnd: fromLND.LNDState;
  cl: fromCL.CLState;
}

export const RTLReducer: ActionReducerMap<RTLState> = {
  root: RootReducer,
  lnd: fromLND.LNDReducer,
  cl: fromCL.CLReducer
};
