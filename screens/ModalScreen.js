import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import tw from "tailwind-rn";
import useAuth from '../hooks/useAuth';
import { db } from "../firebase";

const ModalScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const incompleteForm = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        }).then(() => {
            navigation.navigate("Home");
        })
        .catch((error) => {
            alert(error.message);
        });
    };

    return (
        <View style={tw("flex-1 items-center pt-1")}>
            <Image 
                style={tw("h-20 w-full")}
                resizeMode="contain"
                source={require("../playbuddieslogo.png")}
            />
            <Text style={tw("text-xl text-gray-500 p-2 font-bold p-2 font-bold")}>
                Welcome {user.displayName}
            </Text>

            <Text style={tw("text-center p-4 p-2 text-lg font-bold text-blue-700")}>
                Step 1: The Profile Pic
            </Text>
            <TextInput 
                value={image} 
                onChangeText={setImage} 
                style={("text-center text-xl pb-2")} 
                placeholder="Enter a Profile Pic URL"
            />
            <Text style={tw("text-center p-4 p-2 text-lg font-bold text-blue-700")}>
                Step 2: Favourite Games
            </Text>
            <TextInput 
                value={job} 
                onChangeText={setJob} 
                style={("text-center text-xl pb-2")} 
                placeholder="Enter your favourite games"
            />
            <Text style={tw("text-center text-lg p-4 p-2 font-bold text-blue-700")}>
                Step 3: The Age
            </Text>
            <TextInput 
                value={age} 
                onChangeText={setAge} 
                style={("text-center text-xl pb-2")} 
                placeholder="Enter your Age"
                keyboardType='numeric'
                maxLength={2}
            />
            <TouchableOpacity 
                disabled={incompleteForm} 
                style={[tw("w-64 p-3 rounded-xl absolute bottom-11 bg-blue-400"),
                incompleteForm ? tw("bg-gray-400") : tw("bg-blue-400"),
                ]}
                onPress={updateUserProfile}
            >
                <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ModalScreen;
