import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableNativeFeedback, View, Text,TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';

/**
 * Un composant pour afficher l'entente de volume planifier de l'application
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date le 11/7/2023
 * @param {*} param0 
 * @returns 
 */

export default function AppHeader({ title }) {
    const user = useSelector(userSelector)
    const navigation = useNavigation()
    return (
        <View style={styles.cardHeader}>
            <TouchableNativeFeedback
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                <View style={styles.menuOpener}>
                    <View style={styles.menuOpenerLine} />
                    <View style={[styles.menuOpenerLine, { width: 15 }]} />
                    <View style={[styles.menuOpenerLine, { width: 25 }]} />
                </View>
            </TouchableNativeFeedback>
           
                <Text style={styles.logo}>{title}</Text>
            <TouchableOpacity 
            // onPress={() => {
            //             modal.current?.open()

            //         }}
                    >
            <View style={{ padding: 10 }}>
                <Ionicons name="filter-sharp" size={25} color={COLORS.primary} />
            </View>
            </TouchableOpacity>
           
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
        fontWeight: 'bold'
    },
    badge: {
        minWidth: 10,
        minHeight: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#EF4255',
        position: 'absolute',
        top: 10,
        right: 5,
        justifyContent: "center",
        alignItems: "center",
  },
    badgeText: {
        textAlign: 'center',
        fontSize: 8,
        color: '#FFF',
        fontWeight: "bold"
    },
})