import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { ActivityIndicator, FlatList, Image, Text, TouchableNativeFeedback, View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useCallback, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import AppHeader from "../../../components/app/AppHeader";
import moment from "moment"
export default function VerificateurFlashScreen() {
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    const [folio, setFolios] = useState([])

    useFocusEffect(useCallback(() => {
        (async () => {
            try {

                const res = await fetchApi(`/uploadEDMRS/folio/folioUploads`)
                setFolios(res.result)
                console.log(res)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    const handleFlashPress = flash => {
        navigation.navigate("DetailsUploadScreen", { flash })
    }
    return (
        <>
            <AppHeader title="Folio enregiste to  EDRMS" />
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating size={'large'} color={'#777'} />
            </View> : <View style={styles.container}>
                {
                    folio.length == 0 ? <View style={styles.emptyContainer}>
                        <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                        <Text style={styles.emptyLabel}>Aucun dossier trouvé</Text>
                    </View> :
                        <View style={styles.content}>
                            {<View style={styles.folioList}>
                                <FlatList
                                    data={folio}
                                    keyExtractor={(_, index) => index}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableNativeFeedback key={index} onPress={() => handleFlashPress(item)}>
                                                <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                    <View style={styles.folio}>
                                                        <View style={styles.folioLeftSide}>
                                                            <View style={styles.folioImageContainer}>
                                                                <Image source={require("../../../../assets/images/usb-flash-drive.png")} style={styles.folioImage} />
                                                            </View>
                                                            <View style={styles.folioDesc}>
                                                                <Text style={styles.folioName}>{item.flashs.NOM_FLASH}</Text>
                                                                {/* <Text style={styles.folioSubname}>Chef d'équipe: { item.user.NOM } { item.user.PRENOM }</Text> */}
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <AntDesign name="calendar" size={20} color="#777" />
                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                            {moment(item.DATE_INSERTION).format('DD/MM/YYYY HH:mm')}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                            {item.folios.length} dossier{item.folios.length > 1 && 's'}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableNativeFeedback>
                                        )
                                    }}
                                    style={styles.folioList}
                                />
                            </View>}

                        </View>
                }

            </View>
            }

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    headerBtn: {
        padding: 10
    },
    title: {
        paddingHorizontal: 5,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#777',
    },
    detailsHeader: {
        paddingHorizontal: 10
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectLabel: {
        marginLeft: 5
    },
    flash: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    flashName: {
        marginLeft: 5
    },
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        padding: 10,
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
    },
    folioList: {
        // paddingHorizontal: 10
    },
    actions: {
        padding: 10
    },
    actionBtn: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: COLORS.primary
    },
    actionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
    selectContainer: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ddd",
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    selectedValue: {
        color: '#777',
        marginTop: 2
    },
    content: {
        paddingHorizontal: 10
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    modalTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        fontSize: 16
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    listItemImageContainer: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemImage: {
        width: '30%',
        height: '30%',
    },
    listItemDesc: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listNames: {
        marginLeft: 10
    },
    listItemTitle: {
        fontWeight: 'bold'
    },
    listItemSubTitle: {
        color: '#777',
        fontSize: 12,
        marginTop: 5
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        width: 100,
        height: 100,
        opacity: 0.8
    },
    emptyLabel: {
        fontWeight: 'bold',
        marginTop: 20,
        color: '#777',
        fontSize: 16
    },
})