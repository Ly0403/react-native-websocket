import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ToastAndroid,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

import EncryptedStorage from 'react-native-encrypted-storage';

class FCM extends Component {
  state = {
    email: '',
    password: '',
    backend: 'https://buddyx.lyofficial.online',
  };

  public listenTopicTest = async () => {
    await messaging().subscribeToTopic('test');
    messaging().requestPermission({
      alert: true,
      announcement: true,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    });
    messaging().onMessage(message => {
      console.log(message.data);
      if (message.data) {
        ToastAndroid.show(message.data.message as string, ToastAndroid.SHORT);
      }
    });
  };

  public login = async () => {
    try {
      const loginRes = await auth().signInWithEmailAndPassword(
        this.state.email,
        this.state.password,
      );
      const deviceToken = await messaging().getToken();
      await firestore()
        .collection('fcmTokens')
        .doc(loginRes.user.email as string)
        .set({deviceToken});

      await EncryptedStorage.setItem(
        'idtoken',
        await loginRes.user.getIdToken(),
      );
    } catch (error) {
      console.log(error);
    }
  };
  public render() {
    this.listenTopicTest();
    return (
      <SafeAreaView
        style={[this.styles.container, {backgroundColor: '#10B6B8'}]}>
        <View style={this.styles.page}>
          <TextInput
            style={this.styles.textInput}
            placeholder="Email"
            placeholderTextColor="#eee"
            keyboardType="phone-pad"
            value={this.state.email}
            onChangeText={email => {
              this.setState({email});
            }}
            maxLength={25}
          />
          <TextInput
            style={this.styles.textInput}
            placeholder="Password"
            placeholderTextColor="#eee"
            keyboardType="phone-pad"
            value={this.state.password}
            onChangeText={password => {
              this.setState({password});
            }}
            maxLength={25}
          />
          <TouchableOpacity
            style={[this.styles.themeButton, {marginTop: 20}]}
            onPress={this.login}>
            <Text style={this.styles.themeButtonTitle}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#4444',
    },
    page: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      marginTop: 20,
      width: '90%',
      height: 40,
      borderColor: '#555',
      borderWidth: 2,
      borderRadius: 5,
      paddingLeft: 10,
      color: '#fff',
      fontSize: 16,
    },
    themeButton: {
      width: '90%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#030606',
      borderColor: '#555',
      borderWidth: 2,
      borderRadius: 5,
    },
    themeButtonTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'red',
    },
    verificationView: {
      width: '100%',
      alignItems: 'center',
      marginTop: 51,
    },
  });
}

export default FCM;
