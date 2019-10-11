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

export default class ProfileView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            username: '',
            email   : '',
            textInputDisableStatus : false
        }
    }
    loadData = async() => {
      
      
      let values
      try {
        values = await AsyncStorage.multiGet(['@userName', '@userNumber'])

      } catch(e) {
        // read error
        console.log(e);
      }
      return values
      
    }

    componentDidMount() {
  
      this.setState({ loading: 'true' });
      this.loadData()
      .then((values) => {
        this.setState({
          username: values[0][1],
          email: values[1][1],
          loading: 'false',
          textInputDisableStatus : false
        });
        console.log("username: " + username + " user email: " + email)
      });
    }  
    _signOutAsync = async () => {
      const keys = ['@userName', '@userNumber']
      try {
      await AsyncStorage.multiRemove(keys)
      }
      catch(e) {
      // remove error
      }
      console.log('Done'+ keys +'removed')
    this.props.navigation.navigate('Auth');
    }
    onPressButton = () => {  
        this.setState({ TextInputDisableStatus: true })  
        }
    _updateAsync = async () => {
    try {
        console.log("this.state.username: " + this.state.username)
        await AsyncStorage.setItem('@userName', this.state.username);
      }
    catch (e) {
        // saving error
        console.log(e);
      }

      try {
        console.log("this.state.email: " + this.state.email)
        await AsyncStorage.setItem('@userNumber', this.state.email);
      }
    catch (e) {
        // saving error
        console.log(e);
      }
      this.setState({ TextInputDisableStatus: false })
      let values
      try {
        values = await AsyncStorage.multiGet(['@userName', '@userNumber'])
      } catch(e) {
        // read error
        console.log(e);
      }
      console.log(values)
  };
  
  render() {
    if (this.state.loading === 'initial') {
      console.log('This happens 2nd - after the class is constructed. You will not see this element because React is still computing changes to the DOM.');
      return <Text h2>Intializing...</Text>;
    }


    else if (this.state.loading === 'true') {
      console.log('This happens 5th - when waiting for data.');
      return <Text h2>Loading...</Text>;
    }
    return (
        <View style={styles.container}>

        <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="username"
                keyboardType="default"
                underlineColorAndroid='transparent'
                defaultValue = {this.state.username}
                editable = {this.state.TextInputDisableStatus}
                onChangeText={(username) => this.setState({username})}
                />
        </View>
        
        <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                defaultValue = {this.state.email}
                editable = {this.state.TextInputDisableStatus}
                onChangeText={(email) => this.setState({email})}
                />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this._updateAsync()}
        >

          <Text style={styles.loginText}>Update</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this._signOutAsync()}
        >

          <Text style={styles.loginText}>Log Out</Text>
        </TouchableHighlight>
      </View>
    );
  }
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