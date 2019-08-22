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
//import GpsLocationTracker from '../gps/GpsLocationTracker' ;

export default class LoginView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tracker: false,
            date: 0,
            total: 0,
            purpose: "Food",
        }
    }

    onClickListener = (ocr) => {
        this.props.navigation.navigate('OCR', { claim: "miscellaneous" } )
    }
    
    onSubmitClickListener = (submit) => {
        this.props.navigation.navigate('HOME')
    }

    render() {
    return (
        <View style={styles.container}>

            <View>
                <TouchableHighlight onPress={() => this.onClickListener('ocr')}>
                    <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/camera/ultraviolet/100/3498db'}}/>
                </TouchableHighlight>
            </View>    

            <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="kilometers"
                    keyboardType="phone-pad"
                    underlineColorAndroid='transparent'
                    onChangeText={(kmBefore) => this.setState({kmBefore})}/>
            </View>

            <View style={styles.inputContainer}>
                <Text>Date:</Text>
                <TextInput style={styles.inputs}
                    placeholder={ this.state.date }
                    keyboardType="default"
                    underlineColorAndroid='transparent'
                    onChangeText={(name) => this.setState({name})}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text>Total: R</Text>
                <TextInput style={styles.inputs}
                    placeholder={ this.state.total }
                    keyboardType="default"
                    underlineColorAndroid='transparent'
                    onChangeText={(name) => this.setState({name})}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text>Reason: </Text>
                <Picker
                    selectedValue={this.state.purpose}
                    style={{height: 50, width: 100}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({purpose: itemValue})
                }>
                    <Picker.Item label="Food" value="Food" />
                    <Picker.Item label="Travel" value="Travel" />
                    <Picker.Item label="Stationary" value="Stationary" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            <TouchableHighlight 
                style={[styles.buttonContainer, styles.loginButton]} 
                onPress={() => this.onSubmitClickListener('submit')}
            >
                <Text style={styles.loginText}>submit</Text>
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