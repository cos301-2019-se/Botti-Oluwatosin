import React, { Component } from 'react';
import{Dimensions,StyleSheet,View,ActivityIndicator,FlatList,Text,TouchableHighlight,TouchableOpacity,Image, Alert} from "react-native";
import {Thumbnail,}from 'native-base';
import { Icon } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import Lightbox from 'react-native-lightbox';
//import Carousel from 'react-native-looped-carousel';
import test from './images/test.json';
import Realm from './schemas';
let realm;
import { HeaderBackButton } from 'react-navigation';

const { height, width} = Dimensions.get('window');


export default class LoginView extends Component {
  static navigationOptions = ({navigation}) => {
    return{
      headerLeft:(<HeaderBackButton tintColor='#ffffff' onPress={()=>{navigation.navigate('HOME')}}/>)
   }
  }
constructor(props) {
  super(props);
  this.state = {
    isLoading:true,
    destinations:[],
    selected:[],
    active:false
  }

  realm = new Realm({ path: 'RRRR.realm' });
  var dest = realm.objects('DESTINATIONS');

  dest = dest.map(item =>{
    item.isSelect = false;
    //item.deleted = false
    item.selectedClass = styles.list;

    return item;
  })

  this.state = {
    destinations: dest,
  };
  
}

componentDidMount(){

  this.setState({
      isLoading:false,
  });
}

FlatListItemSeparator = () => <View style={styles.line} />;

selectItem = data => {
  data.isSelect = !data.isSelect;
  data.selectedClass = data.isSelect ? styles.selected : styles.list;

  const index = this.state.destinations.findIndex(
    item => data.destination_id === item.id
  );

  this.state.destinations[index] = data;

  this.setState({
    destinations: this.state.destinations,
  });
};

options()
{
  this.props.navigation.navigate("NewDestination", {from: "destination"});
}
deleteDestination =(data) =>{
  data.map((result,index)=>{
  realm.write(() => {
    result.deleted = !result.deleted;
    })
    console.log("Deleted Item", result.destination)
    
    result.isSelect = !result.isSelect;
    data.selectedClass = data.isSelect ? styles.selected : styles.list;
  
    const i = this.state.destinations.findIndex(
      item => result.destination_id === item.id
    );
    
    this.state.destinations[i] = result;
    //this.state.dataSource.map((item))
      
    this.setState({
      destinations: this.state.destinations,
    });
  
  //console.log("DataSource contains " + this.state.dataSource.length + " items after deletion")
})
  Alert.alert(
    'Success',
    'Destination(s) deleted successfully',
    [
      {
        text: 'Ok',
        
      },
    ])
}
Delete = () =>{
  var selectedItems = this.state.destinations.filter(item=>item.isSelect).length
  if(selectedItems < 1)
  {
  Alert.alert(
    'Error',
    'You must select at least one destination to delete?',
    [
      {
        text: 'Ok',
      }
        
    ])
  }
  else{
  this.setState({
    selected: this.state.destinations.filter(item => item.isSelect)
  })
  Alert.alert(
  'Delete',
  'Are you sure you would like to delete '+ selectedItems + ' destination(s)?',
  [
    {
      text: 'Ok',onPress: () => {this.deleteDestination(this.state.selected)}},
      {text: 'Cancel',}
      
  ])}
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
    
  const itemNumber = this.state.destinations.filter(item => item.isSelect).length;
  return (
    <View style = {styles.container}>
      <FlatList
        data={this.state.destinations}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        keyExtractor={(item) => item.destination_id.toString()}
        //keyExtractor = {(item, index) => index.toString()}
        extraData={this.state}
        renderItem={({item}) => {
          if(item.deleted === false){
          return(
              <TouchableOpacity
								style={[styles.list, item.selectedClass]}
								underlayColor="transparent"
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
                  <Text style={styles.lightText}>{item.destination}</Text>
                  </View>
            </TouchableOpacity>
            )
        }}
      }
        />
        {/*<View style={styles.numberBox}>
    <Text style={styles.number}>{itemNumber}</Text>
      </View>*/}
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
  <TouchableOpacity style={styles.icon}>
    <View>
      <Icon
        raised
        name="plus"
        type="font-awesome"
        color="#e3e3e3" 
        size={30} 
        onPress={() => this.options()}
        containerStyle={{ backgroundColor: "#8AD32E" }}
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
    paddingLeft: 36,
    fontSize: 24
   },
});