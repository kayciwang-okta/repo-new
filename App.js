import React, { Component } from 'react';
import { Button } from 'react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';
import TokenClient from './src/token-client';
import * as WebBrowser from 'expo-web-browser';

const tokenClient = new TokenClient({
  issuer: 'https://dev-403914.okta.com/oauth2/default',
  client_id: '0oamm83gkANhgFvga356',
  redirect_uri: __DEV__ ?
    'exp://localhost:8081:/+expo-auth-session' :
    'com.okta.dev-403914:/+expo-auth-session'
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { authenticated: false };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await tokenClient.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated: authenticated });
    }
  }

  async login() {
    await tokenClient.signInWithRedirect();
    this.checkAuthentication();
  }

  async logout() {
    await tokenClient.signOut();
    this.checkAuthentication();
  }

  render() {
    return (
      <View>
        <Text>Okta + React Native</Text>
        {this.state.authenticated ?
          <Button
            onPress={async () => {this.logout()}}
            title="Logout"
          /> :
          <Button
            onPress={async () => {this.login()}}
            title="Login"
          />
        }
      </View>
    );
  }
}
