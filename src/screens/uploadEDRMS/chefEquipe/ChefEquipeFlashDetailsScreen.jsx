import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableNativeFeedbackBase, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { AntDesign, Ionicons, MaterialCommunityIcons, Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { Modalize } from "react-native-modalize";
import useFetch from "../../../hooks/useFetch";
import PROFILS from "../../../constants/PROFILS";
import Loading from "../../../components/app/Loading";
import ImageView from "react-native-image-viewing";
import moment from "moment";
import Folio from "../../../components/folio/Folio";

export default function ChefEquipeFlashDetailsScreen() {
    const route = useRoute()
    const { flashs } = route.params
    const [check, setCheck] = useState(null)


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
    const handleAgentPress = agent => {
        agentsModalRef.current?.close()
        handleChange('agent', agent)
    }


    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const res = await fetchApi(`/uploadEDMRS/folio/check/${flashs[0].flashs.ID_FLASH}`)
                setCheck(res.result[0].folios)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))

    /**
     * Permet de traiter le retour entre le sup aile indexation et le chef d'equipe
     * @author darcydev <darcy@mediabox.bi>
     * @date 04/08/2023
     * @returns 
     */
    const handleSubmitRetour = async () => {
        try {
            if (!isRetourValid()) return false

            setIsSubmitting(true)
            const form = new FormData()
            form.append("ID_FLASH", flashs[0].flashs.ID_FLASH )
            form.append("AGENT_UPLOAD",flashs[0].users.USERS_ID)
            if (data.pv) {
                const photo = data.pv
                let localUri = photo.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append(`pv`, {
                    uri: localUri, name: filename, type
                })
            }
            const res = await fetchApi(`/uploadEDMRS/folio/retour`, {
                method: 'POST',
                body: form
            })
            ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
            navigation.goBack()
        } catch (error) {
            console.log(error)
            ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
        } finally {
            setIsSubmitting(false)
        }
    }

    const isRetourValid = () => {
        return data.pv && !isCompressingPhoto
    }

    const onTakePhoto = async () => {
        setIsCompressingPhoto(true)
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (!permission.granted) return false
        const image = await ImagePicker.launchCameraAsync()
        if (image.canceled) {
            return setIsCompressingPhoto(false)
        }
        const photo = image.assets[0]
        setPvPhoto(photo)
        const manipResult = await manipulateAsync(
            photo.uri,
            [
                { resize: { width: 500 } }
            ],
            { compress: 0.7, format: SaveFormat.JPEG }
        );
        setIsCompressingPhoto(false)
        handleChange('pv', manipResult)
    }
    return (
        <>
            {(galexyIndex != null && supAile?.result && supAile?.result) &&
                <ImageView
                    images={[{ uri: flashs[0].folios[0].PV_PATH }, flashs[0].folios[0].PV_PATH ? flashs[0].folios[0].PV_PATH : undefined]}
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
                    <Text style={styles.title}>{flashs ? flashs[0].flashs.NOM_FLASH : null}</Text>
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
                                    {flashs[0].users.NOM} {flashs[0].users.PRENOM}
                                </Text>
                                {flashs ?
                                    <>
                                        <TouchableOpacity onPress={() => {
                                            setGalexyIndex(0)
                                        }}>
                                            <Image source={{ uri: flashs[0].folios[0].PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(flashs[0].folios[0].DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                    </>
                                    : null}
                            </View>
                        </TouchableOpacity>
                        { check?.length>0? <TouchableOpacity onPress={onTakePhoto}>
                            <View style={[styles.addImageItem]}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="file-signature" size={20} color="#777" />
                                        <Text style={styles.addImageLabel}>
                                            Photo du procès verbal
                                        </Text>
                                    </View>
                                    {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                </View>
                                {pvPhoto && <Image source={{ uri: pvPhoto.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                            </View>
                        </TouchableOpacity>:null}
                    </View>
                </ScrollView>}
                { check?.length>0?
                 <View style={styles.actions}>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.actionBtn, { opacity: !isRetourValid() ? 0.5 : 1 }]} disabled={!isRetourValid()} onPress={handleSubmitRetour}>
                            <Text style={styles.actionText}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>
                </View> :null}
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
        justifyContent: 'space-between'
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