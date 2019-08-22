/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, TouchableOpacity, ImageBackground, Text, TouchableHighlight, StyleSheet, ScrollView, NativeModules} from 'react-native';
import style, {screenHeight, screenWidth} from "../styles";
import {RNCamera as Camera} from "react-native-camera";
import RNTextDetector from "react-native-text-detector";
import AsyncStorage from '@react-native-community/async-storage';

type Props = {};
var textString = "";

const PICTURE_OPTIONS = {
    quality: 1,
    fixOrientation: true,
    forceUpOrientation: true
};

export default class OCR extends Component<Props> {

    state = {
        loading: false,
        image: null,
        error: null,
        visionResp: [],
        total: 0,
        date: "",
        odometerStart: '',
        odometerEnd:''
    };

    async componentWillMount() {
        const odometerStart = await AsyncStorage.getItem('@ODOMETER_START');
        if (odometerStart) {
          this.setState({
            odometerStart,
          });
        }
      }

    onLoginClickListener = (out) => {
        this.props.navigation.navigate('Output')
    }

    // takePicture


    takePicture = async camera => {
        this.setState({
            loading: true
        });
        try {
            const data = await camera.takePictureAsync(PICTURE_OPTIONS); //data is equal to the picture taken with the camera
            //const data = ./images/example.jpg'
            if (!data.uri) {
                throw "OTHER";
            }
            this.setState(
                {
                    image: data.uri
                },
                () => {
                    //console.log("image");
                    this.processImage(data.uri, {
                        height: data.height,
                        width: data.width
                    });
                });
        } catch (e) {
            console.warn(e);
            this.reset(e);
            throw e;
        }
    };

    //Handles errors through-out the process

    reset(error = "OTHER") {
        this.setState(
            {
                loading: false,
                image: null,
                error
            },
            () => {
                // setTimeout(() => this.camera.startPreview(), 500);
            }
        );
    }


    // processImage
    // Gets image from react-native-camera to start the processing

