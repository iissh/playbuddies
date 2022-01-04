import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, documentSnapshot, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import createId from "../lib/createId";
const HomeScreen = () => {
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    const { logout, user } = useAuth();
    const swipeRef = useRef(null);

    useLayoutEffect(() => onSnapshot(doc(db, "users", user.uid), (snapshot) => {
            if (!snapshot.exists()) {
                navigation.navigate("Modal");
            }
    }), []);

    useEffect(() => {
        let unsub;
        const fetchCards = async () => {

            const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then(snapshot => snapshot.docs.map(doc => doc.id));

            const makebuds = await getDocs(collection(db, 'users', user.uid, 'makebuds')).then(snapshot => snapshot.docs.map(doc => doc.id));

            const passedUserIds = passes.length > 0 ? passes: ['tst'];
            const makebudsUserIds = makebuds.length > 0 ? makebuds: ['tst'];

            unsub = onSnapshot(query(collection(db, "users"), where('id', 'not-in', [...passedUserIds, ...makebudsUserIds])), (snapshot) => {
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== user.uid).map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            });
        }
        fetchCards();
        return unsub;
    }, [db]);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        setDoc(doc(db,'users', user.uid, 'passes', userSwiped.id), userSwiped);
    };

    const swipeRight = async(cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const loggedInPerson = await (await getDoc(doc(db, "users", user.uid))).data();
        getDoc(doc(db, "users", userSwiped.id, "makebuds", user.uid)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    setDoc(doc(db, "users", user.uid, "makebuds", userSwiped.id), userSwiped);

                    setDoc(doc(db, "matches", createId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]:  loggedInPerson,
                            [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timestamp: serverTimestamp(),
                    });

                    navigation.navigate('Buddy', {
                        loggedInPerson,
                        userSwiped,
                    })
                } else {
                    setDoc(doc(db, "users", user.uid, "makebuds", userSwiped.id), userSwiped);
                }
            }
        );
    };

    return (
        <SafeAreaView style={tw("flex-1")}>
            { /*Header*/ }
            <View style={tw(" flex-row items-center justify-between px-5")}>
                <TouchableOpacity onPress={logout}>
                    <Image  style={tw("w-10 h-10 rounded-full")} source={{ uri: user.photoURL }}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image style={[tw("w-12 h-10"), { marginTop: "3%"},]} source={require("../logo.png")} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#3E9AEC"/>
                </TouchableOpacity>
            </View>

            <View style={tw("flex-1 -mt-6")}>
                <Swiper 
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: "transparent" }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log("pass");
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log("match");
                        swipeRight(cardIndex);
                        console.log("match2");
                    }}
                    backgroundColor={"#4FD0E9"}
                    overlayLabels={{
                        left: {
                            title: "No",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "Yes",
                            style: {
                                label: {
                                    color: "green",
                                },
                            },
                        }
                    }}
                    renderCard={(card) => card ? (
                        <View key={card.id} style={tw("bg-white h-3/4 rounded-xl")}>
                            <Image style={tw("absolute top-0 h-full w-full rounded-xl")} source={{ uri: card.photoURL }}/>
                            <View style={[tw("absolute bottom-0 bg-white flex-row justify-between items-center w-full px-6 py-2 h-20 rounded-b-xl"), styles.cardShadow]}>
                                <View>
                                    <Text style={tw("text-xl font-bold")}>{card.displayName}</Text>
                                    <Text style={tw(" text-gray-400 font-bold")} >{card.job}</Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>
                    ) : ( 
                        <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"), styles.cardShadow,]}>
                            <Text style={tw("font-bold pb-5 text-lg")}>No More New Buddies</Text>
                            <Image
                                style={tw("h-20 w-full")}
                                height={100}
                                width={100}
                                source={require("../nomoreprofiles.png")}
                            />

                        </View>
                    )}
                />
            </View>
            <View style={tw("flex flex-row justify-evenly")}>
                <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()} style={tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}>
                    <Entypo name="cross" size={24} color="red"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => swipeRef.current.swipeRight()} style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}>
                    <AntDesign name="heart" size={24} color="green"/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});
