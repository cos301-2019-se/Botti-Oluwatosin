import React, { Component } from 'react';
import {
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Thumbnail,
    Icon,
    Left,
    Body,
    Right,
    Title} from 'native-base';
import{
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    TouchableOpacity
   } from 'react-native';
import test from './images/test.json';
import Lightbox from 'react-native-lightbox';
//import Carousel from 'react-native-looped-carousel';
import Realm from 'realm';
let realm;

const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;
const { height, width} = Dimensions.get('window'); 

/*const renderCarousel = () => (
    <Carousel style={{ width: WINDOW_WIDTH, height: WINDOW_WIDTH }}>
      <Image
        style={{ flex: 1 }}
        resizeMode="contain"
        source={{ uri: './images/example.jpg' }}
      />
      <View style={{ backgroundColor: '#6C7A89', flex: 1 }}/>
      <View style={{ backgroundColor: '#019875', flex: 1 }}/>
      <View style={{ backgroundColor: '#E67E22', flex: 1 }}/>
    </Carousel>
  )*/

export default class LoginView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading:true,
            dataSource: [],
        }

        realm = new Realm({ path: 'RRRR.realm' });
        var claims = realm.objects('travel_claims');
        this.state = {
            dataSource: claims,
          };
    }

    componentDidMount() {
        this.setState({
            isLoading:false,
            //dataSource:claims
        });
    }

    render() {
        let display = this.state.dataSource.map(function (result, index){
        return (
            <View key={result.id}>
                <Card> 
                    <CardItem cardBody>
                    <Lightbox springConfig={{tension: 15, friction: 7}} renderContent={() => (
        <Image 
        source={require('./images/example.jpg')}
        resizeMode="contain"
        style={{ flex: 1 , height, width}}
         />
       )}>
                            <Thumbnail square source={require('./images/example.jpg')} />
                        </Lightbox> 
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text> Date: {result.date}</Text>
                            <Text> Distance: {result.distance}km</Text>
                            <Text> Claim Amount: {result.amount.toFixed(2)}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        )
        });

        return (
            <Container>
                <Content>
                    {display}
                </Content>
            </Container>
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
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
    },
    contain:{
        flex: 1,
        height:150,
    },
    carousel: {
        height: WINDOW_WIDTH - BASE_PADDING * 2,
        width: WINDOW_WIDTH - BASE_PADDING * 2,
        backgroundColor: 'white',
      }
    /*FuelClaim: {
        backgroundColor: "#8AD32E",
    },
    FuelClaimText: {
        color: 'white',
    }*/
});