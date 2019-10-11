import React, { Component } from 'react';
import{Dimensions,StyleSheet,View,ActivityIndicator,FlatList,Text,TouchableOpacity,Image, Alert, Modal} from "react-native";
import {Thumbnail,}from 'native-base';
import { Icon } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import Lightbox from 'react-native-lightbox';
//import Carousel from 'react-native-looped-carousel';
import test from './images/test.json';
import Realm from './schemas';
let realm;
import firebase from '../config/firebase'

const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;
const { height, width} = Dimensions.get('window');
const iconChecked = require("./images/checked.png");

export default class LoginView extends Component {
constructor(props) {
  super(props);
  this.ref = firebase.firestore().collection('claims');
  this.state = {
    isLoading:true,
    dataSource: [],
    destinations:[],
    selected:[],
    defaultUser: "",
    active: false
  }

  realm = new Realm({ path: 'RRRR.realm' });
  var dest = realm.objects('DESTINATIONS');
  var claims = realm.objects('TRAVEL_CLAIMS');
  claims = claims.map(item =>{
    item.isSelect = false;
    //item.deleted = false;
    item.selectedClass = styles.list;

    return item;
  })

  //console.log("claims: " + claims);
  this.state = {
    dataSource: claims,
    destinations: dest,
  };
}
async componentWillMount() {
  try{
  var user = await AsyncStorage.getItem('@userName');
  if (user) {
    this.setState({
      defaultUser: user
    });
  }
}
catch(e) {
  // read error
  console.log(e);
}

}
componentDidMount(){

  this.setState({
      isLoading:false,
  });
}
  //console.log("DataSource Contains: ", this.state.dataSource);
FlatListItemSeparator = () => <View style={styles.line} />;

selectItem = data => {
  data.isSelect = !data.isSelect;
  data.selectedClass = data.isSelect ? styles.selected : styles.list;

  const index = this.state.dataSource.findIndex(
    item => data.claim_id === item.id
  );

  this.state.dataSource[index] = data;

  this.setState({
    dataSource: this.state.dataSource,
  });
};

addClaimToFirebase(data)
    { 
      let Tclaims = data.map((result, index) => { //foreach clain
        console.log("ID: " + result.claim_id + "Distance ID: " + result.client);
        var destination = realm.objects('DESTINATIONS').filtered('destination_id=' + result.client);
        if(destination.length > 0){
            console.log('Destination:' + destination[0].destination); // get destination name
        }
        //unselect item and remove highlight
        result.isSelect = !result.isSelect;
        result.selectedClass = result.isSelect ? styles.selected : styles.list;
        if(result.migrated === false)
        {
          this.ref.add({
          amount: result.amount.toFixed(2),
          date: result.date,
          distance: result.distance,
          type: result.type,
          username: this.state.defaultUser,
          destination: destination[0].destination,
          deleted: false
          });
          realm.write(() => {
            console.log('ID', result.claim_id);
            var update = realm.objects('TRAVEL_CLAIMS').filtered('claim_id =' + result.claim_id);
            console.log('obj', update);
              if(update.length > 0){
                update[0].migrated = true;
                this.setState({
                  dataSource: this.state.dataSource
                })
              }
          })
        }
      })

      Alert.alert(
        'Success',
        'Your claims have been submitted successfully',
        [
          {
            text: 'Ok',
            
          },
        ])
    }

Upload = () =>{
  var selectedItems = this.state.dataSource.filter(item=>item.isSelect).length
  if(selectedItems < 1)
  {
  Alert.alert(
    'Error',
    'You must select at least one claim to submit?',
    [
      {
        text: 'Ok',
      }
        
    ])
  }
  else{
  this.setState({
    selected: this.state.dataSource.filter(item => item.isSelect)
  })
  Alert.alert(
  'Submit',
  'Submit '+ selectedItems + ' claim(s)?',
  [
    {
      text: 'Ok',onPress: () => {this.addClaimToFirebase(this.state.selected)}},
      {text: 'Cancel',}
      
  ])}
}
deleteClaim =(data) =>{
  data.map((result,index)=>{
  realm.write(() => {
    result.deleted = !result.deleted;
    })
    
    result.isSelect = !result.isSelect;
    data.selectedClass = data.isSelect ? styles.selected : styles.list;
  
    const i = this.state.dataSource.findIndex(
      item => result.claim_id === item.id
    );
  
    this.state.dataSource[i] = result;
    //this.state.dataSource.map((item))
  
    this.setState({
      dataSource: this.state.dataSource,
    });
  
  //console.log("DataSource contains " + this.state.dataSource.length + " items after deletion")
})
  Alert.alert(
    'Success',
    'Claim(s) deleted successfully',
    [
      {
        text: 'Ok',
        
      },
    ])
}
Delete = () =>{
  var selectedItems = this.state.dataSource.filter(item=>item.isSelect).length
  if(selectedItems < 1)
  {
  Alert.alert(
    'Error',
    'You must select at least one claim to delete?',
    [
      {
        text: 'Ok',
      }
        
    ])
  }
  else{
  this.setState({
    selected: this.state.dataSource.filter(item => item.isSelect)
  })
  Alert.alert(
  'Delete',
  'Are you sure you would like to delete '+ selectedItems + ' claim(s)?',
  [
    {
      text: 'Ok',onPress: () => {this.deleteClaim(this.state.selected)}},
      {text: 'Cancel',}
      
  ])}
}
Update=()=>{ // you still need to work on this. where will you display current info, where can they type in changes? Modal
 var selectedItems = this.state.dataSource.filter(item => item.isSelect);
 var selectedItem = selectedItems[0]; 
}

render() {
  if(this.state.isLoading){
      return(
          <View>
              <ActivityIndicator />
          </View>
      )
  }
  else{
    
  const itemNumber = this.state.dataSource.filter(item => item.isSelect).length;
  var submitted="";
  //console.log("DataSource contains " + this.state.dataSource.length + " items")
  return (
    <View style = {styles.container}>
      <FlatList
        data={this.state.dataSource}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        keyExtractor={(item) => item.claim_id.toString()}
        //keyExtractor = {(item, index) => index.toString()}
        extraData={this.state}
        renderItem={({item}) => {
          //if(item.deleted === false){
          var destination = realm.objects('DESTINATIONS').filtered('destination_id=' + item.client);
            if(destination.length > 0){
            console.log('Destination:' + destination[0].destination); // get destination name
            var finalDestination =destination[0].destination;
            }
            if(item.migrated === true)
            {
                submitted = "Yes";
            }
            else
            {
                submitted = "No";
            }return(
              <TouchableOpacity
								style={[styles.list, item.selectedClass]}
								underlayColor="transparent"
                //onPress={() => this.setState({ indexChecked: item.claim_id })}
                onPress={() => this.selectItem(item)}
							>
                
                {/*<Lightbox springConfig={{tension: 15, friction: 7}} renderContent={() => (
                <Image source={require('./images/example.jpg')}
                  resizeMode="contain"
                  style={{ flex: 1 , height, width}}
                />
                )}>
                <Thumbnail square source={require('./images/example.jpg')} />
                </Lightbox>*/}
                  <View>
                  <Text style={styles.lightText}>{item.date}</Text>
                  <Text style={styles.lightText}>Distance: {item.distance}km </Text>
                  <Text style={styles.lightText}>Client/Destination: {finalDestination}</Text>  
                  <Text style={styles.lightText}>Submitted: {submitted}</Text>
                  </View>
            </TouchableOpacity>
            )
        }}
      //}
        />
        {/*<TouchableOpacity style={styles.icon3}>
    <View>
      <Icon
        raised
        name="edit"
        type="font-awesome"
        color="#e3e3e3" 
        size={25} 
        onPress={() => this.goToStore()}
        containerStyle={{ backgroundColor: "#DCDCDC" }}
      />
    </View>
    </TouchableOpacity>*/}

 <View style={styles.numberBox2}>
    <Text style={styles.number}>{itemNumber}</Text>
  </View>
        <TouchableOpacity style={styles.icon2}>
    <View>
      <Icon
        raised
        name="trash"
        type="font-awesome"
        color="#e3e3e3" 
        size={25} 
        onPress={() => this.Delete()}
        containerStyle={{ backgroundColor: "#DCDCDC" }}
      />
    </View>
 </TouchableOpacity>
        <View style={styles.numberBox}>
    <Text style={styles.number}>{itemNumber}</Text>
  </View>
  
  <TouchableOpacity style={styles.icon}>
    <View>
      <Icon
        raised
        name="upload"
        type="font-awesome"
        color="#e3e3e3" 
        size={25} 
        onPress={() => this.Upload()}
        containerStyle={{ backgroundColor: "#DCDCDC" }}
      />
    </View>
 </TouchableOpacity>
    </View>
  );}
      }
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: "#DCDCDC",
    paddingVertical: 50,
    position: "relative"
   },

	alignCenter: {
		lineHeight: 40,
		color: 'black'
	},

	title: {
		padding: 10
  },
  list: {
    paddingVertical: 5,
    margin: 3,
    flexDirection: "row",
    backgroundColor: "#DCDCDC",
    alignItems: "center",
    zIndex: -1
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor:"rgba(255,255,255,0.5)"
  },
  selected: {backgroundColor: "#8AD32E"},
  
  icon: {
    position: "absolute",  
    bottom: 20,
    width: "100%", 
    left: 290, 
    zIndex: 1
  },
  icon2: {
    position: "absolute",  
    bottom:100,
    width: "100%", 
    left: 290, 
    zIndex: 1
  },
  icon3: {
    position: "absolute",  
    bottom: 180,
    width: "100%", 
    left: 290, 
    zIndex: 1
  },
  numberBox: {
    position: "absolute",
    bottom: 60,
    width: 30,
    height: 30,
    borderRadius: 15,  
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center"
  },
  numberBox2: {
    position: "absolute",
    bottom: 144,
    width: 30,
    height: 30,
    borderRadius: 15,  
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center"
  },
  number: {fontSize: 14,color: "#000"},
  lightText: {
    width: 200,
    paddingLeft: 15,
    fontSize: 18
   },
});