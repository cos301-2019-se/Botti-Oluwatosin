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
            loading: 'initial',
            email   : '',
            password: '',
            kmBefore: 0,
            kmAfter: 0,
        }
    }
    loadData = async() => {
      
      
      let values
      try {
        values = await AsyncStorage.multiGet(['@ODOMETER_START', '@ODOMETER_END'])

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
          kmBefore: values[0][1],
          kmAfter: values[1][1],
          loading: 'false'
        });
        console.log("KmBefore: " + kmBefore + " KmAfter: " + kmAfter)
      });
    }  

    onLoginClickListener = (ocr) => {
        this.props.navigation.push('OCR', { claim: "fuel" })
    }
    
    onRegisterClickListener = (out) => {
      this.props.navigation.navigate('Output', {start:this.state.kmBefore, end:this.state.kmAfter})
    }
    /*onRegisterClickListener = (end) => {
        //this.props.navigation.navigate('Register')
        this.setState({
            tracker: false
        });
    }*/

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
            <TouchableHighlight onPress={() => this.onLoginClickListener('ocr')}>
                <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/camera/ultraviolet/50/3498db'}}/>
            </TouchableHighlight>

            <TextInput style={styles.inputs}
                placeholder="kilometers"
                keyboardType="decimal-pad"
                underlineColorAndroid='transparent'
                defaultValue = {this.state.kmBefore}
                editable = {true}
                onChangeText={(kmBefore) => this.setState({kmBefore})}
                />
        </View>
        
      
        
        <View style={styles.inputContainer}>
            <TouchableHighlight onPress={() => this.onLoginClickListener('ocr')}>
                <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/camera/ultraviolet/50/3498db'}}/>
            </TouchableHighlight>

            <TextInput style={styles.inputs}
                placeholder="kilometers"
                keyboardType="decimal-pad"
                underlineColorAndroid='transparent'
                defaultValue = {this.state.kmAfter}
                editable = {true}
                onChangeText={(kmAfter) => this.setState({kmAfter})}
                />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.onRegisterClickListener('out')}
        >

          <Text style={styles.loginText}>Submit Claim</Text>
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