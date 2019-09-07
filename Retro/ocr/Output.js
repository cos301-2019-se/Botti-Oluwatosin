import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
//import all the components we are going to use.
import AsyncStorage from '@react-native-community/async-storage';
import Realm from 'realm';
let realm;


export default class SecondPage extends Component {

constructor(props){
    super(props);
    this.state = {
      //default value of the date time
      date: '',
      distance:0,
      user: '',
      type:'',
      amount:0
    };
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
    that.setState({
      //Setting the value of the date time
      date:
        date + '/' + month + '/' + year,
    });
  }

  clearStart = async () => {
    realm.write(() => {
      var ID = realm.objects('travel_claims').sorted('claim_id',true).length > 0 ? realm.objects('travel_claims').sorted('claim_id', true)[0].claim_id + 1 : 1;
      realm.create('travel_claims', {
        claim_id: ID,
        client: "Example Client",
        distance: this.state.distance,
        date: this.state.date,
        amount: this.state.amount,

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
    });
    const keys = ['@ODOMETER_START', '@ODOMETER_END']
    try {
    await AsyncStorage.multiRemove(keys)
    }
    catch(e) {
    // remove error
    }

  console.log('Done'+ keys +'removed')
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

    render() {
        //const date = this.props.navigation.getParam('date', 'error: not found');
        //const total = this.props.navigation.getParam('total', 'error: not found');
        //const text =  this.props.navigation.getParam('text', 'nothing sent');
        const start = this.props.navigation.getParam('start', 'error: not found');
        const end = this.props.navigation.getParam('end', 'error: not found');
        const type = this.props.navigation.getParam('type', 'error: not found');
        var startInt = parseInt(start,10);
        var endInt = parseInt(end, 10);
        var distance = endInt - startInt;
        var amount = distance * 3.64;
        console.log("Testing conversion of string to int...Start: " + startInt + " End: " + endInt + " Distance: " + distance)
        this.state.distance = distance;
        this.state.type = type;
        this.state.amount = amount;

        return (
            <View style={styles.container}>

                <Text>--------------------------</Text>
                <Text>Date:{this.state.date}</Text>
                <Text>Claim Type:{this.state.type}</Text>
                <Text>Start:{start}</Text>
                <Text>End:{end}</Text>
                <Text>Distance:{this.state.distance}</Text>
                <Text>User:{this.state.user}</Text>
                <Text>Amount:{this.state.amount}</Text>
                <Text>--------------------------</Text>
                <Button
                  testID="clear_button"
                  title="Submit"
                  onPress={this.clearStart}
                />
                <Button
                  testID="clear_button"
                  title="Log Out"
                  onPress={this._signOutAsync}
                />
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
});