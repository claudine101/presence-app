import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Text, TouchableNativeFeedback, useWindowDimensions, View, Image, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import moment from 'moment'
import { Ionicons, AntDesign, MaterialIcons, Feather, } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeadNotifications";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';


/**
 * Screen pour afficher  les details d'un notifications
 * @author NDAYISABA claudine <claudinet@mediabox.bi>
 * @date 17/045/2023  à 10:29
 * @returns 
 */
export default function NotificationDetailScreen() {
    const [setNotications] = useState([])
    const route = useRoute()
    const { notification } = route.params
    const user = useSelector(userSelector)
    const navigation = useNavigation()

    return (
        <>
            <AppHeader TITRE={notification.TITRE} />
            <TouchableNativeFeedback >
                <View style={styles.header}>
                    <View style={styles.cardEntete}>
                        <View style={styles.cardDescription}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={30}>
                                    {notification.CONTENU}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableNativeFeedback>
  
           {user.ID_PROFIL!=3 ? <TouchableNativeFeedback onPress={() => navigation.navigate('DetailCourrierScreen', { courrier: notification, detailNotification: true })}>
                <View style={styles.headerNotification}>
                    <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={30}>cliquer  ici pour  voir les details de ce courrier</Text>
                </View>
            </TouchableNativeFeedback>:<TouchableNativeFeedback onPress={() => navigation.navigate('DetailCourrierSortantScreen', { courrier: notification, detailNotification: true })}>
                <View style={styles.headerNotification}>
                    <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={30}>cliquer  ici pour  voir les details de ce courrier</Text>
                </View>
            </TouchableNativeFeedback>}
        </>
    )
}

const styles = StyleSheet.create({
    actionIcon: {
        width: 45,
        height: 45,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionLabel: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        fontWeight: 'bold',
    },
    action: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    container: {
        paddingVertical: 380
    },
    availableServicesContainer: {
        flex: 1,
        backgroundColor: '#171717',
        padding: 10,
    },

    availableHeader: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20
    },
    titles: {
        fontWeight: "bold",
        fontSize: 20,
        paddingHorizontal: 10,
        marginLeft: 10,
        marginBottom: 10

    },
    icon: {
        marginHorizontal: 5,
        borderRadius: 100,
        width: 50,
        height: 50,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain'
    },
    buttonRightSide: {
        flexDirection: "row",
        alignItems: "center"
    },
    buttonLabels: {
        marginLeft: 10
    },
    buttonTitle: {
        fontWeight: "bold"
    },
    buttonDescription: {
        color: '#777',
        fontSize: 12
    },
    icons: {
        marginHorizontal: -15,
        marginTop: 25
    },

    availableTitle: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "bold",
        opacity: 0.9,
        marginHorizontal: 5
    },
    item: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "red",
        opacity: 0.9
    },

    itemligne: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginHorizontal: 10,
        marginLeft: 10
    },
    headerRead: {
        borderRadius: 8,
        backgroundColor: "#ddd",
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    iconRead: {
        marginHorizontal: 5,
        borderRadius: 100,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",

    },
    header: {
        borderRadius: 8,
        backgroundColor: "white",
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    headerNotification: {
        borderRadius: 8,
        backgroundColor: "white",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    evService: {
        height: 100,
        borderRadius: 15,
        backgroundColor: '#2e2d2d',
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 10,
    },
    evServiceImageContainer: {
        height: '100%',
        width: '30%'
    },
    evServiceImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    evServiceName: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "bold",
        paddingHorizontal: 10,
        marginLeft: 15
    },
    cardDescription: {
        marginLeft: 5,
        flex: 1
    },
    cardEntete: {
        flexDirection: "row",
    },
    titleObject: {
        fontWeight: "bold",

    },
    title: {
        color: '#777',
        fontSize: 15
    },
    titleStatut: {
        fontSize: 8,
        color: "#18678E"
    },
    contenu: {
        color: '#fff',
    },
    contain: {
        backgroundColor: '#f2f6f7',
        paddingHorizontal: 10
    },
    emptyContaier: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    emptyTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        fontSize: 15
    },
    emptyDesc: {
        color: '#777',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 20
    }
})