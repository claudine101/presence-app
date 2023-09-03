import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import fetchApi from "../../../helpers/fetchApi";
import moment from 'moment'
import { Ionicons, AntDesign, Fontisto, FontAwesome5 } from '@expo/vector-icons';
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as DocumentPicker from 'expo-document-picker';
import Loading from "../../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import IDS_ETAPES_FOLIO from "../../../constants/ETAPES_FOLIO";


/**
 * Retour d'un chef plateau  
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 03/8/2023
 * @returns 
 */

export default function AgentSupAileDetailScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { volume, users } = route.params
    console.log(volume)
    // const [, setAllDetails] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [document, setDocument] = useState(null)
    const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)

    const [data, handleChange, setValue] = useForm({
        // document: null,
    })

    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        // document: {
        //         required: true
        // },
    }, {
        // document: {
        //         required: 'ce champ est obligatoire',
        // },
    })
    const isValidAdd = () => {
        var isValid = false
        isValid = document != null ? true : false
        return isValid
    }

    //Fonction pour upload un documents 
    const selectdocument = async () => {
        setError("document", "")
        handleChange("document", null)
        const document = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (document.type == 'cancel') {
            return false
        }
        var sizeDocument = ((document.size / 1000) / 1000).toFixed(2)
        if (sizeDocument <= 2) {
            handleChange("document", document)
        }
        else {
            setError("document", ["Document trop volumineux(max:2M)"])
        }

    }

    //Fonction pour le prendre l'image avec l'appareil photos
    const onTakePicha = async () => {
        setIsCompressingPhoto(true)
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (!permission.granted) return false
        const image = await ImagePicker.launchCameraAsync()
        if (image.canceled) {
            return setIsCompressingPhoto(false)
        }
        const photo = image.assets[0]
        setDocument(photo)
        const manipResult = await manipulateAsync(
            photo.uri,
            [
                { resize: { width: 500 } }
            ],
            { compress: 0.7, format: SaveFormat.JPEG }
        );
        setIsCompressingPhoto(false)
        //     handleChange('pv', manipResult)
    }

    const submitData = async () => {
        try {
            setLoadingSubmit(true)
            const form = new FormData()
            form.append('volume', JSON.stringify(volume.volumes))
            form.append('AGENT_SUPERVISEUR_AILE', volume.users.USERS_ID)
            if (document) {
                const manipResult = await manipulateAsync(
                    document.uri,
                    [
                        { resize: { width: 500 } }
                    ],
                    { compress: 0.8, format: SaveFormat.JPEG }
                );
                let localUri = manipResult.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append('PV', {
                    uri: localUri, name: filename, type
                })
            }
            const res = await fetchApi(`/preparation/volume/retourAgentSuperviseurAile`, {
                method: "PUT",
                body: form
            })
            navigation.goBack()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoadingSubmit(false)
        }
    }
    return (
        <>
            {loadingSubmit && <Loading />}
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.cardTitle}>
                        <Text style={styles.title} numberOfLines={2}>{users.NOM} {users.PRENOM}</Text>
                    </View>
                </View>
                {volume ? <View style={styles.selectContainer}>
                    <View>
                        <Text style={styles.selectLabel}>
                            volume
                        </Text>
                        <View>
                            <Text style={styles.selectedValue}>
                                {volume?.volume?.NUMERO_VOLUME ? `${volume?.volume?.NUMERO_VOLUME}` : 'N/B'}
                            </Text>
                        </View>
                    </View>
                </View> : null}
                {volume.maille ? <View style={styles.selectContainer}>
                    <View>
                        <Text style={styles.selectLabel}>
                            Malle
                        </Text>
                        <View>
                            <Text style={styles.selectedValue}>
                                {volume.maille ? `${volume.maille?.NUMERO_MAILLE}` : 'N/B'}
                            </Text>
                        </View>
                    </View>
                </View> : null}
                {volume ? <View style={styles.selectContainer}>
                    <View>
                        <Text style={styles.selectLabel}>
                            Dossier
                        </Text>
                        <View>
                            <Text style={styles.selectedValue}>
                                {volume?.folios?.length  ? `${volume?.folios?.length }` : 'N/B'}
                            </Text>
                        </View>
                    </View>
                </View> : null}
                
                <View style={[styles.addImageItem]}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome5 name="file-signature" size={20} color="#777" />
                            <Text style={styles.addImageLabel}>
                                Procès verbal
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity  >
                        <View style={{ width: '100%' }}>

                            {
                                volume ?
                                    <>
                                        <TouchableOpacity onPress={() => {
                                            setGalexyIndex(0)
                                        }}>
                                            <Image source={{ uri: volume?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                        </TouchableOpacity>
                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(volume?.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                    </> : null}



                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={onTakePicha}>
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
                        {document && <Image source={{ uri: document.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                    </View>
                </TouchableOpacity>
                <TouchableWithoutFeedback
                    disabled={!isValidAdd()}
                    onPress={submitData}
                >
                    <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                        <Text style={styles.buttonText}>Enregistrer</Text>
                    </View>
                </TouchableWithoutFeedback>

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
        // color: COLORS.primary
    },
    cardTitle: {
        maxWidth: "85%"
    },
    cardDetails: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#c4c4c4',
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 15,
        overflow: 'hidden',
        marginHorizontal: 10
    },
    carddetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImages: {
        backgroundColor: '#DCE4F7',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardDescription: {
        marginLeft: 10,
        flex: 1
    },
    itemVolume: {
        fontSize: 15,
        fontWeight: "bold",
    },

    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 10
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10,
        marginHorizontal: 10
    },
    selectedValue: {
        color: '#777'
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#000",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5,
        marginHorizontal: 10
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
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
        marginLeft: 10,
        flex: 1
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
    }
})