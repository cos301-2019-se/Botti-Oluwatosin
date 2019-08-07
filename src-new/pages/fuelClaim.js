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
import GpsLocationTracker from '../gps/GpsLocationTracker' ;

export default class LoginView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tracker: false,
            email   : '',
            password: '',
            kmBefore: 0,
            kmAfter: 0,
        }
    }

    onLoginClickListener = (ocr) => {
        this.props.navigation.navigate('OCR', { claim: "fuel" })
    }
    
    onRegisterClickListener = (start) => {
        //this.props.navigation.navigate('Register')
        if( start == "start" ){
            this.setState({
                tracker: true
            });
        }else{
            this.setState({
                tracker: false
            });
        }
    }
    /*onRegisterClickListener = (end) => {
        //this.props.navigation.navigate('Register')
        this.setState({
            tracker: false
        });
    }*/

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.inputContainer}>
            <TouchableHighlight onPress={() => this.onLoginClickListener('ocr')}>
                <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/camera/ultraviolet/50/3498db'}}/>
            </TouchableHighlight>

            <TextInput style={styles.inputs}
                placeholder="kilometers"
                keyboardType="decimal-pad"
                underlineColorAndroid='transparent'
                onChangeText={(kmBefore) => this.setState({kmBefore})}/>
        </View>
        
      
        
        <View style={styles.inputContainer}>
            <TouchableHighlight onPress={() => this.onLoginClickListener('ocr')}>
                <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/camera/ultraviolet/50/3498db'}}/>
            </TouchableHighlight>

            <TextInput style={styles.inputs}
                placeholder="kilometers"
                keyboardType="decimal-pad"
                underlineColorAndroid='transparent'
                onChangeText={(kmAfter) => this.setState({kmAfter})}/>
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