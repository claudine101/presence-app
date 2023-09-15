import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Alert, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../styles/COLORS';
import { Modalize } from 'react-native-modalize';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { useDispatch, useSelector } from "react-redux";
import { folioDetailsCartSelector } from "../../store/selectors/folioDetailsCartSelector";
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

export default function AddSupervisurPreparationFolioScreen() {
        const navigation = useNavigation()
        const dispatch = useDispatch()
        const folioDetails = useSelector(folioDetailsCartSelector)
        const [loadingInformation, setLoadingInformation] = useState(false)
        const [informations, setInformations] = useState(null);
        const [loading, setLoading] = useState(false)
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
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
                isValid = volume != null && supPreparations != null && multiFolios.length > 0 && document != null ? true : false
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
                                if (volume.volume) {
                                        setFoliosLoading(true)
                                        if (volume?.mailleNoTraite) {
                                                const rep = await fetchApi(`/preparation/folio/nonTraite/${volume?.mailleNoTraite.ID_MAILLE}`)
                                                setAllFolios(rep.result)
                                        }
                                        else {
                                                const rep = await fetchApi(`/preparation/folio/${volume.volume.ID_VOLUME}`)
                                                setAllFolios(rep.result)
                                        }

                                }
                        }
                        catch (error) {
                                console.log(error)
                        } finally {
                                setFoliosLoading(false)
                        }
                })()
        }, [])
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
                return (
                        <>
                                {foliosLoading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des dossiers gggs</Text>
                                                </View>
                                                {
                                                        allFolios.length == 0 ?
                                                                <Text style={styles.modalTitle}>Aucun dossier trouvé</Text>
                                                                :
                                                                allFolios.map((fol, index) => {
                                                                        return (
                                                                                <ScrollView key={index}>
                                                                                        <TouchableNativeFeedback onPress={() => setSelectedFolio(fol)}>
                                                                                                <View style={styles.modalItem} >
                                                                                                        <View style={styles.modalImageContainer}>
                                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                                        </View>
                                                                                                        <View style={styles.mard}>
                                                                                                                <View >
                                                                                                                        <Text style={styles.folioName}>{fol.NUMERO_FOLIO}</Text>
                                                                                                                </View>
                                                                                                                <View style={styles.natureCard}>
                                                                                                                        <Text style={styles.folioSubname}>Folio:{fol.FOLIO}</Text>
                                                                                                                        <Text style={styles.folioSubname}>Nature:{fol.natures.DESCRIPTION}</Text>
                                                                                                                        {isSelected(fol.ID_FOLIO) ? <Fontisto name="checkbox-active" size={21} color={COLORS.primary} /> :
                                                                                                                                <Fontisto name="checkbox-passive" size={21} color={COLORS.primary} />}
                                                                                                                </View>
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
                const [loadingSuper, allSuperviseur] = useFetch('/preparation/batiment/superviseurPreparation')
                return (
                        <>
                                {loadingSuper ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des agents superviseur</Text>
                                                </View>
                                                {allSuperviseur.result.map((prep, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedSupPreparation(prep)}>
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
                                                                                                {supPreparations?.USERS_ID == prep.USERS_ID ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
        const submitDataPreparation = async () => {
                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('folio', JSON.stringify(multiFolios))
                        form.append('AGENT_SUPERVISEUR', supPreparations.USERS_ID)
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
                        if (volume?.mailleNoTraite) {

                                form.append('ID_MAILLE_NO_TRAITE', volume?.mailleNoTraite.ID_MAILLE)
                                const vol = await fetchApi(`/preparation/folio/renommerSuperviseurPreparation`, {
                                        method: "PUT",
                                        body: form
                                })
                        }
                        else {
                                const vol = await fetchApi(`/preparation/folio/nommerSuperviseurPreparation`, {
                                        method: "PUT",
                                        body: form
                                })
                        }
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
                                                <Text style={styles.title} numberOfLines={2}>Affecter un agent superviseur</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        <View>
                                                <TouchableOpacity style={styles.selectContainer}>
                                                        <View style={styles.labelContainer}>
                                                                <View style={styles.icon}>
                                                                        <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                                </View>
                                                                <Text style={styles.selectLabel}>
                                                                        Volume
                                                                </Text>
                                                        </View>
                                                        <Text style={styles.selectedValue}>
                                                                {volume ? `${volume.volume.NUMERO_VOLUME}` : 'Aucun'}
                                                        </Text>
                                                </TouchableOpacity>
                                                {volume ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Malle
                                                                </Text>
                                                                <View>

                                                                        {volume.volume.maille ? <Text style={styles.selectedValue}>
                                                                                {volume.volume.maille ? `${volume.volume.maille?.NUMERO_MAILLE}` : 'N/B'}
                                                                        </Text> : <Text style={styles.selectedValue}>
                                                                                {volume?.mailleNoTraite ? `${volume?.mailleNoTraite?.NUMERO_MAILLE}` : 'N/B'}
                                                                        </Text>}
                                                                </View>
                                                        </View>
                                                </View> : null}

                                                <TouchableOpacity style={styles.selectContainer} onPress={openSupPreparationModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Agent superviseur
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {supPreparations ? `${supPreparations.NOM}` + ` ${supPreparations.PRENOM}` : ' Séléctionner un agent superviseur'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.selectContainer} onPress={openMultiSelectModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Nombre des dossiers
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {multiFolios.length > 0 ? ` ${multiFolios.length} ` + `séléctionné` + `${multiFolios.length > 1 ? "s" : ''}` : 'Sélectionner les dossiers'}

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
                                        onPress={submitDataPreparation}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                                <Modalize ref={preparationModalizeRef}  >
                                        <SupervisionPreparationList />
                                </Modalize>
                                <Modalize ref={volumeModalizeRef}  >
                                        <VolumeAgentSuperviseurList />
                                </Modalize>
                                <Modalize ref={multSelectModalizeRef}  >
                                        <MultiFolioSelctList />
                                </Modalize>
                        </View>
                </>
        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff'
        },
        butConfirmer: {
                borderRadius: 8,
                paddingVertical: 14,
                backgroundColor: COLORS.primary,
                marginHorizontal: 5,
                marginVertical: 10
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
                marginHorizontal: 10
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
                marginHorizontal: 10
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
                resizeMode: "cover"
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
        natureCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex:1
        },
        mard: {
                flexDirection: "column",
                flex:1
                // justifyContent: "space-between",
        },
})