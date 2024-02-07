import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';

class PhoneAuth extends Component {
  state = {
    phone: '',
    confirmResult: null,
    verificationCode: '',
    userId: '',
    email: '',
    password: '',
    token: '',
    callCategoryReqView: false,
    name: '',
    location: '',
    categoryName: '',
    backend: 'https://buddyx.lyofficial.online',
  };

  changePhoneNumber = () => {
    this.setState({confirmResult: null, verificationCode: ''});
  };

  verifyToken = async (token: string) => {
    const response = await fetch(
      `${this.state.backend}/api/v1/auth/verifyToken`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      },
    );
    const data = await response.json();
    return data;
  };

  addCategoryReq = async () => {
    try {
      const jwttoken = await EncryptedStorage.getItem('token');
      const categoryNames = [];
      categoryNames.push(this.state.categoryName);
      const response = await fetch(
        `${this.state.backend}/api/v1/category/request/add`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwttoken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.state.name,
            location: this.state.location,
            categoryNames,
          }),
        },
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  getCategories = async () => {
    const jwttoken = await EncryptedStorage.getItem('token');
    const response = await fetch(` ${this.state.backend}/api/v1/category/all`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data.categories[0]);
    this.setState({callCategoryReqView: true});
  };

  handleSendCode = async () => {
    try {
      const authr = auth();
      authr.settings.appVerificationDisabledForTesting = true;
      // const result = await authr.signInWithPhoneNumber(this.state.phone);
      const result = await authr.signInWithEmailAndPassword(
        this.state.email,
        this.state.password,
      );
      this.setState({confirmResult: result});
      const token = await result.user.getIdToken();
      const newToken = await this.verifyToken(token);
      await EncryptedStorage.setItem('token', newToken.token);
    } catch (error) {
      console.log(error);
    }
  };

  renderConfirmationCodeView = () => {
    return (
      <View style={this.styles.verificationView}>
        <TextInput
          style={this.styles.textInput}
          placeholder="Verification code"
          placeholderTextColor="#eee"
          value={this.state.verificationCode}
          keyboardType="numeric"
          onChangeText={verificationCode => {
            this.setState({verificationCode});
          }}
          maxLength={6}
        />
      </View>
    );
  };

  renderCategoryReq = () => {
    return (
      <View style={this.styles.verificationView}>
        <TextInput
          style={this.styles.textInput}
          placeholder="UserName"
          placeholderTextColor="#eee"
          value={this.state.name}
          keyboardType="phone-pad"
          onChangeText={name => {
            this.setState({name});
          }}
        />
        <TextInput
          style={this.styles.textInput}
          placeholder="Location"
          placeholderTextColor="#eee"
          value={this.state.location}
          keyboardType="phone-pad"
          onChangeText={location => {
            this.setState({location});
          }}
        />
        <TextInput
          style={this.styles.textInput}
          placeholder="CategoryNames"
          keyboardType="phone-pad"
          onChangeText={categoryName => {
            this.setState({categoryName});
          }}
        />
        <TouchableOpacity
          style={[this.styles.themeButton, {marginTop: 20}]}
          onPress={this.addCategoryReq}>
          <Text style={this.styles.themeButtonTitle}>
            {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView
        style={[this.styles.container, {backgroundColor: '#4C10A9'}]}>
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
            editable={this.state.confirmResult ? false : true}
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
            editable={this.state.confirmResult ? false : true}
          />
          <TouchableOpacity
            style={[this.styles.themeButton, {marginTop: 20}]}
            onPress={
              this.state.confirmResult
                ? this.changePhoneNumber
                : this.handleSendCode
            }>
            <Text style={this.styles.themeButtonTitle}>
              {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[this.styles.themeButton, {marginTop: 20}]}
            onPress={this.getCategories}>
            <Text style={this.styles.themeButtonTitle}>Get Categories</Text>
          </TouchableOpacity>
          {this.state.callCategoryReqView ? this.renderCategoryReq() : null}
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
      backgroundColor: '#10A9A4',
      borderColor: '#555',
      borderWidth: 2,
      borderRadius: 5,
    },
    themeButtonTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#4C10A9',
    },
    verificationView: {
      width: '100%',
      alignItems: 'center',
      marginTop: 51,
    },
  });
}

export default PhoneAuth;
