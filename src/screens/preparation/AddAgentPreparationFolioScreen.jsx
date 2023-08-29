import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image, Alert } from "react-native";
import { Ionicons, AntDesign, Fontisto, FontAwesome5,MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { useDispatch, useSelector } from "react-redux";
import fetchApi from "../../helpers/fetchApi";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

/**
 * Le screen pour nomme agent superviseur la phase de preparation
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AddAgentPreparationFolioScreen() {
        const navigation = useNavigation()
        const dispatch = useDispatch()
        const [countFolio, setCountFolio] = useState('')
        const [loading, setLoading] = useState(false)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [document, setDocument] = useState(null)
        const route = useRoute()
        const { volume } = route.params
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
                isValid = agentPreparation != null && document != null && multiFolios.length > 0 ? true : false
                return isValid && isValidate()
        }

        // Agent preparation select
        const preparationModalizeRef = useRef(null);
        const [agentPreparation, setAgentPreparation] = useState(null);
        const openPreparationModalize = () => {
                preparationModalizeRef.current?.open();
        };
        const setSelectedPreparartion = (prep) => {
                preparationModalizeRef.current?.close();
                setAgentPreparation(prep)
        }

        // Modal folio multi select
        const multSelectModalizeRef = useRef(null);
        const [multiFolios, setMultiFolios] = useState([]);
        const openMultiSelectModalize = () => {
                multSelectModalizeRef.current?.open();
        };
        const submitConfimer = () => {
                multSelectModalizeRef.current?.close();
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

        //Composent pour afficher le modal les agents de preparation
        const PreparationList = () => {
                const [loadingAgentPrepa, allAgentsPreparation] = useFetch('/preparation/batiment/agentPreparation')
                return (
                        <>
                                {loadingAgentPrepa ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Les agents de preparations</Text>
                                                </View>
                                                {allAgentsPreparation.result.map((prep, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedPreparartion(prep)}>
                                                                                <View style={styles.modalItem} >
                                                                                <View style={styles.imageContainer}>
                                                                                                {prep.PHOTO_USER ? <Image source={{ uri: prep.PHOTO_USER }} style={styles.image} /> :
                                                                                                        <Image source={require('../../../assets/images/user.png')} style={styles.image} />}
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{prep.NOM} {prep.PRENOM}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{prep.EMAIL}</Text>
                                                                                                </View>
                                                                                                {agentPreparation?.USERS_ID == prep.USERS_ID ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} />:
                                                                                               <MaterialIcons name="radio-button-unchecked" size={24} color={COLORS.primary} />}
                                                                                        </View>
                                                                                </View>
                                                                        </TouchableNativeFeedback>
                                                                </ScrollView>
                                                        )
                                                })}
                                        </View>
                                }
                        </>
                )
        }

        //Composent pour afficher le modal de multi select des folio
        const MultiFolioSelctList = () => {
        const [allFolios, setAllFolios] = useState(volume.folios)
                const isSelected = id_folio => multiFolios.find(u =>u.folio.ID_FOLIO == id_folio) ? true : false
                const setSelectedFolio = (fol) => {
                        if (isSelected(fol.folio.ID_FOLIO)) {
                                const newfolio = multiFolios.filter(u => u.folio.ID_FOLIO != fol.folio.ID_FOLIO)
                                setMultiFolios(newfolio)
                        } else {
                                setMultiFolios(u => [...u, fol])
                        }
                }
                return (
                        <>
                                {
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des dossiers</Text>
                                                </View>
                                                {allFolios.map((fol, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedFolio(fol)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{fol.folio.NUMERO_FOLIO}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{fol.folio.CODE_FOLIO}</Text>
                                                                                                </View>
                                                                                                {isSelected(fol.folio.ID_FOLIO) ? <Fontisto name="checkbox-active" size={21} color={COLORS.primary} /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color={COLORS.primary} />}
                                                                                        </View>
                                                                                </View>
                                                                        </TouchableNativeFeedback>
                                                                </ScrollView>
                                                        )
                                                })}
                                        </View>
                                }
                                <TouchableWithoutFeedback
                                        onPress={submitConfimer}
                                >
                                        <View style={styles.butConfirmer}>
                                                <Text style={styles.buttonText}>Confirmer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </>
                )
        }

        const submitData = async () => {
                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('folio', JSON.stringify(multiFolios))
                        form.append('AGENT_PREPARATION', agentPreparation.USERS_ID)
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
                        const volume = await fetchApi(`/preparation/folio/nommerAgentPreparation`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.goBack()
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoading(false)
                }
        }

        //Fonction pour recuperer le volume avec le count de folio existants
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                const response = await fetchApi('/folio/dossiers/nbreFolio')
                                setCountFolio(response.result)

                        } catch (error) {
                                console.log(error)
                        }
                })()
        }, []))


        return (
                <>
                        {loading && <Loading />}
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
                                                <Text style={styles.title} numberOfLines={2}>Affecter un agent de préparation</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        <View>
                                                <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Volume
                                                                </Text>
                                                                <View>
                                                                        {volume ? <Text style={styles.selectedValue}>
                                                                                {volume.volume.NUMERO_VOLUME}
                                                                        </Text> :
                                                                                <Text style={styles.selectedValue}>
                                                                                        aucun
                                                                                </Text>}
                                                                </View>
                                                        </View>
                                                </View>
                                                <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Nombres de dossiers
                                                                </Text>
                                                                <View>
                                                                        {volume ? <Text style={styles.selectedValue}>
                                                                                {volume.folios.length}
                                                                        </Text> :
                                                                                <Text style={styles.selectedValue}>
                                                                                        aucun
                                                                                </Text>}
                                                                </View>
                                                        </View>
                                                </View>
                                                <TouchableOpacity style={styles.selectContainer} onPress={openPreparationModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                     Agent de preparation
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {agentPreparation ? `${agentPreparation.NOM}` + `  ${agentPreparation.PRENOM}` : 'Sélectionner un agent de preparation'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.selectContainer} onPress={openMultiSelectModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                       Dossier
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                        {multiFolios.length > 0 ? ` ${multiFolios.length} `+ `séléctionné`+`${multiFolios.length>1 ?"s" : ''}` :'Selectionner les dossiers'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
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
                                        </View>
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                                <Portal>
                                        <Modalize ref={preparationModalizeRef}  >
                                                <PreparationList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={multSelectModalizeRef}  >
                                                <MultiFolioSelctList />
                                        </Modalize>
                                </Portal>
                        </View>
                </>
        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff'
        },
        cardHeader: {
                flexDirection: 'row',
                marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15
        },
        backBtn: {
                backgroundColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: 50,
        },
        titlePrincipal: {
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: 10,
                color: COLORS.primary
        },
        selectContainer: {
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#ddd",
                marginVertical: 10,
                marginHorizontal: 10

        },
        selectedValue: {
                color: '#777',
                marginLeft: 5
        },
        modalHeader: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 5
        },
        modalItem: {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F1F1'
        },
        butConfirmer: {
                borderRadius: 8,
                paddingVertical: 14,
                backgroundColor: COLORS.primary,
                marginHorizontal: 5,
                 marginVertical: 10
        },
        modalImageContainer: {
                width: 40,
                height: 40,
                backgroundColor: '#F1F1F1',
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
        },
        itemTitle: {
                marginLeft: 10
        },
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary,
                marginHorizontal:10
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        itemTitleDesc: {
                color: "#777",
                marginLeft: 10,
                fontSize: 11
        },
        modalItemCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
        },
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#ddd",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5,
                marginHorizontal:10
            },
        addImageLabel: {
                marginLeft: 5,
                opacity: 0.8
        },
        imageContainer: {
                width: 40,
                height: 40,
                backgroundColor: COLORS.handleColor,
                borderRadius: 10,
                padding: 5
        },
        image: {
                width: "100%",
                height: "100%",
                borderRadius: 10,
                resizeMode: "center"
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
                fontSize: 16,
                fontWeight: 'bold',
                color: '#777',
                // color: COLORS.primary
        },
        cardTitle: {
                maxWidth: "85%"
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
        },
})