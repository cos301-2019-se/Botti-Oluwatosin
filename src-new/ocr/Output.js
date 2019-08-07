import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text } from 'react-native';
//import all the components we are going to use.

export default class SecondPage extends Component {

constructor(props){
    super(props);
    this.state = {
      //defauilt value of the date time
      date: '',
    };
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
    render() {
        //const date = this.props.navigation.getParam('date', 'error: not found');
        //const total = this.props.navigation.getParam('total', 'error: not found');
        const text =  this.props.navigation.getParam('text', 'nothing sent');
        return (
            <View style={styles.container}>

                <Text>--------------------------</Text>
                <Text>Date:{this.state.date}</Text>
                <Text>Total:{text}</Text>
                <Text>--------------------------</Text>

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