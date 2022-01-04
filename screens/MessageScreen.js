import { useRoute } from '@react-navigation/native';
import tw from "tailwind-rn";
import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TextInput, Button, TouchableWithoutFeedback, Keyboard, FlatList, KeyboardAvoidingView } from 'react-native'
import HeaderChat from '../components/HeaderChat'
import useAuth from '../hooks/useAuth';
import getMatchUserInfo from '../lib/getMatchUserInfo';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const { matchDetails } = params;
    useEffect(() => 
        onSnapshot(
            query(
                collection(db, 'matches', matchDetails.id, 'messages'), 
                orderBy('timestamp', 'desc')
        ), 
        (snapshot) => 
            setMessages(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
    )), [matchDetails, db]);
    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        })
    };
    return (
        <SafeAreaView style={tw("flex-1")}>
            <HeaderChat title={getMatchUserInfo(matchDetails?.users, user.uid).displayName} callEnabled/>
            <KeyboardAvoidingView
                behaviour={Platform.OS == "ios" ? "padding" : null}
                style={{flex: 1}}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        inverted={-1}
                        data={messages}
                        style={tw("pl-4")}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item: message }) => 
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} message={message} />
                            ) : (
                                <ReceiverMessage key={message.id} message={message} />
                            )
                        }
                    />

                </TouchableWithoutFeedback>
                <View
                    style={tw("flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2")}
                >
                    <TextInput
                        style={tw("h-10 text-lg")}
                        placeholder="Send a Message ..."
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button onPress={sendMessage} title="Send" color="#0872D0"/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MessageScreen
