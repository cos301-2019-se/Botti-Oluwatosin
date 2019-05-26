/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, StyleSheet, Text, View,
  Button, PermissionsAndroid, Alert,
  ActivityIndicator,
} from 'react-native';
import GetLocation from 'react-native-get-location';

/*const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});*/

//type Props = {};
export default class App extends Component {
    state = {
        location: null,
        loading: false,
    }

    _requestLocation = () => {
        this.setState({ loading: true, location: null });

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        })
        .then(location => {
            this.setState({
                location,
                loading: false,
            });
        })
        .catch(ex => {
            const { code, message } = ex;
            console.warn(code, message);
            if (code === 'CANCELLED') {
                Alert.alert('Location cancelled by user or by another request');
            }
            if (code === 'UNAVAILABLE') {
                Alert.alert('Location service is disabled or unavailable');
            }
            if (code === 'TIMEOUT') {
                Alert.alert('Location request timed out');
            }
            if (code === 'UNAUTHORIZED') {
                Alert.alert('Authorization denied');
            }
            this.setState({
                location: null,
                loading: false,
            });
        });
    }
  
    render() {
        return (
            /*<View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>*/
            <View style={styles.container}>
                <Text style={styles.welcome}>Claims-App</Text>
                <Text style={styles.instructions}>To get location, press the button:</Text>
                <View style={styles.button}>
                    <Button
                        disabled={this.state.loading}
                        title="Get Location"
                        onPress={this._requestLocation}
                    />
                </View>
                {this.state.loading ? (
                    <ActivityIndicator />
                ) : null}
                {this.state.location ? (
                    <Text style={styles.location}>
                        {JSON.stringify(this.state.location, 0, 2)}
                    </Text>
                ) : null}
                <Text style={styles.instructions}>Extra functions:</Text>
                <View style={styles.button}>
                    <Button
                        title="Open App Settings"
                        onPress={() => {
                            GetLocation.openAppSettings();
                        }}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Open Gps Settings"
                        onPress={() => {
                            GetLocation.openGpsSettings();
                        }}
                    />
                </View>

                
            </View>      
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    location: {
        color: '#333333',
        marginBottom: 5,
    },
    button: {
        marginBottom: 8,
    }
});