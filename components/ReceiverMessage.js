import React from 'react'
import { View, Text, Image } from 'react-native';
import tw from "tailwind-rn";

const ReceiverMessage = ({ message }) => {
    return (
        <View
            style={[
                tw("bg-blue-400 rounded-lg rounded-bl-none px-5 py-3 -left-0 mx-3 my-2"),
                { alignSelf:"flex-start" },
            ]}
        >
            <Image
                style={tw("w-12 h-12 rounded-full absolute top-0 -left-8")}
                source={{
                    uri: message.photoURL,
                }}
            />
            <Text style={tw("text-white")}>{message.message}</Text>
        </View>
    )
}

export default ReceiverMessage;
