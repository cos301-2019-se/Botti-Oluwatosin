import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            personelNumber: '', 
        }
    }

    async componentWillMount() {
      let values
      try {
        values = await AsyncStorage.multiGet(['@userName', '@userNumber'])
      } catch(e) {
        // read error
        console.log(e);
      }
      console.log(values)
    
      // example console.log output:
      // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
      }
    
      handleName = (text) => {
        this.setState({ name: text })
     }
     handleNumber = (text) => {
        this.setState({ personelNumber: text })
     }

    render() {
    return (
        <View style={styles.container}>
                <View style={styles.inputContainer}>
                    {//<Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
                    }<TextInput style={styles.inputs}
                               placeholder="John Doe"
                               placeholderTextColor = "#989898"
                               keyboardType="default"
                               underlineColorAndroid='transparent'
                               onChangeText={this.handleName}/>
                </View>
                <View style={styles.inputContainer}>
                    {//<Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
                    }<TextInput style={styles.inputs}
                               placeholder="personel number"
                               placeholderTextColor = "#989898"
                               underlineColorAndroid='transparent'
                               onChangeText={this.handleNumber}/>
                </View>
            {<Button title="Get Keys!" onPress={this.getAllKeys} />
            }
            <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this._signInAsync()}>
                    <Text style={styles.loginText}>Sign in!</Text>
                </TouchableHighlight>
      </View>
    );
  }

  _signInAsync = async () => {
    try {
        console.log("this.state.name: " + this.state.name)
        await AsyncStorage.setItem('@userName', this.state.name);
      }
    catch (e) {
        // saving error
        console.log(e);
      }

      try {
        console.log("this.state.personelNumber: " + this.state.personelNumber)
        await AsyncStorage.setItem('@userNumber', this.state.personelNumber);
      }
    catch (e) {
        // saving error
        console.log(e);
      }
    
      let values
      try {
        values = await AsyncStorage.multiGet(['@userName', '@userNumber'])
      } catch(e) {
        // read error
        console.log(e);
      }
      console.log(values)

    this.props.navigation.navigate('HOME');
  };

  getAllKeys = async () => {
    /*let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
      console.log("Problem retrieving keys for some reason")
    }
  
    console.log(keys)*/
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']

    let values
      try {
        values = await AsyncStorage.multiGet(['@userName', '@userNumber', '@ODOMETER_START', '@ODOMETER_END'])
      } catch(e) {
        // read error
        console.log(e);
      }
      console.log(values)
  };  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#DCDCDC',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
      width:30,
      height:30,
      marginLeft:15,
      justifyContent: 'center'
    },
    buttonContainer: {
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      borderRadius:30,
    },
    loginButton: {
      backgroundColor: "#8AD32E",
    },
    loginText: {
      color: 'white',
    }
  });