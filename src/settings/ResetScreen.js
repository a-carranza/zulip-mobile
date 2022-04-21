/* @flow strict-local */

import React, { useCallback } from 'react';
import type { Node } from 'react';

import type { RouteProp } from '../react-navigation';
import type { AppNavigationProp } from '../nav/AppNavigator';
import { useSelector } from '../react-redux';
import Screen from '../common/Screen';




type Props = $ReadOnly<{|
    navigation: AppNavigationProp<'reset'>,
    route: RouteProp<'reset', void>,

|}>;