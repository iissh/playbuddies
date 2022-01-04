import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import tw from "tailwind-rn";

const BuddyScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    const { loggedInPerson, userSwiped } = params;
    return (
        <View style={[tw('h-full bg-blue-600 pt-20'), { opacity: 0.9 }]}>
            <View style={tw("justify-center px-10 pt-20")}>
                <Image 
                    style={tw("h-20 w-full h-40")}
                    source={require("../newbuddyfound.png")}
                />
            </View>
            <Text style={tw("text-white text-center mt-5 font-semibold text-lg")}>
                You and {userSwiped.displayName} want to be Play Buddies!
            </Text>

            <View style={tw("flex-row justify-evenly mt-5")}>
                <Image
                    style={tw("h-32 w-32 rounded-full")}
                    source={{
                        uri: loggedInPerson.photoURL,
                    }}
                />
                <Image  
                    style={tw("h-32 w-32 rounded-full")}
                    source={{
                        uri: userSwiped.photoURL,
                    }}
                />
            </View>
            <TouchableOpacity
                style={tw("bg-white m-5 px-10 py-8 rounded-full mt-20")}
                onPress={() => {
                    navigation.goBack();
                    navigation.navigate("Chat");
                }}
            >
                <Text style={tw("text-center text-xl font-semibold")}>Send a Message</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BuddyScreen;