    processImage = async (uri, imageProperties) => {
        try {
            const visionResp = await RNTextDetector.detectFromUri(uri);
            console.log("image23", visionResp);
            var resp = Object.values(visionResp);// what does this line do

            //copy the data ............................
            var copyData = resp ;
            this.analyzeReceiptData(copyData);
            //..........................................
            var textReceived = JSON.stringify(resp);
            var fol = textReceived.concat("\"text\"");

            var textR = fol.replace(/(?="bounding")(.*?)(?="text")/g,"");

                textR = textR.replace(/text/g, "");
                textR = textR.replace(/,/g, "\n");
                textR = textR.replace(/:/g, "");
                textR = textR.replace(/\[/g, "");
                textR = textR.replace(/{/g, "");
                textR = textR.replace(/"/g, "");
                textR = textR.replace(/\\n/g, " ");

            console.log(textR);

            textString = textR;

            if (!(visionResp && visionResp.length > 0)) {
                throw "UNMATCHED";
            }
            this.setState({
                visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    /*Analyze Json Data from receipt, generated by ocr
    * param: receipt
    */

    analyzeReceiptData = (receipt) => {
        var info ="";
        var totalCost = 0.0;
        var datePurchase = "";
        for( line of receipt ){
            info = line.text ;
            if( (-1 !== info.search("total") || -1 !== info.search("Total") || -1 !== info.search("TOTAL") ) && totalCost === 0.0 ){
                
                totalCost = ( info.length > 6 ) ? info : 3333333 ;

                if( totalCost === info ){
                    //Remove the word total/Total/TOTAL
                    totalCost = totalCost.replace(/([a-zA-Z])/g,"");
                }else{
                    totalCost = this.getSibling(receipt, info);
                    totalCost = totalCost.replace(/([a-zA-Z])/g,"");
                    totalCost = totalCost.replace(/\\/g,"");
                }
            }

            if( -1 !== info.search("date") || -1 !== info.search("Date") || -1 !== info.search("DATE") ){
                datePurchase = ( info.length > 5 ) ? info : 8888888 ;
                
                if( datePurchase === info ){
                    //Remove the word date/Date/DATE ( check also time/Time/TIME) also remove any colons that next to these words
                    datePurchase = datePurchase.replace( /date/g, "" );
                    datePurchase = datePurchase.replace( /Date/g, "" );
                    datePurchase = datePurchase.replace( /DATE/g, "" );
                    datePurchase = datePurchase.replace( /time/g, "" );
                    datePurchase = datePurchase.replace( /Time/g, "" );
                    datePurchase = datePurchase.replace( /TIME/g, "" );
                }else{
                    datePurchase = this.getSibling( receipt , info );
                }
            }
            /*var blockInfo = info.split("\n");
            for( inline of blockInfo ){
                if( new Date(inline) !== "Invalid Date" && !isNaN(new Date(inline) )){
                //if( new Date(inline) !== "Invalid Date"  ){
                    datePurchase = inline ;
                }
            }*/
        }

        this.setState({
            total: totalCost,
            date: datePurchase
        })
    };

    /*Helps to identify the text posibly in the same line as this text
    * param: receipt
    */ 
    getSibling = ( receipt, child ) => {

        if( receipt.length === 0 ) return 0;
        var value = 0 ;
       
        var childVertical = child.bounding.top + (child.bounding.height/2) ;
        var childHorizontal = child.bounding.left + child.bounding.width ;
        var pos = 0 ;
        var counter = 0;
        shortestDist = 0;
        for( line of receipt ){
            if( line != child && line.bounding.left > childHorizontal ){
                hold = line.bounding.top + (line.bounding.height/2);
                if ( Math.abs(childVertical-hold) < Math.abs(childVertical-shortestDist) ){
                    pos = counter ;
                    shortestDist = hold ;
                }
            }
            counter++ ;
        }

        value = receipt[pos].text ;
        value = value.replace(/(?=[a-zA-Z])(.*?)(?=\\n)/g,"");
        value = value.replace(/\\n/g,"");
        return value;
    };

    /*Analyze Json Data from odometer, generated by ocr
    * param: odometer
    */
    getOdometerReading = () => {

    };

    setReading = async (rText) => {
        console.log("I have entered the function")
       
        const number = rText.replace(/ /g, "");
        if(this.state.odometerStart === '')
        {
            console.log("OdometerStart state is not set")
            
            try {
                await AsyncStorage.setItem('@ODOMETER_START', number)
                this.setState({odometerStart: number});
              } catch(e) {
                // save error
                console.log(e);
              }
            
              console.log('Done.')
            
            const value = await AsyncStorage.getItem('@ODOMETER_START')
            if(value !== null) {
            // value previously stored
            console.log("ODOMETER_START has been set", value );
            console.log("odometerStart:", this.state.odometerStart);
            }
            this.props.navigation.push('FUELCLAIM'); 
        }
        else
        {   console.log("OdometerStart state should be set, but not yet OdometerEnd")
            try {
                await AsyncStorage.setItem('@ODOMETER_END', number);
                this.setState({odometerEnd:number});
                } catch(e) {
                // save error
                console.log(e);
              }
            
            const value = await AsyncStorage.getItem('@ODOMETER_END')
            if(value !== null) {
                console.log("ODOMETER_END has been set", value );
                console.log("odometerEnd:", this.state.odometerEnd);
            }
            
            //this.props.navigation.navigate('Output', {start:this.state.odometerStart, end:this.state.odometerEnd})
            this.props.navigation.push('FUELCLAIM');
        }
        
      };

    // mapVisionRespToScreen
    // Shows where text is being detected

    mapVisionRespToScreen = (visionResp, imageProperties) => {
        const IMAGE_TO_SCREEN_Y = screenHeight / (imageProperties.height);
        const IMAGE_TO_SCREEN_X =  screenWidth / (imageProperties.width/1.7) ;
        const leftX = screenWidth /  (imageProperties.width );
        console.log(textString);

        return visionResp.map(item => {
            return {
                ...item,
                position: {
                    width: item.bounding.width * IMAGE_TO_SCREEN_X,
                    left: item.bounding.left * leftX,
                    height: item.bounding.height * IMAGE_TO_SCREEN_Y,
                    top: item.bounding.top * IMAGE_TO_SCREEN_Y
                }
            };
        });
    };
    /*mapVisionRespToScreen = (visionResp, imageProperties) => {
        const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
        const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;
    
        return visionResp.map(item => {
          return {
            ...item,
            position: {
              width: item.bounding.width * IMAGE_TO_SCREEN_X,
              left: item.bounding.left * IMAGE_TO_SCREEN_X,
              height: item.bounding.height * IMAGE_TO_SCREEN_Y,
              top: item.bounding.top * IMAGE_TO_SCREEN_Y
            }
          };
        });
      };*/

   /*onLoginClickListener = (out) => {

        //this.props.navigation.navigate('Output', { total: this.state.total, date: this.state.date, text: textString })
        const claim = this.props.navigation.getParam('claim', 'error: not found');
        if( claim === "fuel" ){
            this.props.navigation.navigate('Output', { odometer: this.state.odometer})
        }else{
            this.props.navigation.navigate('Output', { total: this.state.total, date: this.state.date})
        }
        this.props.navigation.navigate('Output', { total: this.state.total, date: this.state.date})
    }*/
    onLoginClickListener = (out) => {

        this.props.navigation.navigate('Output', {text: textString})
    }

    render() {
        return (
            
            <View style={style.screen}>
                {!this.state.image ? (
                    <Camera
                        ref={cam => {
                            this.camera = cam;
                        }}
                        key="camera"
                        style={style.camera}
                        notAuthorizedView={null}
                        playSoundOnCapture
                        zoom = {this.state.zoomValue}
                    >
                        {({camera, status}) => {
                            if (status !== "READY") {
                                return null;
                            }
                            return (
                                <View style={style.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => this.takePicture(camera)}
                                        style={style.button}
                                    />
                                </View>
                            );
                        }}
                    </Camera>
                ) : null}
                {this.state.image ? (
                    <ImageBackground
                        source={{uri: this.state.image}}
                        style={style.imageBackground}
                        key="image"
                        resizeMode="cover"
                    >
                        {this.state.visionResp.map(item => {
                            return (
                                <TouchableOpacity
                                    style={[style.boundingRect, item.position]}
                                    key={item.text}
                                    onPress={() => this.setReading(item.text)}
                                    //onPress={() => this.onLoginClickListener('out')}
                                />
                            );
                        })}
                    </ImageBackground>
                ) : null}
                {this.state.image ?(
                    <Text h1> Please select the field you want to capture</Text>
                    
                ) :null}



               



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
        marginBottom:20,
        width:250,
        borderRadius:30,

        position: "absolute",
        bottom: 36,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    loginButton: {
        backgroundColor: "#8AD32E",
    },
    loginText: {
        color: 'white',
    },
    opacity:{
    marginBottom:30,
    width:260,
    alignItems: 'center',
    opacity:0.5
    }
});