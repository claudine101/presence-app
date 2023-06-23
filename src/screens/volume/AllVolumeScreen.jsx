import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ImageBackground, ScrollView, StyleSheet, StatusBar, Text, TouchableNativeFeedback, useWindowDimensions, View, Image, TouchableOpacity, ActivityIndicator, FlatList, TouchableWithoutFeedback } from "react-native";
import moment from 'moment'
import { Ionicons, AntDesign, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { Modalize } from "react-native-modalize";
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from "../../hooks/useForm";
import { Entypo } from '@expo/vector-icons';
/**
 * Screen pour faire la liste des courries
 * @author NDAYIKENGURUKIYE Innocent <ndayikengurukiye.innocent@mediabox.bi>
 * @date 27/04/2023
 * @returns 
 */
export default function AllVolumeScreen() {
    const [loading, setLoading] = useState(true)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const [courriers, setCourriers] = useState([])
    const [nbres, setNbres] = useState(0)
    const [IsLoadingMore, setIsLoadingMore] = useState(false)
    const [offset, setOffset] = useState(0)
    const route = useRoute()
    const scanModalizeRef = useRef(null)
    const [idstatut, setIdstatut] = useState(null)
    const filterModalizeRef = useRef(null)
    const LIMIT = 10
    const [data, handleChange, setValue] = useForm({
        qcode: null,
    })
    const onLoadMore = async () => {
        try {
            setIsLoadingMore(true)
            const newOffset = offset + LIMIT
            const crs = await getCourrierEntrant(newOffset)
            setOffset(newOffset)
            setCourriers(c => [...c, ...crs.result])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingMore(false)
        }
    }


    const getCourrierEntrant = async (offset = 0, statut) => {
        try {

            var url = `/courrier/courrier_entrants/courrier?limit=${LIMIT}&offset=${offset}`
            if (statut != null) {
                setLoading(true)

                url = `/courrier/courrier_entrants/courrier?STATUT_TRAITEMENT=${statut}&limit=${LIMIT}&offset=${offset}`
            }
            return await fetchApi(url)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)

        }

    }
    const selectQcode = async () => {
        const qcode = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (qcode.type == 'cancel') {
            return false
        }
        handleChange("qcode", qcode)
    }
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                setOffset(0)
                const response = await getCourrierEntrant(0, idstatut)
                setCourriers(response.result)
            } catch (error) {
                console.log(error)
            } finally {

                setLoading(false)

            }
        })()
    }, [idstatut]))
    /**
     * Permet de recuperer les nombre de notification no lue
     *@author NDAYISABA Claudine <claudine@mediabox.bi>
    *@date 17/05/2023 à 10:33
    */
    const getNbre = async () => {
        try {
            var url = `/courrier/courrier_entrants/Nbrenotification`
            return await fetchApi(url)
        }
        catch (error) {
            console.log(error)
        }

    }
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const nombre = await getNbre()
                setNbres(nombre.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    const handleBarCodeUploaded = async ({ type, data }) => {
        try {
            setLoadingUpload(true)
            const ScanCourrier = await fetchApi(`/services/coderefernce/${data}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            navigation.navigate('DetailCourrierScreen', { courrier: ScanCourrier.result })

        } catch (error) {
            console.log(error)
            if (error.message) {
                setError(error.message)
            }
        } finally {
            setLoadingUpload(false)
        }
    };
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
            text: "Ajouter volume",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "NewVolumeScreen",
            position: 1,
            render: () => <Action title={"Courrier entrants"} image={require("../../../assets/images/mail-receive-small.png")} key={"key1"} />
        },
        {
            text: "Scanner un QR",
            icon: require("../../../assets/images/qr-code.png"),
            name: "CourrierScanScreen",
            position: 3,
            render: () => <Action title={"Scanner un QR"} image={require("../../../assets/images/qr-code.png")} key={"key3"} />
        }
    ];
    const FilterModalize = () => {
        return (
            <View style={styles.modalContainer}>
                <View style={styles.Title}>
                    <Text>Filtrer par statut</Text>
                </View>
                <View style={styles.inputCard}>

                    <View style={styles.selectContainer}>

                        <View style={{}}>

                            <Text style={[styles.selectLabel]}>
                                Statut actuel du courrier
                            </Text>
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIdstatut(null)
                                        filterModalizeRef.current?.close()
                                    }}
                                >
                                    <Text>
                                        {idstatut == null ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Tous les courries </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIdstatut(0)
                                        filterModalizeRef.current?.close()
                                    }}

                                >
                                    <Text >
                                        {idstatut == 0 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}En attente de traitement</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setIdstatut(1)
                                        filterModalizeRef.current?.close()
                                    }}
                                >
                                    <Text>
                                        {idstatut == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}Traité </Text>
                                </TouchableOpacity>
                            </View>
                            <View >


                                <TouchableOpacity
                                    onPress={() => {
                                        setIdstatut(2)
                                        filterModalizeRef.current?.close()
                                    }}
                                >
                                    <Text>
                                        {idstatut == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} En attente de validation </Text>
                                </TouchableOpacity>

                            </View>



                            <Text style={[styles.selectedValue, { color: '#333' }]}>

                            </Text>
                        </View>

                    </View>


                </View>
            </View>
        )
    }
    return (
        <>

            <AppHeader notification={nbres.NBRE} modal={filterModalizeRef}/>
            {loading ? <View style={styles.emptyContaier}>
                <ActivityIndicator animating size={'large'} color={'#777'} />
            </View> :
                courriers.length <= 0 ? <View style={styles.emptyContaier}>
                    <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                    <Text style={styles.emptyTitle}>
                        Aucun courrier trouvé
                    </Text>
                    <Text style={styles.emptyDesc}>
                        Aucun courrier réceptionné ou vous n'êtes pas affecte a aucun courrier
                    </Text>
                </View> :
                    <FlatList

                        style={styles.contain}
                        data={courriers}
                        renderItem={({ item: courrier, index }) => {
                            return (
                                user.ID_PROFIL == 3 ?
                                    <TouchableNativeFeedback onPress={() => navigation.navigate('DetailCourrierSortantScreen', { courrier: courrier })}>
                                        <View style={styles.header}>
                                            <View style={styles.cardEntete}>
                                                <View style={styles.icon}>
                                                    <Image source={require("../../../assets/images/mail-receive-small.png")} style={styles.iconImage} />
                                                </View>
                                                <View style={styles.cardDescription}>
                                                    <Text style={styles.titleObject} numberOfLines={2}>{courrier.NUMERO_REFERENCE}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        {courrier.SOCIETE ? <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                                            {courrier.SOCIETE}</Text> : <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                                            {courrier.NOM} {courrier.PRENOM}
                                                        </Text>}
                                                        <Text style={styles.titleDATE}>{moment(courrier.DATE_INSERTION).format("DD-MM-YYYY")}</Text>
                                                    </View>
                                                    <View style={{ marginTop: -10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Text style={styles.title}></Text>
                                                        <Text style={styles.titleStatut} numberOfLines={2}>{
                                                            courrier.ETAPE_ID == 1 ? "en attente du remettant" :
                                                                courrier.ETAPE_ID == 2 ? "en attente de transmission" :
                                                                    courrier.ETAPE_ID == 4 ? "en cours" :
                                                                        " Transmis"
                                                        }</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>

                                    </TouchableNativeFeedback> : <TouchableNativeFeedback onPress={() => navigation.navigate('DetailCourrierScreen', { courrier: courrier })}>
                                        {loading ? <View style={styles.emptyContaier}>
                                            <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                            <View style={styles.header}>
                                                <View style={styles.cardEntete}>
                                                    <View style={styles.icon}>
                                                        <Image source={require("../../../assets/images/mail-receive-small.png")} style={styles.iconImage} />
                                                    </View>
                                                    <View style={styles.cardDescription}>
                                                        <Text style={styles.titleObject} numberOfLines={2}>{courrier.NUMERO_REFERENCE}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            {courrier.SOCIETE ? <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                                                {courrier.SOCIETE}</Text> : <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                                                {courrier.NOM} {courrier.PRENOM}
                                                            </Text>}

                                                            <Text style={styles.title}>{moment(courrier.DATE_INSERTION).calendar(null, {
                                                                sameDay: `[Aujourd'hui]`,
                                                                lastDay: `[Hier]`,
                                                                nextDay: 'DD-MM-YYYY',
                                                                lastWeek: 'DD-MM-YYYY',
                                                                sameElse: 'DD-MM-YYYY',
                                                            })} {moment(courrier.DATE_INSERTION).format('HH:mm')}

                                                            </Text>
                                                        </View>
                                                        <View style={{ marginTop: -10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Text style={styles.title}></Text>
                                                            <Text style={styles.titleStatut} numberOfLines={2}>{
                                                                courrier.STATUT_TRAITEMENT == 0 ? "en attente de traitement" :
                                                                    courrier.STATUT_TRAITEMENT == 1 ? "traité" :
                                                                        " en attente de validation"
                                                            }</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>}
                                    </TouchableNativeFeedback>
                            )
                        }}
                        keyExtractor={(courrier, index) => index.toString()}
                        onEndReached={() => {
                            if (!IsLoadingMore) {
                                onLoadMore()
                            }
                        }}
                        ListFooterComponent={() => <ActivityIndicator animating size={"large"} color="#000" style={{ alignSelf: 'center', opacity: IsLoadingMore ? 1 : 0, marginTop: 10 }} />}
                    />}

            <FloatingAction
                actions={actions}  
                onPressItem={name => {
                    if (name == 'NewVolumeScreen') {
                        navigation.navigate("NewVolumeScreen")
                    }  else {
                        // scanModalizeRef.current?.open()
                        navigation.navigate('CourrierScanSourceScreen')
                    }
                }}
                color={COLORS.primary}
            />
            <Modalize
                ref={scanModalizeRef}
                adjustToContentHeight
                handlePosition='inside'
                modalStyle={{
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    paddingVertical: 20
                }}
                handleStyle={{ marginTop: 10 }}
                scrollViewProps={{
                    keyboardShouldPersistTaps: "handled"
                }}>
                <TouchableOpacity onPress={() => { navigation.navigate("CourrierScanSourceScreen") }}>
                    <View style={styles.inputCard}>
                        <View style={styles.iconRead}>
                            <AntDesign name="scan1" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={[styles.selectLabel, { color: COLORS.primary, marginLeft: 0 }]}>
                            Scan un Qcode
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={selectQcode}>
                    <View style={styles.inputCard}>
                        <View style={styles.iconRead}>
                            <Entypo name="upload" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={[styles.selectLabel, { color: COLORS.primary, marginLeft: 0 }]}>
                            Uploader un Qcode
                        </Text>
                    </View>
                </TouchableOpacity>
                {data.qcode ? <><View style={styles.Card}>
                    <TouchableOpacity style={styles.selectContainer}>
                        <View style={{}}>
                            <Text style={[styles.selectLabel]}>
                                Qcode
                            </Text>
                            {data.qcode ? <View>
                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                    {data.qcode.name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>{data.qcode.name.split('.')[1].toUpperCase()} - </Text>
                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                        {((data.qcode.size / 1000) / 1000).toFixed(2)} M
                                    </Text>
                                </View>
                            </View> : null}
                        </View>
                    </TouchableOpacity>
                </View>
                    <TouchableWithoutFeedback onPress={handleBarCodeUploaded}>
                        <View style={[styles.button]}>
                            <Text style={styles.buttonText}>Enregistrer</Text>
                        </View>
                    </TouchableWithoutFeedback></> : null}


            </Modalize>
            <Modalize
                ref={filterModalizeRef}
                adjustToContentHeight
                handlePosition='inside'
                modalStyle={{
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    paddingVertical: 20
                }}
                handleStyle={{ marginTop: 10 }}
                scrollViewProps={{
                    keyboardShouldPersistTaps: "handled"
                }}
            >
                <FilterModalize />
            </Modalize>
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
    Title: {

        alignItems: "center"
    },
    button: {
        marginVertical: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        // textTransform:"uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 88,
    },
    inputCard: {
        marginHorizontal: 20,
        marginTop: 10
    },
    cardFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginHorizontal: 10
    },

    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10
    },
    cardFilterContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff"
    },
    cardFilter: {
        backgroundColor: '#f2f6f7',
    },
    logo: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10
    },
    selectLabel: {
        // color: '#777',
        fontSize: 16,
        marginHorizontal: 10,
        marginBottom: 5
        // alignItems: "center",

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
    iconRead: {
        marginHorizontal: 5,
        borderRadius: 100,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ddd",
        marginTop: -5

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
        fontSize: 10
    },
    titleStatut: {
        fontSize: 8,
        color: "#18678E"
    },
    titleDATE: {
        fontSize: 5,
        color: "#777"
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
    },
    inputCard: {
        marginHorizontal: 20,
        marginTop: 10,
        flexDirection: "row"
    },
    Card: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10
    },
    inputCard: {
        marginHorizontal: 20,
        marginTop: 10
    },
})