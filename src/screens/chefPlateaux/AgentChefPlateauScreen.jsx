import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useDispatch, useSelector } from "react-redux";
import { folioDetailsCartSelector } from "../../store/selectors/folioDetailsCartSelector";
import { addFolioDetailAction, removeFolioDetailAction } from "../../store/actions/folioDetailsCartActions";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import fetchApi from "../../helpers/fetchApi";
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

/**
 * Le screen pour aider le superviseur de la phase preparation
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AgentChefPlateauScreen() {
        const navigation = useNavigation()
        const dispatch = useDispatch()
        const folioDetails = useSelector(folioDetailsCartSelector)
        const [loadingInformation, setLoadingInformation] = useState(false)
        const [informations, setInformations] = useState(null);
        const [loading, setLoading] = useState(false)
        const [document, setDocument] = useState(null)

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
                isValid = volumes != null && supPreparations != null && multiFolios.length > 0 && document != null ? true : false
                return isValid 
        }

        // Volume select
        const volumeModalizeRef = useRef(null);
        const [volumes, setVolumes] = useState(null);
        const openVolumeModalize = () => {
                volumeModalizeRef.current?.open();
        };
        const setSelectedVolume = (vol) => {
                volumeModalizeRef.current?.close();
                setVolumes(vol)
        }

        // Agent superviseur preparation select
        const preparationModalizeRef = useRef(null);
        const [supPreparations, setSupPreparations] = useState(null);
        const openSupPreparationModalize = () => {
                preparationModalizeRef.current?.open();
        };
        const setSelectedSupPreparation = (prep) => {
                preparationModalizeRef.current?.close();
                setSupPreparations(prep)
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

        //Composent pour afficher le modal de volume 
        const VolumeAgentSuperviseurList = () => {
                const [loadingVolume, volumesAll] = useFetch('/volume/dossiers/myVolume')
                return (
                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Les volumes</Text>
                                                </View>
                                                {volumesAll.result.map((vol, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedVolume(vol)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{vol.NUMERO_VOLUME}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{vol.CODE_VOLUME}</Text>
                                                                                                </View>
                                                                                                {volumes?.ID_VOLUME == vol.ID_VOLUME ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color="black" />}
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
                const [allFolios, setAllFolios] = useState([]);
                const [foliosLoading, setFoliosLoading] = useState(false);

                const isSelected = id_folio => multiFolios.find(u => u.ID_FOLIO == id_folio) ? true : false
                const setSelectedFolio = (fol) => {
                        if (isSelected(fol.ID_FOLIO)) {
                                const newfolio = multiFolios.filter(u => u.ID_FOLIO != fol.ID_FOLIO)
                                setMultiFolios(newfolio)
                        } else {
                                setMultiFolios(u => [...u, fol])
                        }

                }

                //fonction pour recuperer le folio par rapport de volume
                useEffect(() => {
                        (async () => {
                                try {

                                        if (volumes) {
                                                setFoliosLoading(true)
                                                const rep = await fetchApi(`/folio/dossiers/allFolio/${volumes.ID_VOLUME}`)
                                                setAllFolios(rep.result)
                                        }
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setFoliosLoading(false)
                                }
                        })()
                }, [volumes])
                return (
                        <>
                                {foliosLoading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des folios</Text>
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
                                                                                                        <Text style={styles.itemTitle}>{fol.NUMERO_FOLIO}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{fol.CODE_FOLIO}</Text>
                                                                                                </View>
                                                                                                {isSelected(fol.ID_FOLIO) ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color="black" />}
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

        //Composent pour afficher le modal des agents superviseur phase preparation
        const SupervisionPreparationList = () => {
                // <AntDesign name="addusergroup" size={24} color="black" />
                const [loadingSuper, allSuperviseur] = useFetch('/folio/dossiers/agentSuperviseurPreparation')
                return (
                        <>
                                {loadingSuper ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Les volumes</Text>
                                                </View>
                                                {allSuperviseur.result.map((prep, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedSupPreparation(prep)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="addusergroup" size={24} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{prep.NOM} {prep.PRENOM}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{prep.EMAIL}</Text>
                                                                                                </View>
                                                                                                {supPreparations?.ID_USER_AILE == prep.ID_USER_AILE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color="black" />}
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

         //Fonction pour le prendre l'image avec l'appareil photos
         const onTakePicha = async () => {
                try {
                        const permission = await ImagePicker.requestCameraPermissionsAsync()
                        if (!permission.granted) return false
                        const image = await ImagePicker.launchCameraAsync()
                        if (!image.didCancel) {
                                setDocument(image)
                                // const photo = image.assets[0]
                                // const photoId = Date.now()
                                // const manipResult = await manipulateAsync(
                                //         photo.uri,
                                //         [
                                //                 { resize: { width: 500 } }
                                //         ],
                                //         { compress: 0.7, format: SaveFormat.JPEG }
                                // );
                                // setLogoImage(manipResult)
                        }
                }
                catch (error) {
                        console.log(error)
                }
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

        const submitDataPreparation = async () => {
                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('folio', JSON.stringify(multiFolios))
                        form.append('AGENT_SUPERVISEUR', supPreparations.ID_USER_AILE)
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
                        // if (data.document) {
                        //         let localUri = data.document.uri;
                        //         let filename = localUri.split('/').pop();
                        //         form.append("PV", {
                        //                 uri: data.document.uri, name: filename, type: data.document.mimeType
                        //         })
                        // }
                        
                        const volume = await fetchApi(`/folio/dossiers/superviser`, {
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

        //Fonction pour appeller les autres information en passant l'id de volume selectionner
        useEffect(() => {
                (async () => {
                        try {

                                if (volumes) {
                                        setLoadingInformation(true)
                                        const aie = await fetchApi(`/volume/dossiers/batimentAile/${volumes.ID_VOLUME}`)
                                        setInformations(aie.result)
                                }
                        }
                        catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingInformation(false)
                        }
                })()
        }, [volumes])

        return (
                <>
                        {loading && <Loading/>}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <Text style={styles.titlePrincipal}>Nommer une agent superviseur</Text>
                                </View>
                                <ScrollView>
                                        <View>
                                                <TouchableOpacity style={styles.selectContainer} onPress={openVolumeModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Volume
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {volumes ? `${volumes.NUMERO_VOLUME}` : 'Aucun'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Malle
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {informations ? `${informations?.NUMERO_MAILLE}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Dossier
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {informations ? `${informations?.NOMBRE_DOSSIER}` : 'N/B'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                <TouchableOpacity style={styles.selectContainer} onPress={openSupPreparationModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Selectioner un agent superviseur phase preparation
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {supPreparations ? `${supPreparations.NOM}` + `${supPreparations.PRENOM}` : 'Aucun'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.selectContainer} onPress={openMultiSelectModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Selectioner les folios
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {multiFolios.length > 0 ? multiFolios.length : 'Aucun'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                {/* <View>
                                                        <TouchableOpacity style={[styles.selectContainer, hasError("document") && { borderColor: "red" }]}
                                                                onPress={selectdocument}
                                                        >
                                                                <View>
                                                                        <Text style={[styles.selectLabel, hasError("document") && { color: 'red' }]}>
                                                                                Importer le proces verbal
                                                                        </Text>
                                                                        {data.document ? <View>
                                                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                        {data.document.name}
                                                                                </Text>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                        <Text>{data.document.name.split('.')[1].toUpperCase()} - </Text>
                                                                                        <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                                {((data.document.size / 1000) / 1000).toFixed(2)} M
                                                                                        </Text>
                                                                                </View>
                                                                        </View> : null}
                                                                </View>
                                                        </TouchableOpacity>
                                                </View> */}
                                                <TouchableOpacity onPress={onTakePicha}>
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
                                        </View>
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitDataPreparation}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                                <Portal>
                                        <Modalize ref={preparationModalizeRef}  >
                                                <SupervisionPreparationList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={volumeModalizeRef}  >
                                                <VolumeAgentSuperviseurList />
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
                marginHorizontal: 10,
                marginTop: -20
        },
        cardHeader: {
                flexDirection: 'row',
                marginTop: StatusBar.currentHeight,
                alignContent: "center",
                alignItems: "center",
                marginBottom: 15
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
        selectContainer: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#777",
                marginVertical: 10
        },
        selectedValue: {
                color: '#777'
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
        label: {
                fontSize: 16,
                fontWeight: 'bold'
        },
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: "#18678E",
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        buttonPlus: {
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
        },
        buttonTextPlus: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 25
        },
        headerRead: {
                borderRadius: 8,
                backgroundColor: "#ddd",
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 5,
                paddingHorizontal: 30
        },
        cardFolder: {
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: '#FFF',
                maxHeight: 50,
                borderRadius: 20,
                padding: 3,
                paddingVertical: 2,
                elevation: 10,
                shadowColor: '#c4c4c4',
        },
        cardDescription: {
                marginLeft: 10,
                width: 30,
                height: 30,
                borderRadius: 30,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "#ddd"
        },
        reomoveBtn: {
                width: 30,
                height: 30,
                backgroundColor: '#F1F1F1',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center'
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
        butConfirmer: {
                // marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                // paddingHorizontal: 10,
                backgroundColor: "#18678E",
                marginHorizontal: 50,
                marginVertical: 15
        },
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#000",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5
        },
        addImageLabel: {
                marginLeft: 5,
                opacity: 0.8
        },

})