/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createStackNavigator,createAppContainer,createSwitchNavigator, createBottomTabNavigator, createDrawerNavigator} from 'react-navigation';
import {
    ActivityIndicator,
    AsyncStorage,
    Button,
    StatusBar,
    StyleSheet,
    View,
  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HOME from './pages/home' ;
import FUELCLAIM from './pages/fuelClaim' ;
import MISCCLAIM from './pages/miscClaim' ;
import OCR from './ocr/OCR';
import Output from './ocr/Output';
import Claims from './pages/claims';
import LOGIN from './pages/signin';
import PROFILE from './pages/profile';
import Destination from './pages/destinations';
import NewDestination from './pages/addDestination';
//import SIGNIN from

class AuthLoadingScreen extends Component {
    constructor() {
      super();
      this._bootstrapAsync();
      console.disableYellowBox = true;
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('@userName');
  
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };
  
    // Render any loading content that you like here
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const Auth = createStackNavigator({
    LOGIN: {
        screen: LOGIN,
        navigationOptions: {
            title: 'Signin',
            headerStyle: {backgroundColor: '#8AD32E'},
            headerTintColor: '#ffffff',
        }
    }
});
const App = createStackNavigator({
  //const TabNavigator = createBottomTabNavigator({
    //const AppDrawerNavigator = createDrawerNavigator({
    HOME: {
        screen: HOME,
        navigationOptions: {
            title: 'HOME',
            headerStyle: {backgroundColor: '#8AD32E'},
            headerTintColor: '#ffffff',
        }
    },

    MISCCLAIM: {
        screen: MISCCLAIM,
        navigationOptions: {
            title: 'Miscellaneous Claim',
            headerStyle: {backgroundColor: '#8AD32E'},
            headerTintColor: '#ffffff',
        }
    },

    /*FuelStack: {
      screen: FUELCLAIM
    },*/
    FUELCLAIM: {
      screen: FUELCLAIM,
      navigationOptions: {
          title: 'FUELCLAIM',
          headerStyle: {backgroundColor: '#8AD32E'},
          headerTintColor: '#ffffff',
      }
    },
  
    OCR: {
      screen: OCR,
      navigationOptions: {
          title: 'OCR',
          headerStyle: {backgroundColor: '#8AD32E'},
          headerTintColor: '#ffffff',
      },
    },
  
    Output: {
      screen: Output,
      navigationOptions: {
          title: 'Output',
          headerStyle: {backgroundColor: '#8AD32E'},
          headerTintColor: '#ffffff',
      },
    },

    Claims:{
        screen: Claims,
        navigationOptions:{
            title:'Claims',
            headerStyle: {backgroundColor: '#8AD32E'},
            headerTintColor: '#ffffff',
        },
    },
    PROFILE: {
      screen: PROFILE,
      navigationOptions: {
          title: 'User Profile',
          headerStyle: {backgroundColor: '#8AD32E'},
          headerTintColor: '#ffffff',
      } 
  },
  Destination: {
    screen: Destination,
    navigationOptions: {
        title: 'Destinations',
        headerStyle: {backgroundColor: '#8AD32E'},
        headerTintColor: '#ffffff',
    } 
},
NewDestination: {
  screen: NewDestination,
  navigationOptions: {
      title: 'Destinations',
      headerStyle: {backgroundColor: '#8AD32E'},
      headerTintColor: '#ffffff',
  } 
},
});
const FuelStack = createStackNavigator({
  FUELCLAIM: {
    screen: FUELCLAIM,
    navigationOptions: {
        title: 'FUELCLAIM',
        headerStyle: {backgroundColor: '#8AD32E'},
        headerTintColor: '#ffffff',
    }
  },

  OCR: {
    screen: OCR,
    navigationOptions: {
        title: 'OCR',
        headerStyle: {backgroundColor: '#8AD32E'},
        headerTintColor: '#ffffff',
    },
  },

  Output: {
    screen: Output,
    navigationOptions: {
        title: 'Output',
        headerStyle: {backgroundColor: '#8AD32E'},
        headerTintColor: '#ffffff',
    },
  },
});

const DashboardStackNavigator = createStackNavigator({
  PROFILE: {
    screen: PROFILE,
    navigationOptions: {
        title: 'User Profile',
        headerStyle: {backgroundColor: '#8AD32E'},
        headerTintColor: '#ffffff',
    }
  },
});
//export default createAppContainer(App);
/*export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: App,
    //TabNavigator: TabNavigator,
    Auth: Auth,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));*/
const AppDrawerNavigator = createDrawerNavigator({
  HOME: {
    screen: App 
  },
  UserProfile: {
    screen: DashboardStackNavigator
  }
});
const AppSwitchNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppDrawerNavigator,
  //TabNavigator: TabNavigator,
  Auth: Auth,
});

export default createAppContainer(AppSwitchNavigator, {initialRouteName: 'AuthLoading'});
