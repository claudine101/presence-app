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
 * Screen pour faire les notifications
 * @author NDAYISABA claudine <claudinet@mediabox.bi>
 * @date 17/045/2023  à 10:29
 * @returns 
 */
export default function NotificationScreen() {
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const [notifications, setNotications] = useState([])
    const [IsLoadingMore, setIsLoadingMore] = useState(false)
    const [offset, setOffset] = useState(0)
    const route = useRoute()
    const LIMIT = 10
    const onLoadMore = async () => {
        try {
            setIsLoadingMore(true)
            const newOffset = offset + LIMIT
            const crs = await getNotification(newOffset)
            setOffset(newOffset)
            setNotications(c => [...c, ...crs.result])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingMore(false)
        }
    }

    const getNotification = async (offset = 0) => {
        try {
            var url = `/courrier/courrier_entrants/notification?limit=${LIMIT}&offset=${offset}`
            return await fetchApi(url)
        }
        catch (error) {
            console.log(error)
        }

    }
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                setOffset(0)
                const response = await getNotification(0)
                setNotications(response.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    const readSMS = async (notification) => {
        try {
            const res = await fetchApi(`/courrier/courrier_entrants/readNotification/${notification.ID_NOTIFICATIONS_RECEIVE}`, {
                method: 'PUT',
            })
            navigation.navigate('NotificationDetailScreen', { notification: notification })
        }
        catch (error) {
            console.log(error)
        }
    }
    const Action = ({ title, image }) => {
        return (
            <View style={styles.action}>
                <Text style={styles.actionLabel}>{title}</Text>
                <View style={styles.actionIcon}>
                    <Image source={image} style={{ tintColor: '#fff', maxWidth: '50%', maxHeight: '50%', minWidth: '50%', minHeight: '50%' }} />
                </View>
            </View>
        )
    }

    const actions = [
        {
            text: "Courrier entrants",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "CourrierScreen",
            position: 1,
            render: () => <Action title={"Courrier entrants"} image={require("../../../assets/images/mail-receive-small.png")} key={"key1"} />
        },
        {
            text: "Courrier sortants",
            icon: require("../../../assets/images/sortant.jpg"),
            name: "CourrierSortantScreen",
            position: 2,
            render: () => <Action title={"Courrier sortants"} image={require("../../../assets/images/send-mail-small.png")} key={"key2"} />
        },
        {
            text: "Scanner un QR",
            icon: require("../../../assets/images/qr-code.png"),
            name: "CourrierScanScreen",
            position: 3,
            render: () => <Action title={"Scanner un QR"} image={require("../../../assets/images/qr-code.png")} key={"key3"} />
        }
    ];
    const actionsDiver = [
        {
            text: "Scanner un QR",
            icon: require("../../../assets/images/qr-code.png"),
            name: "CourrierScanScreen",
            position: 3,
            render: () => <Action title={"Scanner un QR"} image={require("../../../assets/images/qr-code.png")} key={"key3"} />
        }
    ];
    const getDetail = (notification) => {
        navigation.navigate('DetailNotificationScreen', { notification: notification })
    }
    return (
        <>

            <AppHeader />
            {loading ? <View style={styles.emptyContaier}>
                <ActivityIndicator animating size={'large'} color={'#777'} />
            </View> :
                notifications.length <= 0 ? <View style={styles.emptyContaier}>
                    <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                    <Text style={styles.emptyTitle}>
                        Aucun notification trouvé
                    </Text>
                    <Text style={styles.emptyDesc}>
                        Aucun notification réceptionné ou vous n'êtes pas affecte a aucun notification
                    </Text>
                </View> :
                    <FlatList

                        style={styles.contain}
                        data={notifications}
                        renderItem={({ item: notification, index }) => {
                            return (
                                notification.IS_READ == 0 ?
                                    // <TouchableNativeFeedback onPress={() => navigation.navigate('NotificationDetailScreen', { notification: notification })}>
                                    <TouchableNativeFeedback onPress={() => readSMS(notification)}>
                                        <View style={styles.headerRead}>
                                            <View style={styles.cardEntete}>
                                                <View style={styles.iconRead}>
                                                    <Image source={require("../../../assets/images/mail-receive-small.png")} style={styles.iconImage} />
                                                </View>
                                                <View style={styles.cardDescription}>
                                                    <Text style={styles.titleObject} numberOfLines={2}>{notification.TITRE}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View style={{ maxWidth: 220 }} >
                                                            <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                                                {notification.CONTENU}</Text>
                                                        </View>
                                                        <View style={{ marginTop: 10 }}>
                                                            <Text style={styles.titleDate}>{moment(notification.DATE_INSERT).format("DD-MM-YYYY")}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </TouchableNativeFeedback> :
                                    <TouchableNativeFeedback onPress={() => navigation.navigate('NotificationDetailScreen', { notification: notification })}>
                                        <View style={styles.header}>
                                            <View style={styles.cardEntete}>
                                                <View style={styles.icon}>
                                                    <Image source={require("../../../assets/images/mail-receive-small.png")} style={styles.iconImage} />
                                                </View>
                                                <View style={styles.cardDescription}>
                                                    <Text style={styles.titleObject} numberOfLines={2}>{notification.TITRE}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View style={{ maxWidth: 220 }} >
                                                            <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                                                {notification.CONTENU}</Text>
                                                        </View>
                                                        <View style={{ marginTop: 10 }}>
                                                            <Text style={styles.titleDate}>{moment(notification.DATE_INSERT).format("DD-MM-YYYY")}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                            )
                        }}
                        keyExtractor={(notification, index) => index.toString()}
                        onEndReached={() => {
                            if (!IsLoadingMore) {
                                onLoadMore()
                            }
                        }}
                        ListFooterComponent={() => <ActivityIndicator animating size={"large"} color="#000" style={{ alignSelf: 'center', opacity: IsLoadingMore ? 1 : 0, marginTop: 10 }} />}
                    />}

            {/* <FloatingAction
                actions={user.ID_PROFIL != 3 ? actions : actionsDiver}
                onPressItem={name => {
                    if (name == 'CourrierScreen') {
                        navigation.navigate("CourrierScreen")
                    } else if (name == 'CourrierSortantScreen') {
                        navigation.navigate('CourrierSortantScreen')
                    } else {
                        navigation.navigate('CourrierScanScreen')
                    }
                }}
                color={COLORS.primary}
            /> */}

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
        fontSize: 12,
        flex: 1

    },
    titleDate: {
        color: '#777',
        fontSize: 8,
        color: COLORS.primary

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