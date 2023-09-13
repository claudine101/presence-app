import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useRef, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import Loading from "../../../components/app/Loading";
import ImageView from "react-native-image-viewing";
import moment from "moment";

export default function DetailValideScreen() {
    const route = useRoute()
    const { flashs } = route.params
    const [check, setCheck] = useState(null)
    const [loadingPvs, setLoadingPvs] = useState(false)
    const [pvs, setPvs] = useState(null)
    const folio_ids = flashs?.folios.map(folio => folio.ID_FOLIO)
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                setLoadingPvs(true)
                const form = new FormData()
                form.append('folioIds', JSON.stringify(folio_ids))
                form.append('AGENT_UPLOAD', flashs.users.USERS_ID)
                const res = await fetchApi(`/uploadEDMRS/folio/getPvAgentUpload`, {
                    method: "POST",
                    body: form
                })
                setPvs(res.result)

            } catch (error) {
                console.log(error)
            } finally {
                setLoadingPvs(false)
            }
        })()
    }, []))

    const [loading, setLoading] = useState(true)
    const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
    const [pvPhoto, setPvPhoto] = useState(null)
    const navigation = useNavigation()
    const agentsModalRef = useRef()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [galexyIndex, setGalexyIndex] = useState(null)


    const [data, handleChange] = useForm({
        agent: null,
        pv: null
    })
    const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
        agent: {
            required: true
        },
        pv: {
            required: true
        }
    })

    const openAgentModalize = () => {
        agentsModalRef.current?.open()
    }

    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const res = await fetchApi(`/uploadEDMRS/folio/check/${flashs.flash.ID_FLASH}`)
                setCheck(res.result[0].folios)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))

    return (
        <>

            {(galexyIndex != null && pvs && pvs) &&
                <ImageView
                    images={[{ uri: pvs?.PV_PATH }, flashs.folios[0].PV_PATH ? { uri: flashs.folios[0].PV_PATH } : undefined]}
                    imageIndex={galexyIndex}
                    visible={(galexyIndex != null) ? true : false}
                    onRequestClose={() => setGalexyIndex(null)}
                    swipeToCloseEnabled
                    keyExtractor={(_, index) => index.toString()}
                />
            }
            {isSubmitting && <Loading />}
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.title}>{flashs ? flashs.flash.NOM_FLASH : null}</Text>
                </View>
                {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating size={'large'} color={'#777'} />
                </View> : <ScrollView style={styles.inputs}>
                    {/* <View style={styles.flash}>
                                                  <MaterialCommunityIcons name="usb-flash-drive-outline" size={24} color="black" />
                                                  <Text style={styles.flashName}>{ flashDetail.NOM_FLASH }</Text>
                                        </View> */}
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize} >
                            <View style={{ width: '100%' }}>
                                <View style={styles.labelContainer}>
                                    <View style={styles.icon}>
                                        <Feather name="user" size={20} color="#777" />
                                    </View>
                                    <Text style={styles.selectLabel}>
                                        Agent uploadEDMRS
                                    </Text>
                                </View>

                                <Text style={styles.selectedValue}>
                                    {flashs.users.NOM} {flashs.users.PRENOM}
                                </Text>
                                {flashs ?
                                    <>
                                        <TouchableOpacity onPress={() => {
                                            setGalexyIndex(0)
                                        }}>
                                            <Image source={{ uri: pvs.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(pvs.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                    </>

                                    : null}

                            </View>
                        </TouchableOpacity>
                        <View style={styles.selectContainer1}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={styles.selectedValue}>
                                    {flashs.folios.length} dossier{flashs.folios.length > 1 && 's'}
                                </Text>
                                <Text style={styles.selectedValue}>
                                    {flashs.folios.length} upload{flashs.folios.length > 1 && 's'}
                                </Text>
                            </View>
                            <View style={styles.folioList}>
                                {flashs?.folios.map((folio, index) => {
                                    return (
                                        <View key={index}>
                                            {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                            </View> :
                                                <View style={{ marginTop: 10, borderRadius: 80, }} key={index}>
                                                    <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple("#c4c4c4", false)}
                                                        onPress={() => handleFolioPress(folio)}>
                                                        <View style={[styles.folio]}>
                                                            <View style={styles.folioLeftSide}>
                                                                <View style={styles.folioLeft}>
                                                                    <View style={styles.folioImageContainer}>
                                                                        <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                    </View>
                                                                    <View style={styles.folioDesc}>
                                                                        <Text style={styles.folioName}>{folio?.NUMERO_FOLIO}</Text>
                                                                        <View style={styles.cardNature}>
                                                                            <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                            <Text style={styles.folioSubname}>Nature:{folio?.natures?.DESCRIPTION}</Text>
                                                                            <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableNativeFeedback>
                                                </View>
                                            }
                                        </View>
                                    )
                                })}

                            </View>
                        </View>

                        <TouchableOpacity style={styles.selectContainer} disabled>
                            <View style={{ width: '100%' }}>

                                {flashs ? <>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                        <Text style={styles.addImageLabel}>
                                            Photo du procès verbal retour
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        setGalexyIndex(1)
                                    }}>
                                        <Image source={{ uri: flashs?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                    </TouchableOpacity>
                                    {flashs.PV_PATH ? <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(flashs.date).format("DD/MM/YYYY [à] HH:mm")}</Text> : null}
                                </> : null}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>}

            </View>

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
        backgroundColor: '#fff',
        padding: 10
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
        marginLeft: 10,
        flex: 1
    },
    cardNature: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1

    },
    folioLeft: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    folioImage: {
        width: '60%',
        height: '60%'
    },

    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
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
        justifyContent: 'space-between'
    },
    selectContainer1: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ddd",
        marginVertical: 10,
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
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemImage: {
        width: '60%',
        height: '60%',
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
})