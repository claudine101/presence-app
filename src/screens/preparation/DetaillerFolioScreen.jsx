import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Alert, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, Fontisto, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from '../../styles/COLORS';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch, useSelector } from "react-redux";
import { folioNatureCartSelector } from "../../store/selectors/folioNatureCartSelector";
import { addFolioAction, removeFolioAction, resetCartAction } from "../../store/actions/folioNatureCartActions";
import { userSelector } from "../../store/selectors/userSelector";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/app/Loading";
import fetchApi from "../../helpers/fetchApi";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useEffect } from "react";
import ETAPES_VOLUME from "../../constants/ETAPES_VOLUME";

/**
 * Le screen pour details le volume, le dossier utilisable par un agent superviseur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */


export default function AddFolioScreen() {
        const route = useRoute()
        const { volume } = route.params

        const navigation = useNavigation()
        const dispatch = useDispatch()
        const folioNatures = useSelector(folioNatureCartSelector)
        const user = useSelector(userSelector)
        const [loading, setLoading] = useState(false)
        const [loadingCount, setLoadingCount] = useState(false)
        const [document, setDocument] = useState(null)
        const [documentDist, setDocumentDist] = useState(null)

        const [nbre, setNbre] = useState(null)

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCount(true)
                                const vol = await fetchApi(`/preparation/volume/count/${volume.volume.ID_VOLUME}`)
                                setNbre(vol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCount(false)
                        }
                })()
        }, [volume]))
        const [data, handleChange, setValue] = useForm({
                folio: '',
                // document: null
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {

                // document: {
                //         required: true
                // }
        }, {

                // document: {
                //         required: 'ce champ est obligatoire',
                // }
        })

        const isValidAdd = () => {
                var isValid = false
                isValid = data.folio > 0 ? true : false
                isValid = natures != null ? true : false
                return isValid
        }

        const isValidFin = () => {
                var isVal = false
                isVal = document != null ? true : false
                return isVal
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

        // Nature du dossier select
        const natureModalizeRef = useRef(null);
        const [natures, setNatures] = useState(null);

        const openNaturesModalize = () => {
                natureModalizeRef.current?.open();
        };
        const setSelectedNtures = (nat) => {
                natureModalizeRef.current?.close();
                setNatures(nat)
        }

        //Fonction pour ajouter le folio da le redux
        const onAddToCart = () => {
                dispatch(addFolioAction({ NUMERO_FOLIO: data.folio, ID_NATURE: natures.ID_NATURE_FOLIO, TOTAL: data.folio + natures.DESCRIPTION }))
                // handleChange("folio", data.nbre_volume - 1)
                handleChange("folio", "")
                setNatures(null)
        }

        //Fonction pour enlever le folio da le redux
        const onRemoveProduct = (index) => {
                Alert.alert("Enlever le folio", "Voulez-vous vraiment enlever ce folio dans les details ?",
                        [
                                {
                                        text: "Annuler",
                                        style: "cancel"
                                },
                                {
                                        text: "Oui", onPress: async () => {
                                                dispatch(removeFolioAction(index))
                                        }
                                }
                        ])
        }

        //Fonction pour le prendre l'image avec l'appareil photos
        const onTakePicha = async () => {
                try {
                        const permission = await ImagePicker.requestCameraPermissionsAsync()
                        if (!permission.granted) return false
                        const image = await ImagePicker.launchCameraAsync()
                        if (!image.canceled) {
                                setDocument(image.assets[0])
                        }
                }
                catch (error) {
                        console.log(error)
                }
        }
        //Fonction pour le prendre l'image avec l'appareil photos
        const onTakePichaDistributeur = async () => {
                try {
                        const permission = await ImagePicker.requestCameraPermissionsAsync()
                        if (!permission.granted) return false
                        const image = await ImagePicker.launchCameraAsync()
                        if (!image.canceled) {
                                setDocumentDist(image)
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

        //Composent pour afficher le modal de volume associer a un agent superviceur
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
                                                {volumesAll.result.length == 0 ? <View style={styles.modalHeader}><Text>Aucun volumes trouves</Text></View> : null}
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

        //Composent pour afficher le modal de nature de folio
        const NatureDossierList = () => {
                const [loadingNature, allNatures] = useFetch('/preparation/volume/nature')
                return (
                        <>
                                {loadingNature ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Nature du dossier</Text>
                                                </View>
                                                {allNatures.result.map((nat, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedNtures(nat)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{nat.DESCRIPTION}</Text>
                                                                                                        {/* <Text style={styles.itemTitleDesc}>{nat.CODE_VOLUME}</Text> */}
                                                                                                </View>
                                                                                                {natures?.ID_NATURE_FOLIO == nat.ID_NATURE_FOLIO ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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
        // Malle select
        const maleModalizeRef = useRef(null);
        const [malles, setMalles] = useState(null);
        const openMallesModalize = () => {
                maleModalizeRef.current?.open();
        };
        const setSelectedMalle = (mal) => {
                maleModalizeRef.current?.close();
                setMalles(mal)
        }

        // Batiment select
        const batimentModalizeRef = useRef(null);
        const [batiments, setBatiments] = useState(null);
        const openBatimentModalize = () => {
                batimentModalizeRef.current?.open();
        };
        const setSelectedBatiment = (bat) => {
                batimentModalizeRef.current?.close();
                setBatiments(bat)
        }

        // Ailles select
        const aillesModalizeRef = useRef(null);
        const [ailles, setAilles] = useState(null);
        const openAilleModalize = () => {
                aillesModalizeRef.current?.open();
        };
        const setSelectedAille = (ail) => {
                aillesModalizeRef.current?.close();
                setAilles(ail)
        }
        //Composent pour afficher le maille existant
        const MalleList = () => {
                const [loadingMalle, mallesAll] = useFetch('/preparation/batiment/mailles')
                return (
                        <>
                                {loadingMalle ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des malles</Text>
                                                </View>
                                                {mallesAll.result.map((mal, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedMalle(mal)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{mal.NUMERO_MAILLE}</Text>
                                                                                                        {/* <Text style={styles.itemTitleDesc}>{vol.CODE_VOLUME}</Text> */}
                                                                                                </View>
                                                                                                {malles?.ID_MAILLE == mal.ID_MAILLE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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



        //Composent pour afficher le modal des batiments 
        const BatimentList = () => {
                const [loadingBatiment, batimentsAll] = useFetch('/preparation/batiment')
                return (
                        <>
                                <>
                                        {loadingBatiment ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                <View style={styles.modalContainer}>
                                                        <View style={styles.modalHeader}>
                                                                <Text style={styles.modalTitle}>Listes des batiments</Text>
                                                        </View>
                                                        {batimentsAll.result.map((bat, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedBatiment(bat)}>
                                                                                        <View style={styles.modalItem} >
                                                                                                <View style={styles.modalImageContainer}>
                                                                                                        <FontAwesome5 name="house-damage" size={20} color="black" />
                                                                                                </View>
                                                                                                <View style={styles.modalItemCard}>
                                                                                                        <View>
                                                                                                                <Text style={styles.itemTitle}>{bat.NUMERO_BATIMENT}</Text>
                                                                                                        </View>
                                                                                                        {batiments?.ID_BATIMENT == bat.ID_BATIMENT ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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
                        </>
                )
        }

        //Composent pour afficher le modal de liste des ailles
        const AillesList = ({ batiments }) => {
                const [allailles, setAllailles] = useState([]);
                const [aillesLoading, setAillesLoading] = useState(false);
                useEffect(() => {
                        (async () => {
                                try {

                                        if (batiments) {
                                                setAillesLoading(true)
                                                const aie = await fetchApi(`/preparation/batiment/aile/${batiments.ID_BATIMENT}`)
                                                setAllailles(aie.result)
                                        }
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setAillesLoading(false)
                                }
                        })()
                }, [batiments])
                return (
                        <>
                                {aillesLoading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des ailles</Text>
                                                </View>
                                                {allailles.map((ail, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedAille(ail)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <FontAwesome5 name="house-damage" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{ail.NUMERO_AILE}</Text>
                                                                                                </View>
                                                                                                {ailles?.ID_AILE == ail.ID_AILE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

        //Composent pour afficher le modal de liste des distrubuteur 
        const DistributeurAgentList = ({ ailles }) => {
                const [allDistributeur, setAllDistributeur] = useState([]);
                const [distributeurLoading, setDistributeurLoading] = useState(false);

                useEffect(() => {
                        (async () => {
                                try {

                                        if (ailles) {
                                                setDistributeurLoading(true)
                                                const distr = await fetchApi(`/preparation/batiment/distributeur/${ailles.ID_AILE}`)
                                                setAllDistributeur(distr.result)
                                        }
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setDistributeurLoading(false)
                                }
                        })()
                }, [ailles])
                return (
                        <>
                                {distributeurLoading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des distributeurs</Text>
                                                </View>
                                                {allDistributeur.map((distr, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedDistibuteur(distr)}>
                                                                                <View style={styles.modalItem} >

                                                                                        <View style={styles.imageContainer}>
                                                                                                {distr.PHOTO_USER ? <Image source={{ uri: distr.PHOTO_USER }} style={styles.image} /> :
                                                                                                        <Image source={require('../../../assets/images/user.png')} style={styles.image} />}
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{distr.NOM} {distr.PRENOM} </Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{distr.EMAIL}</Text>
                                                                                                </View>
                                                                                                {distributeur?.USERS_ID == distr.USERS_ID ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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
        // Distributeur select
        const distributrutModalizeRef = useRef(null);
        const [distributeur, setDistributeur] = useState(null);
        const openDistributeurModalize = () => {
                distributrutModalizeRef.current?.open();
        };
        const setSelectedDistibuteur = (distr) => {
                distributrutModalizeRef.current?.close();
                setDistributeur(distr)
        }

        //fonction pour envoyer les donnees dans la base
        const submitFolio = async () => {

                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('ID_VOLUME', volume.volume.ID_VOLUME)
                        form.append('folio', JSON.stringify(folioNatures))
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
                        // if (data.document) {
                        //         let localUri = data.document.uri;
                        //         let filename = localUri.split('/').pop();
                        //         form.append("PV",({ uri: data.document.uri, name: filename, type: data.document.mimeType }))
                        // }

                        const folio = await fetchApi(`/preparation/folio`, {
                                method: "POST",
                                body: form
                        })
                        dispatch(resetCartAction())
                        navigation.goBack()
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoading(false)
                }
        }

        //fonction pour envoyer les donnees dans la base
        const submitInMalle = async () => {
                try {
                        setLoading(true)
                        const form = new FormData()
                        form.append('MAILLE', malles.ID_MAILLE)
                        form.append('AGENT_DISTRIBUTEUR', distributeur?.USERS_ID)
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
                        const vol = await fetchApi(`/preparation/volume/nommerDistributeur/${volume.volume.ID_VOLUME}`, {
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

        return (
                <>
                        {loading && <Loading />}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        {volume.volume.ID_ETAPE_VOLUME == ETAPES_VOLUME.DETAILLER_LES_FOLIO ?
                                                <Text style={styles.titlePrincipal2}>Ajouter le volume dans une malle</Text> :
                                                <Text style={styles.titlePrincipal}>Detailler le volume</Text>
                                        }
                                </View>
                                <ScrollView>
                                        <View>
                                                <View style={styles.selectContainer} onPress={openVolumeModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Volume
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {volume ? `${volume.volume.NUMERO_VOLUME}` : 'Aucun'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                                <View style={styles.selectContainer} onPress={openVolumeModalize}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Nombre de dossier
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {volume ? `${volume.volume.NOMBRE_DOSSIER}` : 'Aucun'}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                                {volumes ? <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>

                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {volumes ? volumes.NOMBRE_DOSSIER : null}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View> : null}
                                                {volume.volume.ID_ETAPE_VOLUME == ETAPES_VOLUME.DETAILLER_LES_FOLIO ?
                                                        <>
                                                                <TouchableOpacity style={styles.selectContainer} onPress={openMallesModalize}>
                                                                        <View>
                                                                                <Text style={styles.selectLabel}>
                                                                               Malle
                                                                                </Text>
                                                                                <View>
                                                                                        <Text style={styles.selectedValue}>
                                                                                                {malles ? `${malles.NUMERO_MAILLE}` : ' Sélectionner le malle'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={styles.selectContainer} onPress={openBatimentModalize}>
                                                                        <View>
                                                                                <Text style={styles.selectLabel}>
                                                                               Batiment
                                                                                </Text>
                                                                                <View>
                                                                                        <Text style={styles.selectedValue}>
                                                                                                {batiments ? `${batiments.NUMERO_BATIMENT}` : ' Sélectionner le batiment'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity>
                                                                {batiments ? <TouchableOpacity style={styles.selectContainer} onPress={openAilleModalize}>
                                                                        <View>
                                                                                <Text style={styles.selectLabel}>
                                                                               Ailes
                                                                                </Text>
                                                                                <View>
                                                                                        <Text style={styles.selectedValue}>
                                                                                                {ailles ? `${ailles.NUMERO_AILE}` : ' Sélectionner ailles'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity> : null}
                                                                {ailles ? <TouchableOpacity style={styles.selectContainer} onPress={openDistributeurModalize}>
                                                                        <View>
                                                                                <Text style={styles.selectLabel}>
                                                                                Distributeur
                                                                                </Text>
                                                                                <View>
                                                                                        <Text style={styles.selectedValue}>
                                                                                                {distributeur ? `${distributeur.NOM}` +`  ${distributeur.PRENOM}` : 'Sélectionner le distributeur'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity> : null}
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
                                                        </> :
                                                        <>{((folioNatures.length == volume.volume.NOMBRE_DOSSIER)) ? null : <>
                                                                <View style={{ marginBottom: 8 }}>
                                                                        <Text style={styles.label}>Dossier</Text>
                                                                </View>
                                                                <View style={{ marginVertical: 8 }}>
                                                                        <OutlinedTextField
                                                                                label="Dossier"
                                                                                fontSize={14}
                                                                                baseColor={COLORS.smallBrown}
                                                                                tintColor={COLORS.primary}
                                                                                containerStyle={{ borderRadius: 20 }}
                                                                                lineWidth={1}
                                                                                activeLineWidth={1}
                                                                                errorColor={COLORS.error}
                                                                                value={data.folio}
                                                                                onChangeText={(newValue) => handleChange('folio', newValue)}
                                                                                onBlur={() => checkFieldData('folio')}
                                                                                error={hasError('folio') ? getError('folio') : ''}
                                                                                autoCompleteType='off'
                                                                                blurOnSubmit={false}
                                                                        />
                                                                </View>
                                                                <View style={{ marginBottom: 8 }}>
                                                                        <Text style={styles.label}>Nature du dossier</Text>
                                                                </View>
                                                                <TouchableOpacity style={styles.selectContainer} onPress={openNaturesModalize}>
                                                                        <View>
                                                                                <Text style={styles.selectLabel}>
                                                                                Sélectionner la nature
                                                                                </Text>
                                                                                <View>
                                                                                        <Text style={styles.selectedValue}>
                                                                                                {natures ? `${natures.DESCRIPTION}` : 'Aucun'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity>
                                                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                                                        <View></View>
                                                                        <TouchableOpacity
                                                                                disabled={!isValidAdd()}
                                                                                onPress={onAddToCart}
                                                                        >
                                                                                <View style={[styles.buttonPlus, !isValidAdd() && { opacity: 0.5 }]}>
                                                                                        <Text style={styles.buttonTextPlus}>+</Text>
                                                                                </View>
                                                                        </TouchableOpacity>
                                                                </View>
                                                        </>}
                                                                {folioNatures.map((product, index) => {
                                                                        return (
                                                                                <View style={styles.headerRead} key={index}>
                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                <View style={styles.cardFolder}>
                                                                                                        <Text style={[styles.title]} numberOfLines={1}>{product.TOTAL}</Text>
                                                                                                        <View style={styles.cardDescription}>
                                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                                        </View>

                                                                                                </View>
                                                                                                <View>
                                                                                                        <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>{product.NATURE}</Text>
                                                                                                </View>
                                                                                                <View>
                                                                                                        <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>{product.ID_NATURE_FOLIO}</Text>
                                                                                                </View>
                                                                                                <View>
                                                                                                        <TouchableOpacity style={styles.reomoveBtn} onPress={() => onRemoveProduct(index)}>
                                                                                                                <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                                                                                        </TouchableOpacity>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        )
                                                                })}
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
                                                        </>
                                                }
                                        </View>
                                </ScrollView>
                                {volume.volume.ID_ETAPE_VOLUME == ETAPES_VOLUME.DETAILLER_LES_FOLIO ?
                                        <TouchableWithoutFeedback
                                                disabled={!isValidFin()}
                                                onPress={submitInMalle}
                                        >
                                                <View style={[styles.button, !isValidFin() && { opacity: 0.5 }]}>
                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                </View>
                                        </TouchableWithoutFeedback> : <TouchableWithoutFeedback
                                                disabled={!isValidFin()}
                                                onPress={submitFolio}
                                        >
                                                <View style={[styles.button, !isValidFin() && { opacity: 0.5 }]}>
                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                </View>
                                        </TouchableWithoutFeedback>}


                                <Portal>
                                        <Modalize ref={natureModalizeRef}  >
                                                <NatureDossierList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={volumeModalizeRef}  >
                                                <VolumeAgentSuperviseurList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={maleModalizeRef}  >
                                                <MalleList />
                                        </Modalize>
                                </Portal>

                                <Portal>
                                        <Modalize ref={batimentModalizeRef}  >
                                                <BatimentList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={aillesModalizeRef}  >
                                                <AillesList batiments={batiments} />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={distributrutModalizeRef}  >
                                                <DistributeurAgentList ailles={ailles} />
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
                backgroundColor:COLORS.primary,
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
        titlePrincipal2: {
                fontSize: 15,
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
        label: {
                fontSize: 16,
                fontWeight: 'bold'
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
                marginVertical: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary
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
                paddingHorizontal: 30,
                marginBottom: 10
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