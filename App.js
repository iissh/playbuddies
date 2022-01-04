import { StatusBar } from 'expo-status-bar';
import { Button, LogBox, StyleSheet, Text, View } from 'react-native';
import tw from 'tailwind-rn';
import StackNavigator from './StackNavigator';
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AuthProvider } from './hooks/useAuth';
LogBox.ignoreAllLogs(); // Ignore log notif by message

export default function App() {
  return (
    <NavigationContainer>
      { /* HOC */ }
      <AuthProvider>
        {/* Passes down auth stuff*/}
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
    
  );
}
