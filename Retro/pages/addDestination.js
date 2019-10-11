import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Realm from './schemas';
let realm;
export default class Destination extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            destination: '',
            destinations: [],
        }
        realm = new Realm({ path: 'RRRR.realm' });
        
        var dest = realm.objects('DESTINATIONS');

        this.state = {
          destinations: dest,
        };
        console.log("Destination", this.state.destinations.length)
    }

    loadData = async() => {
      let value 
      try {
        value = await AsyncStorage.getItem('@destination')

      } catch(e) {
        // read error
        console.log(e);
      }
      return value
      
    }
    
    componentWillMount() {
  
      this.setState({ loading: 'true' });
      this.loadData().then((value) => {
        this.setState({
          destination: value,
          loading: 'false'
        });
        console.log("Destination: " + destination)
      });
    }
  

    onOCRClickListener = (ocr) => {
    this.props.navigation.navigate('OCR', { type: "destination" })
    }

    onLoginClickListener = (ocr) => {
        
    }
    addDestination = async() =>
    {
      var from = this.props.navigation.getParam('from', 'error:notFound')
      var check = this.state.destinations.filtered('destination="' + this.state.destination +'"');
      if(check.length > 0){
        var check2 = this.state.check.filtered('deleted == false')
        if(check2 >0){
        console.log("It's not Empty! ")
        Alert.alert(
        'Error',
        'This destination is already in the list',
        [
          {
            text: 'Ok',
            
          },
        ])}}
        else{
          realm.write(() => {
            var ID1 = realm.objects('DESTINATIONS').sorted('destination_id',true).length > 0 ? realm.objects('DESTINATIONS').sorted('destination_id', true)[0].destination_id + 1 : 1;
            realm.create('DESTINATIONS', {
            destination_id: ID1,
            destination: this.state.destination,
            deleted:false
            })
            console.log("DESTINATIONID: " + ID1);
        });
        Alert.alert(
          'Success',
          'Destination has been added',
          [
            {
              text: 'Ok',
              
            },
          ])
        }
        if(from === 'fuel')
        {
          try {
            console.log("this.state.destination: " + this.state.destination)
            await AsyncStorage.setItem('@destination', this.state.destination);
          }
        catch (e) {
            // saving error
            console.log(e);
          }
          this.props.navigation.push('FUELCLAIM')
      }
      else if(from === 'destination')
      {
        /*try {
          await AsyncStorage.removeItem('@destination')
          }
          catch(e) {
          // remove error
          }*/
        this.props.navigation.push('Destination')
      }
    }
    render() {
      console.log("destination: ", this.state.destination)
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
                    <TouchableHighlight onPress={() => this.onOCRClickListener('out')}>
                        <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/camera/ultraviolet/50/3498db'}}/>
                    </TouchableHighlight>

                    <TextInput style={styles.inputs}
                        placeholder="destination"
                        keyboardType="default"
                        underlineColorAndroid='transparent'
                        defaultValue = {this.state.destination}
                        editable = {true}
                        onChangeText={(destination) => this.setState({destination})}
                        />
                </View>
            <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.addDestination()}
            >

            <Text style={styles.loginText}>Add Destination</Text>
            </TouchableHighlight>
        
      </View>
        )
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
  },
  picker: {
    width: 250,
  },
});