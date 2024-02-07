/* eslint-disable @typescript-eslint/no-unused-vars */
import {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';

export default class MessageBroker extends Component {
  public state = {
    text: 'BEFORE PUSH',
  };

  startwebSocket = () => {
    try {
      const ws = new WebSocket('ws://server uri/', 'ws');
      ws.onopen = () => {
        // connection opened
        console.log('opened');
        ws.send('something'); // send a message
      };
      ws.onmessage = e => {
        // a message was received
        console.log(e.data);
        ToastAndroid.show(e.data, ToastAndroid.LONG);
        this.setState({text: e.data});
      };
      ws.onclose = e => {
        console.log('closed');
        setTimeout(() => {
          this.startwebSocket();
        }, 4000);
      };
    } catch (error) {
      console.log(error);
    }
  };

  public render() {
    this.startwebSocket();
    return (
      <SafeAreaView style={this.styles.container}>
        <SafeAreaView style={this.styles.inside}>
          <Text style={this.styles.headText}>{this.state.text}</Text>
        </SafeAreaView>
      </SafeAreaView>
    );
  }

  public styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#68045B',
    },
    inside: {
      flex: 1,
      backgroundColor: 'red',
      width: 200,
      height: 20,
      marginTop: 100,
      marginLeft: '25%',
      marginBottom: 300,
      borderRadius: 140,
    },
    headText: {
      fontSize: 32,
      color: '#F3F3F3',
      textAlign: 'center',
      verticalAlign: 'auto',
      marginTop: '50%',
    },
  });
}
