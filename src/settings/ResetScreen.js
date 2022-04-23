/* @flow strict-local */

import React, { useCallback, useContext } from 'react';
import type { Node } from 'react';
import { ScrollView, View, Alert } from 'react-native';

import type { RouteProp } from '../react-navigation';
import type { AppNavigationProp } from '../nav/AppNavigator';
import NestedNavRow from '../common/NestedNavRow';
import SwitchRow from '../common/SwitchRow';
import Screen from '../common/Screen';

import { TranslationContext } from '../boot/TranslationProvider';
import type { MainTabsNavigationProp } from '../main/MainTabsScreen';
import * as NavigationService from '../nav/NavigationService';
import { createStyleSheet } from '../styles';
import { useDispatch, useSelector } from '../react-redux';
import ZulipButton from '../common/ZulipButton';
import {
  logout,
  navigateToAccountPicker,
  navigateToUserStatus,
  navigateToSettings,
} from '../actions';
import { tryStopNotifications } from '../notification/notifTokens';
//import AccountDetails from '../account/AccountDetails';
//import AwayStatusSwitch from '../account/AwayStatusSwitch';
import { getOwnUser } from '../users/userSelectors';
import { getIdentity } from '../account/accountsSelectors';



type Props = $ReadOnly<{|
    navigation: AppNavigationProp<'reset'>,
    route: RouteProp<'reset', void>,

|}>;


export default function ResetScreen(props: Props): Node {
    const _ = useContext(TranslationContext);
    const dispatch = useDispatch();
    const themeToDefault = useCallback(() => {
        dispatch(setGlobalSettings({ theme: 'default'}));
    }, [theme, dispatch])
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
                themeToDefault;
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