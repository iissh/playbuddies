import React from 'react'
import { View, Text, SafeAreaView } from 'react-native';
import ChatList from '../components/ChatList';
import HeaderChat from '../components/HeaderChat';

const ChatScreen = () => {
    return (
        <SafeAreaView>
            <HeaderChat title="Chat" />
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen;
