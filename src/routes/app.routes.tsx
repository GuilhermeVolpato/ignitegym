import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { Profile } from "@screens/Profile";
import { Exercise } from "@screens/Exercise";
import { History } from "@screens/History";
import { Home } from "@screens/Home";

import HomeSvg from '@assets/home.svg' ;
import ProfileSvg from '@assets/profile.svg' ;
import HistorySvg from '@assets/history.svg' ;
import { color } from "native-base/lib/typescript/theme/styled-system";


type AppRoutes = {
  Home: undefined;
  Exercise: undefined;
  Profile: undefined;
  History: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Screen name="Home" component={Home} options={{ tabBarIcon: ({color}) => <HomeSvg fill={color}/>}}/>
      <Screen name="History" component={History} />
      <Screen name="Profile" component={Profile} />
      <Screen name="Exercise" component={Exercise} />
    </Navigator>
  );
}