import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert, Picker, Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Realm from './schemas';
let realm;
import { HeaderBackButton } from 'react-navigation';

export default class LoginView extends Component {
  static navigationOptions = ({navigation}) => {
    return{
      headerLeft:(<HeaderBackButton tintColor='#ffffff' onPress={()=>{navigation.navigate('HOME')}}/>)
   }
  }
    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            email   : '',
            password: '',
            kmBefore: 0,
            kmAfter: 0,
            destination: '',
            destinations: [],
            destinationId: 0,
        }
        realm = new Realm({ path: 'RRRR.realm' });
        
        var dest = realm.objects('DESTINATIONS');
        var select = "";
        this.state = {
          destinations: dest,
        };
    }
    loadData = async() => {
      
      
      let values
      try {
        values = await AsyncStorage.multiGet(['@ODOMETER_START', '@ODOMETER_END', '@destination'])

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
        var d = this.state.destinations.findIndex(
        item => values[2][1] === item.destination);
        var b = d + 1;
        this.setState({
          kmBefore: values[0][1],
          kmAfter: values[1][1],
          destination: values[2][1],
          loading: 'false',
          destinationId: b,
        });
        console.log("KmBefore: " + kmBefore + " KmAfter: " + kmAfter + " Destination: " + destination)
      });
    }  

    onLoginClickListener = (ocr) => {
        this.props.navigation.push('OCR', { type: "fuel" })
    }
    
    onRegisterClickListener = async(out) => {
      if(this.state.destination !== null)
      {
        try {
            console.log("this.state.destination: " + this.state.destination)
            await AsyncStorage.setItem('@destination', this.state.destination);
          }
        catch (e) {
            // saving error
            console.log(e);
          }
        
        if(this.state.kmBefore !== null)
        {
          try {
            console.log("this.state.kmBefore: " + this.state.kmBefore)
            await AsyncStorage.setItem('@ODOMETER_START', this.state.kmBefore);
          }
        catch (e) {
            // saving error
            console.log(e);
          }

          if(this.state.kmAfter !== null)
          {
            try {
              console.log("this.state.kmAfter: " + this.state.kmAfter)
              await AsyncStorage.setItem('@ODOMETER_END', this.state.kmAfter);
            }
            catch (e) {
            // saving error
              console.log(e);
            }

            let values
            try {
              values = await AsyncStorage.multiGet(['@destination', '@ODOMETER_START', '@ODOMETER_END'])
              if(values[0][1] !== null) {
                  console.log("destination has been set", values[0][1] );
                  //console.log("destination:", this.state.destination);
              }
              else if(values[1][1] !== null){
                console.log("ODOMETER_START has been set", values[1][1]);
              }
              else if(values[2][1] !== null){
                console.log("ODOMETER_END has been set", values[2][1])
              }
            }
            catch(e) {
              // read error
              console.log(e);
            }
    
            this.props.navigation.navigate('Output', {start:this.state.kmBefore, end:this.state.kmAfter, destination: this.state.destination, type:'Fuel', destID: this.state.destinationId})
          }
          else{
            Alert.alert('Error',
            'Please enter your ending kilometres',
            [
              {
                text: 'Ok',
              }
            ])
          }
        }
      else {
        Alert.alert('Error',
        'Please enter your starting kilometres',
          [
            {
              text: 'Ok',
            }
          ])
        }
      }
    else{
      Alert.alert('Error',
      'Please enter your Destination or Client',
        [
          {
            text: 'Ok',
          }
        ])
      }
    }
    
    _saveDestination = async () => {
      if(this.state.destination !== null)
      {
      try {
          console.log("this.state.destination: " + this.state.destination)
          await AsyncStorage.setItem('@destination', this.state.destination);
        }
      catch (e) {
          // saving error
          console.log(e);
        }
      
      
      if(this.state.kmBefore !== null)
      {
        try {
          console.log("this.state.kmBefore: " + this.state.kmBefore)
          await AsyncStorage.setItem('@ODOMETER_START', this.state.kmBefore);
        }
      catch (e) {
          // saving error
          console.log(e);
        }
      }
      
      let values
      try {
      values = await AsyncStorage.multiGet(['@destination', '@ODOMETER_START'])
            if(values[0][1] !== null) {
                console.log("destination has been set", values[0][1] );
                //console.log("destination:", this.state.destination);
            }
            else if(values[1][1] !== null){
              console.log("ODOMETER_START has been set", values[1][1]);
            }
          }
          catch(e) {
            // read error
            console.log(e);
          }
  
            this.props.navigation.push('OCR', { type: "fuel" })
        }
          else{Alert.alert('Error',
      'Please enter your Destination or Client',
      [
        {
          text: 'Ok',
        }
      ])}
    };

    newDestination=(value,index) =>
    {
      console.log("It enters the newDestination function")
      if(value !== "")
      {
        if(value === "Add Destination")
        {
          this.props.navigation.navigate('NewDestination', {from: "fuel"});
        }
        this.setState({destination:value, destinationId: index})
      
      }
      
    }
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
          <Picker
            style={styles.picker}
            prompt = "Please Select a Destination/Client."
            selectedValue={this.state.destination}
            //onValueChange={(itemValue) => this.setState({destination:itemValue})}
            onValueChange={(itemValue, itemIndex) => this.newDestination(itemValue, itemIndex)}
            >
            <Picker.Item label="Select Destination" value=""/>
            {this.state.destinations.map((element) =>{
              //if(element.deleted == false)
              //{
              return <Picker.Item label={element.destination} value={element.destination}/>
              //}
            })}
            <Picker.Item label="Add New Destination" value="Add Destination"/>
          </Picker>
          
      </View>
      
        <View style={styles.inputContainer}>
            <TouchableHighlight onPress={() => this._saveDestination()}>
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
            <TouchableHighlight onPress={() => this._saveDestination()}>
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
  },
  picker: {
    width: 250,
  },
});