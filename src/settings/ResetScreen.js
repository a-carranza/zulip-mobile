/* @flow strict-local */

import React, { useCallback, useContext } from 'react';
import type { Node } from 'react';
import { ScrollView, View, Alert } from 'react-native';

import type { RouteProp } from '../react-navigation';
import type { AppNavigationProp } from '../nav/AppNavigator';
import NestedNavRow from '../common/NestedNavRow';
import SwitchRow from '../common/SwitchRow';
import Screen from '../common/Screen';
import { getAuth, getSettings, getGlobalSettings, getOwnUserId } from '../selectors';


import { TranslationContext } from '../boot/TranslationProvider';
import type { MainTabsNavigationProp } from '../main/MainTabsScreen';
import * as NavigationService from '../nav/NavigationService';
import { createStyleSheet } from '../styles';
import { useDispatch, useSelector, useGlobalSelector } from '../react-redux';
import ZulipButton from '../common/ZulipButton';
import {
  logout,
  navigateToAccountPicker,
  navigateToUserStatus,
  navigateToSettings,
  navigateToProfile,
  setGlobalSettings,
} from '../actions';
import { tryStopNotifications } from '../notification/notifTokens';
//import AccountDetails from '../account/AccountDetails';
//import AwayStatusSwitch from '../account/AwayStatusSwitch';
import { getOwnUser } from '../users/userSelectors';
import { getIdentity } from '../account/accountsSelectors';
import { getUserStatus } from '../user-statuses/userStatusesModel';

//import { handleStreamNotificationChange, handleOnlineNotificationChange, handleOfflineNotificationChange } from '../settings/NotificationsScreen'
import * as api from '../api';


type Props = $ReadOnly<{|
    navigation: AppNavigationProp<'reset'>,
    route: RouteProp<'reset', void>,

|}>;


export default function ResetScreen(props: Props): Node {
    const theme = useGlobalSelector(state => getGlobalSettings(state).theme);
    const _ = useContext(TranslationContext);
    const dispatch = useDispatch();
    //const ownUserId = useSelector(getOwnUserId);
    //const awayStatus = useSelector(state => getUserStatus(state, ownUserId).away);

    const auth = useSelector(getAuth);
    const offlineNotification = useSelector(state => getSettings(state).offlineNotification);
    const onlineNotification = useSelector(state => getSettings(state).onlineNotification);
    const streamNotification = useSelector(state => getSettings(state).streamNotification);

      const OfflineToDefault = useCallback(() => {
          api.toggleMobilePushSettings({
            auth,
            opp: 'offline_notification_change',
            value: false,
          });
        }, [offlineNotification, auth]);

        const OnlineToDefault = useCallback(() => {
          api.toggleMobilePushSettings({
            auth,
            opp: 'online_notification_change',
            value: false,
          });
        }, [onlineNotification, auth]);

        const StreamToDefault = useCallback(() => {
          api.toggleMobilePushSettings({
            auth,
            opp: 'stream_notification_change',
            value: false,
          });
        }, [streamNotification, auth]);



    return (
     <Screen title ="Reset">
        <NestedNavRow label="Reset to Default Settings"
         onPress={() => {
         Alert.alert(
         _('Are you sure?'),
         _('This will reset all of your settings back to default. Including Language.'),
         [
            { text: _('Cancel'), style: 'cancel' },
            {
              text: _('Reset'),
              style: 'destructive',
              onPress: () => {
                dispatch(setGlobalSettings({theme: 'default'}));
                dispatch(StreamToDefault);
                dispatch(OnlineToDefault);
                dispatch(OfflineToDefault);
                //api.updateUserStatus(auth, { awayStatus: false });
                NavigationService.dispatch(navigateToProfile());
              },
            },
         ],
         { cancelable: true },
         );
         }}
        />
     </Screen>
    );
}