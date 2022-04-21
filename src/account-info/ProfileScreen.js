/* @flow strict-local */
import React, { useContext } from 'react';
import type { Node } from 'react';
import { ScrollView, View, Alert } from 'react-native';

import { TranslationContext } from '../boot/TranslationProvider';
import type { RouteProp } from '../react-navigation';
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
import AccountDetails from './AccountDetails';
import AwayStatusSwitch from './AwayStatusSwitch';
import { getOwnUser } from '../users/userSelectors';
import { getIdentity } from '../account/accountsSelectors';

const styles = createStyleSheet({
  buttonRow: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  button: {
    flex: 1,
    margin: 8,
  },
});

function SetStatusButton(props: {||}) {
  return (
    <ZulipButton
      style={styles.button}
      secondary
      text="Set a status"
      onPress={() => {
        NavigationService.dispatch(navigateToUserStatus());
      }}
    />
  );
}

function SettingsButton(props: {||}) {
  return (
    <ZulipButton
      style={styles.button}
      secondary
      text="Settings"
      onPress={() => {
        NavigationService.dispatch(navigateToSettings());
      }}
    />
  );
}

function SwitchAccountButton(props: {||}) {
  return (
    <ZulipButton
      style={styles.button}
      secondary
      text="Switch account"
      onPress={() => {
        NavigationService.dispatch(navigateToAccountPicker());
      }}
    />
  );
}

function LogoutButton(props: {||}) {
  const dispatch = useDispatch();
  const _ = useContext(TranslationContext);
  const identity = useSelector(getIdentity);
  return (
    <ZulipButton
      style={styles.button}
      secondary
      text="Log out"
      onPress={() => {
        Alert.alert(
          _('Log out?'),
          _('This will log out {email} on {realmUrl} from the mobile app on this device.', {
            email: identity.email,
            realmUrl: identity.realm.toString(),
          }),
          [
            { text: _('Cancel'), style: 'cancel' },
            {
              text: _('Log out'),
              style: 'destructive',
              onPress: () => {
                dispatch(tryStopNotifications());
                dispatch(logout());
              },
            },
          ],
          { cancelable: true },
        );
      }}
    />
  );
}

type Props = $ReadOnly<{|
  navigation: MainTabsNavigationProp<'profile'>,
  route: RouteProp<'profile', void>,
|}>;
/* define default setting function
function ResetToDefaultButton(props: {||}) {
    constant _ = useContext(TranslationContext);
    return (
    <ZulipButton //gives the
       style={styles.button}
       secondary
       text="Default"
       onPress{() => {
        Alert.alert(
          _('Reset To Default Settings?'),
          _('Your settings will automatically be changed to default. No more nightmode for you.', {
          }),
          [
            { text: _(), style: 'cancel' },
            {
              text: _('Reset'),
              style: 'destructive',
              onPress: () => {
                //must perform some action like reset values to default.
              },
            },

          ],
          { cancelable: true }.
        );
       }}
   />
   );
}
*/

/**
 * This is similar to `AccountDetails` but used to show the current users account.
 * It does not have a "Send private message" but has "Switch account" and "Log out" buttons.
 *
 * The user can still open `AccountDetails` on themselves via the (i) icon in a chat screen.
 */
export default function ProfileScreen(props: Props): Node {
  const ownUser = useSelector(getOwnUser);

  return (
    <ScrollView>
      <AccountDetails user={ownUser} />
      <AwayStatusSwitch />
      <View style={styles.buttonRow}>
        <SetStatusButton />
      </View>
      <View style={styles.buttonRow}>
        <SettingsButton />
      </View>
      <View style={styles.buttonRow}>
        <SwitchAccountButton />
        <LogoutButton />
      </View>
      //<View style={styles.buttonRow}>
        //<ResetToDefaultButton />
       //</View>
    </ScrollView>
  );
}
