import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'
import { Ionicons, AntDesign, Fontisto, Feather } from '@expo/vector-icons';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import * as DocumentPicker from 'expo-document-picker';
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import IDS_ETAPES_FOLIO from "../../constants/ETAPES_FOLIO";


/**
 * Screen pour afficher le details de folio avec leur nature  
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 02/8/2023
 * @returns 
 */

export default function FolioRetourSuperviseurScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { folio } = route.params

        // const [, setAllDetails] = useState([])
        const [loading, setLoading] = useState(false)
        const [loadingSubmit, setLoadingSubmit] = useState(false)
        const [document, setDocument] = useState(null)
        const [check, setCheck] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)



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
                try {
                        const permission = await ImagePicker.requestCameraPermissionsAsync()
                        if (!permission.granted) return false
                        const image = await ImagePicker.launchCameraAsync()
                        if (!image.canceled) {
                                setDocument(image)
                        }
                }
                catch (error) {
                        console.log(error)
                }
        }

        const submitData = async () => {
                try {
                        setLoadingSubmit(true)
                        const form = new FormData()
                        form.append('folio', JSON.stringify(folio.folios))
                        form.append('AGENT_SUPERVISEUR', folio.users.USERS_ID)
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
                        console.log(form)
                        const res = await fetchApi(`/preparation/folio/retourAgentSuperviseur`, {
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
         //Fonction pour recuperer les details
         useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCheck(true)
                                const res = await fetchApi(`/preparation/folio/checkAgentsup/${folio.users.USERS_ID}`)
                                setCheck(res.result)
                               
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
                        }
                })()
        }, []))
        return (
                <>
                        {(loadingSubmit && loadingCheck)&& <Loading />}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <Text style={styles.titlePrincipal}>{folio.users.NOM} {folio.users.PRENOM}</Text>
                                </View>
                                <FlatList
                                        style={styles.contain}
                                        data={folio.folios}
                                        renderItem={({ item: folio, index }) => {
                                                return (
                                                        <>
                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                </View> :
                                                                        <View>
                                                                                <View style={styles.cardDetails}>
                                                                                        <View style={styles.carddetailItem}>
                                                                                                <View style={styles.cardImages}>
                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                </View>
                                                                                                <View style={styles.cardDescription}>
                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                <View style={styles.cardNames}>
                                                                                                                        <Text style={styles.itemVolume} numberOfLines={1}>{folio.folio.NUMERO_FOLIO}</Text>
                                                                                                                </View>
                                                                                                                <Text style={{ color: "#777" }}>{moment(folio.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        </View>
                                                                }
                                                        </>
                                                )
                                        }}
                                        keyExtractor={(folio, index) => index.toString()}
                                />
                                {
                                        // ID_ETAPE_FOLIO == 2 ?
                                        <>
                                                

                                               { check.length>0? <><TouchableOpacity onPress={onTakePicha}>
                                                        <View style={[styles.addImageItem]}>
                                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                        <Feather name="image" size={24} color="#777" />
                                                                        <Text style={styles.addImageLabel}>
                                                                                Photo du proces verbal
                                                                        </Text>
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
                                                </TouchableWithoutFeedback></>:null}
                                        </>
                                        // : null
                                }

                        </View>
                </>

        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
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
        cardHeader: {
                flexDirection: 'row',
                // marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15,
                marginHorizontal: 10,
                marginVertical: 10
        },
        backBtn: {
                backgroundColor: COLORS.ecommercePrimaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: 50,
        },
        titlePrincipal: {
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
                color: COLORS.primary
        },
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: "#18678E",
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
})