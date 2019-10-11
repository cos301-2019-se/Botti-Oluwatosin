import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, Button, Alert, TouchableHighlight, TouchableOpacity } from 'react-native';
//import all the components we are going to use.
import AsyncStorage from '@react-native-community/async-storage';
import Realm from '../pages/schemas';
import {TravelClaimsSchema, DestinationsSchema} from '../pages/schemas';
import firebase from '../config/firebase'


export default class SecondPage extends Component {

constructor(props){
    super(props);
    this.ref = firebase.firestore().collection('claims');
    this.state = {
      //default value of the date time
      date: '',
      distance:0,
      user: '',
      type:'',
      amount:0,
      destination: '',
      destinationID: '',
    };
    /*realm = new Realm({path:'RRRR.realm',
    schema:[TravelClaimsSchema, DestinationsSchema]});*/
    realm = new Realm({ path: 'RRRR.realm' });
  }

  async componentWillMount() {
    let values
      try {
        values = await AsyncStorage.multiGet(['@userName', '@userNumber', '@ODOMETER_START', '@ODOMETER_END'])
        this.setState({user: values[0][1]});
      } catch(e) {
        // read error
        console.log(e);
      }
      console.log(values)
  }
  componentDidMount() {
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var destID = 0;
    that.setState({
      //Setting the value of the date time
      date:
      year + '-' + month + '-' + date,
        //date + '/' + month + '/' + year,
    });
  }
  editClaim = ()=>{
    this.props.navigation.pop();
  }
  discardClaim = async () => {
    Alert.alert(
      'Are you sure you want to discard claim?',
      'All the details of the claim will be discarded.',
      [
        {text: 'Discard', onPress: () => {this.clearClaimDetails(), this.props.navigation.navigate('HOME')}},
        {text: 'Cancel',}
    ]
    )
  }
  clearClaimDetails = async () => {
    const keys = ['@ODOMETER_START', '@ODOMETER_END', '@destination']
    try {
    await AsyncStorage.multiRemove(keys)
    }
    catch(e) {
    // remove error
    }

  console.log('Done'+ keys +'removed')
  }
  saveClaim = async () => {
      /*var destination = realm.objects('DESTINATIONS').filtered('destination=' + this.state.destination);
        if(destination.length > 0){
          console.log('Destination:' + destination[0].destination);
          destID = destination[0].destination_id;
          }
        else{
          realm.write(() => {
          var ID1 = realm.objects('DESTINATIONS').sorted('destination_id',true).length > 0 ? realm.objects('DESTINATIONS').sorted('destination_id', true)[0].destination_id + 1 : 1;
          realm.create('DESTINATIONS', {
          destination_id: ID1,
          destination: this.state.destination,
          })
          destID = ID1;
          console.log("ID: " + destID);
          console.log("DESTINATIONID: " + ID1);
      });
    //}*/
      
      realm.write(() => {
      var ID2 = realm.objects('TRAVEL_CLAIMS').sorted('claim_id',true).length > 0 ? realm.objects('TRAVEL_CLAIMS').sorted('claim_id', true)[0].claim_id + 1 : 1;
      realm.create('TRAVEL_CLAIMS', {
        claim_id: ID2,
        client: this.state.destinationID,
        distance: this.state.distance,
        date: this.state.date,
        amount: this.state.amount,
        type: this.state.type,
        migrated: false,
        deleted:false
      })
      });
      Alert.alert(
        'Success',
        'Your claim has been submitted successfully',
        [
          {
            text: 'Ok',
            onPress: () => this.props.navigation.navigate('HOME'),
          },
        ],
        { cancelable: false }
      );
    this.clearClaimDetails();
  };

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
  };

addClaimToFirebase()
{
  this.ref.add({
    amount: this.state.amount,
    date: this.state.date,
    distance: this.state.distance,
    type: this.state.type,
    username: this.state.user
  });
}
    render() {
        //const date = this.props.navigation.getParam('date', 'error: not found');
        //const total = this.props.navigation.getParam('total', 'error: not found');
        //const text =  this.props.navigation.getParam('text', 'nothing sent');
        const start = this.props.navigation.getParam('start', 'error: not found');
        const end = this.props.navigation.getParam('end', 'error: not found');
        const type = this.props.navigation.getParam('type', 'error: not found');
        const destination = this.props.navigation.getParam('destination', 'Example client')
        const destID = this.props.navigation.getParam('destID', -1)
        var startInt = parseInt(start,10);
        var endInt = parseInt(end, 10);
        var distance = endInt - startInt;
        var amount = distance * 3.64;
        console.log("Testing conversion of string to int...Start: " + startInt + " End: " + endInt + " Distance: " + distance)
        this.state.distance = distance;
        this.state.type = type;
        this.state.amount = amount;
        this.state.destination = destination;
        this.state.destinationID = destID;
        console.log("this.state.destinationID", this.state.destinationID)
        return (
            <View style={styles.container}>

                <View>
                  <Text>--------------------------</Text>
                <Text>Date:{this.state.date}</Text>
                <Text>Claim Type:{this.state.type}</Text>
                <Text>Start:{start}</Text>
                <Text>End:{end}</Text>
                <Text>Distance:{this.state.distance}</Text>
                <Text>User:{this.state.user}</Text>
                <Text>--------------------------</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                <TouchableHighlight style={[styles.buttonContainer,styles.loginButton]}
                  onPress={()=> this.editClaim()}>
                  <Text style={styles.loginText}>Edit Claim</Text>
                </TouchableHighlight>
                <Text> </Text>
                <TouchableHighlight style={[styles.buttonContainer,styles.loginButton]}
                  onPress={()=> this.discardClaim()}>
                    <Text style={styles.loginText}>Discard Claim</Text>
                </TouchableHighlight>
                <Text> </Text>
                <TouchableHighlight style={[styles.buttonContainer,styles.loginButton]}
                  onPress={()=> this.saveClaim()}>
                    <Text style={styles.loginText}>Save Claim</Text>
                  </TouchableHighlight>
            </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextStyle: {
        fontSize: 23,
        textAlign: 'center',
        color: '#f00',
    },
    buttonContainer: {
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      borderRadius:30,
      padding:10
    },
    loginButton: {
      backgroundColor: "#8AD32E",
    },
    loginText: {
      color: 'white',
    }
});