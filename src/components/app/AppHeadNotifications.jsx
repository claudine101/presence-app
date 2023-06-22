import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableNativeFeedback, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
export default function AppHeadNotifications({TITRE}) {
    const user = useSelector(userSelector)
    const navigation = useNavigation()
    return (
        <View style={styles.cardHeader}>
            <TouchableNativeFeedback
                        style={{}}
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={{ padding: 10 }}>
                            <Ionicons name="arrow-back-sharp" size={24} color={COLORS.primary} />
                        </View>
                    </TouchableNativeFeedback>
                    {TITRE ? <Text style={styles.logo}>{TITRE}</Text>:<Text style={styles.logo}>Notifications</Text>}
            
            <TouchableNativeFeedback
                onPress={() => navigation.navigate("NotificationScreen", { service: 1 })}
                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                <View style={{ marginTop: 20, padding: 10 }}>
                    {/* <Ionicons name="add-circle-sharp" size={35} color="#18678E" /> */}
                </View>
            </TouchableNativeFeedback>
        </View >
    )
}
const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    menuOpener: {
        padding: 10
    },
    menuOpenerLine: {
        height: 3,
        width: 30,
        backgroundColor: COLORS.primary,
        marginTop: 5,
        borderRadius: 10
    },
    imgBackground: {
        flex: 1,
        width: '100%',
        height: "100%"
    },
    logo: {
        fontSize: 16,
        fontWeight: 'bold',
        color:COLORS.primary
    },
})