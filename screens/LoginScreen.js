import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity  } from 'react-native'
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";

const LoginScreen = () => {
    const { signInWithGoogle, loading } = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [])

    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
                resizeMode="cover"
                style={tw("flex-1")}
                source={require("../playbuddieshomescreen.png")}
            >
                <TouchableOpacity 
                    style={[tw("absolute bottom-40 w-52 bg-blue-200 p-4 rounded-2xl"), 
                    { marginHorizontal: "25%"}, ]}
                    onPress={signInWithGoogle}>
                    <Text style={tw("text-center font-semibold")}> Sign In and Find Your Buddies </Text>
                </TouchableOpacity>
                
            </ImageBackground>
        </View>
    );
};

export default LoginScreen
