import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Alert, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, Fontisto, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
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
import Folios from "../../components/folio/Folios";

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
        const [loading, setLoading] = useState(false)
        const [document, setDocument] = useState(null)
        const [dossier, setDossier] = useState(null)
        const [folios, setFolios] = useState([])
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)


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
                var isValidFolio = false
                isValidFolio = data.folio != "" ? true : false
                isValid = natures != null ? true : false
                return isValid && isValidFolio
        }

        const isValidFin = () => {
                var isVal = false
                var isValidFolio = false
                isVal = folios.length == volume.volume.NOMBRE_DOSSIER ? true : false
                isValidFolio = document != null ? true : false
                return isVal && isValidFolio
        }
        const isValidFinDistr = () => {
                var isVal = false
                isVal = document != null && malles?.ID_MAILLE && distributeur?.USERS_ID ? true : false
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

        useEffect(() => {
                if (natures && data.folio) {
                        setDossier(natures?.DESCRIPTION + data.folio)
                }
        }, [data.folio, natures])
        //Fonction pour ajouter un volume da le redux
        const handleAdd = (vol) => {
                if (data.folio <= 200) {
                        const folio = folios.find(f => f.NUMERO_FOLIO == data.folio)
                        if (!folio) {
                                setFolios(vols => [...vols, { NUMERO_FOLIO: data.folio, NUMERO_DOSSIER: natures.DESCRIPTION + data.folio, ID_NATURE: natures.ID_NATURE_FOLIO }])
                                handleChange("folio", "")
                                setNatures(null)
                                setDossier(null)
                        }
                        else {
                                setError("folio", ["folio existe"])
                        }
                }
                else {
                        setError("folio", ["folio invalide"])
                }
        }
        //Fonction pour enlever un volume da le redux
        const onRemoveFolio = (volIndex) => {
                Alert.alert("Enlever le volume", "Voulez-vous vraiment enlever ce volume dans les details?",
                        [
                                {
                                        text: "Annuler",
                                        style: "cancel"
                                },
                                {
                                        text: "Oui", onPress: async () => {
                                                const removed = folios.filter((vol, index) => index != volIndex)
                                                setFolios(removed)
                                        }
                                }
                        ])
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
                                                                                                {volumes?.ID_VOLUME == vol.ID_VOLUME ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
                                                                                                {natures?.ID_NATURE_FOLIO == nat.ID_NATURE_FOLIO ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
                                                                                                {malles?.ID_MAILLE == mal.ID_MAILLE ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
                                                                                                        {batiments?.ID_BATIMENT == bat.ID_BATIMENT ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
                                                                                                {ailles?.ID_AILE == ail.ID_AILE ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
                                                                                                {distributeur?.USERS_ID == distr.USERS_ID ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
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
                        form.append('folio', JSON.stringify(folios))
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
                                <View style={styles.header}>
                                        <TouchableNativeFeedback onPress={() => navigation.goBack()} background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.headerBtn}>
                                                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                {volume.volume.ID_ETAPE_VOLUME == ETAPES_VOLUME.DETAILLER_LES_FOLIO ?
                                                        <Text style={styles.title} numberOfLines={2}>Ajouter le volume dans une malle</Text> :
                                                        <Text style={styles.title} numberOfLines={2}>Détailler le volume</Text>
                                                }
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
                                                                                <Text style={styles.selectedValue}>
                                                                                        {malles ? `${malles.NUMERO_MAILLE}` : ' Sélectionner le malle'}
                                                                                </Text>
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
                                                                                        Aile
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
                                                                                                {distributeur ? `${distributeur.NOM}` + `  ${distributeur.PRENOM}` : 'Sélectionner le distributeur'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity> : null}
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
                                                        </> :
                                                        <>{((folios.length == volume.volume.NOMBRE_DOSSIER)) ? null : <>

                                                                <View style={{ marginVertical: 8, marginHorizontal: 10 }}>
                                                                        <OutlinedTextField
                                                                                label="Folio"
                                                                                fontSize={14}
                                                                                baseColor={COLORS.smallBrown}
                                                                                tintColor={COLORS.primary}
                                                                                containerStyle={{ borderRadius: 20 }}
                                                                                lineWidth={0.25}
                                                                                activeLineWidth={0.25}
                                                                                errorColor={COLORS.error}
                                                                                value={data.folio}
                                                                                onChangeText={(newValue) => handleChange('folio', newValue)}
                                                                                onBlur={() => checkFieldData('folio')}
                                                                                error={hasError('folio') ? getError('folio') : ''}
                                                                                autoCompleteType='off'
                                                                                blurOnSubmit={false}
                                                                                keyboardType='number-pad'

                                                                        />
                                                                </View>

                                                                <TouchableOpacity style={styles.selectContainer} onPress={openNaturesModalize}>
                                                                        <View>
                                                                                <Text style={styles.selectLabel}>
                                                                                        Nature du dossier
                                                                                </Text>
                                                                                <View>
                                                                                        <Text style={styles.selectedValue}>
                                                                                                {natures ? `${natures.DESCRIPTION}` : 'Aucun'}
                                                                                        </Text>
                                                                                </View>
                                                                        </View>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={styles.selectContainer}>
                                                                        <View style={styles.labelContainer}>
                                                                                <Text style={styles.selectLabel}>
                                                                                        Numéro dossier
                                                                                </Text>
                                                                        </View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {dossier ? `${dossier}` : 'Aucun'}
                                                                        </Text>
                                                                </TouchableOpacity>
                                                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                                                        <View></View>
                                                                        <TouchableOpacity
                                                                                disabled={!isValidAdd()}
                                                                                onPress={handleAdd}
                                                                        >
                                                                                <View style={[styles.buttonPlus, !isValidAdd() && { opacity: 0.5 }]}>
                                                                                        <Text style={styles.buttonTextPlus}>+</Text>
                                                                                </View>
                                                                        </TouchableOpacity>
                                                                </View>
                                                        </>}

                                                                {folios.map((folio, index) => {
                                                                        return (
                                                                                <View style={[styles.headerRead]} key={index}>
                                                                                        <View style={styles.folioImageContainer}>
                                                                                                <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                        </View>
                                                                                        <View style={styles.folioDesc}>
                                                                                                <Text style={styles.folioName}>{folio.NUMERO_DOSSIER}</Text>
                                                                                                <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                                                                                        </View>
                                                                                        <TouchableOpacity style={styles.reomoveBtn} onPress={() => onRemoveFolio(index)}>
                                                                                                <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                                                                        </TouchableOpacity>
                                                                                </View>
                                                                        )
                                                                })}
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

                                                        </>
                                                }
                                        </View>
                                </ScrollView>
                                {volume.volume.ID_ETAPE_VOLUME == ETAPES_VOLUME.DETAILLER_LES_FOLIO ?
                                        <TouchableWithoutFeedback
                                                disabled={!isValidFinDistr()}
                                                onPress={submitInMalle}
                                        >
                                                <View style={[styles.button, !isValidFinDistr() && { opacity: 0.5 }]}>
                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                </View>
                                        </TouchableWithoutFeedback> :
                                        <TouchableWithoutFeedback
                                                disabled={!isValidFin()}
                                                onPress={submitFolio}
                                        >
                                                <View style={[styles.button, !isValidFin() && { opacity: 0.5 }]}>
                                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                                </View>
                                        </TouchableWithoutFeedback>}
                                <Modalize ref={natureModalizeRef}  >
                                        <NatureDossierList />
                                </Modalize>
                                <Modalize ref={volumeModalizeRef}  >
                                        <VolumeAgentSuperviseurList />
                                </Modalize>

                                <Modalize ref={maleModalizeRef}  >
                                        <MalleList />
                                </Modalize>
                                <Modalize ref={batimentModalizeRef}  >
                                        <BatimentList />
                                </Modalize>
                                <Modalize ref={aillesModalizeRef}  >
                                        <AillesList batiments={batiments} />
                                </Modalize>

                                <Modalize ref={distributrutModalizeRef}  >
                                        <DistributeurAgentList ailles={ailles} />
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
        // selectedValue: {
        //         color: '#777'
        // },
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
                backgroundColor: COLORS.primary,
                marginHorizontal: 10,
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
                alignItems: "center",
                marginHorizontal: 10,
                marginBottom: 10
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
                marginTop: 2,
                marginLeft: 5
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
        },
        headerRead: {
                borderRadius: 8,
                backgroundColor: "#ddd",
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginBottom: 10,
                marginHorizontal: 10
        },
        folioImageContainer: {
                width: 60,
                height: 60,
                borderRadius: 40,
                backgroundColor: '#fff',
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