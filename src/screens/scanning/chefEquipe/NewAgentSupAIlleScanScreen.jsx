import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from "../../../styles/COLORS";
import { useRef } from "react";
import { useState } from "react";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../hooks/useFetch";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import fetchApi from "../../../helpers/fetchApi";
import Loading from "../../../components/app/Loading";
import { useEffect } from "react";
import ETAPES_VOLUME from "../../../constants/ETAPES_VOLUME";

/**
 * Le screen pour de donner les volumes a un agent superviseur aile scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/8/2021
 * @returns 
 */

export default function NewAgentSupAIlleScanScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { volume, id, mailleNoTraite } = route.params
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [isCompressingPhotoPreparation, setIsCompressingPhotoPreparation] = useState(false)
        const [document, setDocument] = useState(null)
        const [documentPreparation, setDocumentPreparation] = useState(null)

        const [malles, setMalles] = useState('')
        const [loading, setLoading] = useState(false)
        const [loadingFolio, setLoadingFolio] = useState(true)
        const [folios, setFolios] = useState(true)
        const [loadingData, setLoadingData] = useState(false)
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingFolio(true)
                                const vol = await fetchApi(`/preparation/folio/folioChefEquipeNonPrepare/${id}`)
                                setFolios(vol.result)

                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, [id]))

        const isValidAdd = () => {
                var isValid = false
                var isValidPreparation = true
                if (folios.length > 0) {
                        isValidPreparation = agentSupPreparation != null && documentPreparation != null && males != null
                }
                isValid = ailleSuperviseur != null && document != null ? true : false
                return isValid && isValidPreparation
        }
        const FolioModalizeRef = useRef(null);
        const openFolioModalize = () => {
                FolioModalizeRef.current?.open();
        };
        // Aile superviseur select
        const superviseurModalizeRef = useRef(null);
        const [ailleSuperviseur, setAilleSuperviseur] = useState(null);
        const openAilleSUperviseurModalize = () => {
                superviseurModalizeRef.current?.open();
        };
        const setSelectedAgentSupAille = (sup) => {
                superviseurModalizeRef.current?.close();
                setAilleSuperviseur(sup)
        }
        // Malle select
        const maleModalizeRef = useRef(null);
        const [males, setMales] = useState(null);
        const openMallesModalize = () => {
                maleModalizeRef.current?.open();
        };
        const setSelectedMalle = (mal) => {
                maleModalizeRef.current?.close();
                setMales(mal)
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

        //superviseur aile preparation select
        const agentSupPreparationModalizeRef = useRef(null);
        const [agentSupPreparation, setAgentSupPreparation] = useState(null);
        const openAgentSupPreparationModalize = () => {
                agentSupPreparationModalizeRef.current?.open();
        };
        const setSelectedAgent = (agent) => {
                agentSupPreparationModalizeRef.current?.close();
                setAgentSupPreparation(agent)
        }

        //Composent pour afficher la listes des agents aille superviseur 
        const AilleSuperviseurList = () => {
                const [loadingVolume, volumesAll] = useFetch('/scanning/volume/agentSupAille')
                return (
                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner l'agent</Text>
                                                </View>
                                                {volumesAll?.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun agent superviseur trouves</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        {volumesAll?.result?.map((sup, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedAgentSupAille(sup)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                <Image source={{ uri: sup.PHOTO_USER }} style={styles.listItemImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.listItemTitle}>{sup.NOM} {sup.PRENOM}</Text>
                                                                                                                <Text style={styles.listItemSubTitle}>{sup.EMAIL}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {ailleSuperviseur?.USERS_ID == sup.USERS_ID ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialIcons name="radio-button-unchecked" size={24} color={COLORS.primary} />}

                                                                                        </View>
                                                                                </TouchableNativeFeedback>
                                                                        </ScrollView>
                                                                )
                                                        })}
                                                </View>
                                        </View>
                                }
                        </>
                )
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
                                                {mallesAll?.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun malles trouvés</Text></View> :
                                                        mallesAll?.result?.map((mal, index) => {
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
        //Composent pour afficher la listes folios
        const FolioList = () => {
                const [loadingFolio, allfolios] = useFetch(`/preparation/folio/folioChefEquipe/${id}`)
                return (
                        <>
                                {loadingFolio ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Folios</Text>
                                                </View>
                                                {allfolios?.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun folio trouves</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        {allfolios?.result?.map((folio, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <View style={{ marginTop: 5, overflow: 'hidden', borderRadius: 8 }} key={index}>
                                                                                        <View style={[styles.folio]}>
                                                                                                <View style={styles.folioLeftSide}>
                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.folioDesc}>
                                                                                                                <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {
                                                                                                        folio.IS_PREPARE == 1 ?
                                                                                                                <>
                                                                                                                        <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                                                                </> : <>
                                                                                                                        <MaterialIcons style={styles.checkIndicator} name="cancel" size={24} color="red" />
                                                                                                                </>
                                                                                                }


                                                                                        </View>
                                                                                </View>
                                                                        </ScrollView>
                                                                )
                                                        })}
                                                </View>
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
                                                        {batimentsAll?.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun batiment trouvés</Text></View> :
                                                                batimentsAll?.result?.map((bat, index) => {
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
                                                {allailles?.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun aile trouvés</Text></View> :
                                                        allailles?.map((ail, index) => {
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
        //Composent pour afficher la listes des agents aille superviseur  prepration

        const AilleSuperviseurPreparationList = (ailes) => {
                const [superviseurList, setSuperviseurList] = useState([]);
                const [loadingSuperviseur, setLoadingSuperviseur] = useState(false);
                useEffect(() => {
                        (async () => {
                                try {

                                        if (ailes) {
                                                setLoadingSuperviseur(true)
                                                const distr = await fetchApi(`/preparation/batiment/superviseurAile?aile=${ailles.ID_AILE}`)
                                                setSuperviseurList(distr.result)
                                        }
                                }
                                catch (error) {
                                        console.log(error)
                                } finally {
                                        setLoadingSuperviseur(false)
                                }
                        })()
                }, [ailles])

                return (
                        <>
                                {loadingSuperviseur ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner l'agent</Text>
                                                </View>
                                                {superviseurList?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun agent superviseur trouvés</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        {superviseurList?.map((sup, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedAgent(sup)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                <Image source={{ uri: sup.PHOTO_USER }} style={styles.listItemImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.listItemTitle}>{sup.NOM} {sup.PRENOM}</Text>
                                                                                                                <Text style={styles.listItemSubTitle}>{sup.EMAIL}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {agentSupPreparation?.USERS_ID == sup.USERS_ID ? <MaterialIcons name="radio-button-checked" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialIcons name="radio-button-unchecked" size={24} color={COLORS.primary} />}

                                                                                        </View>
                                                                                </TouchableNativeFeedback>
                                                                        </ScrollView>
                                                                )
                                                        })}
                                                </View>
                                        </View>
                                }
                        </>
                )
        }

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
        const onTakePichaPreparation = async () => {
                setIsCompressingPhotoPreparation(true)
                const permission = await ImagePicker.requestCameraPermissionsAsync()
                if (!permission.granted) return false
                const image = await ImagePicker.launchCameraAsync()
                if (image.canceled) {
                        return setIsCompressingPhotoPreparation(false)
                }
                const photo = image.assets[0]
                setDocumentPreparation(photo)
                const manipResult = await manipulateAsync(
                        photo.uri,
                        [
                                { resize: { width: 500 } }
                        ],
                        { compress: 0.7, format: SaveFormat.JPEG }
                );
                setIsCompressingPhotoPreparation(false)
                //     handleChange('pv', manipResult)
        }
        const submitAgSupAilleData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('USER_TRAITEMENT', ailleSuperviseur.USERS_ID)
                        form.append('ID_ETAPE_VOLUME', volume.ID_ETAPE_VOLUME)
                        if (folios.length > 0) {
                                form.append('MAILLE', males.ID_MAILLE)
                                form.append('AGENT_SUP_AILE', agentSupPreparation.USERS_ID)
                                if (documentPreparation) {
                                        const manipResult = await manipulateAsync(
                                                documentPreparation.uri,
                                                [
                                                        { resize: { width: 500 } }
                                                ],
                                                { compress: 0.8, format: SaveFormat.JPEG }
                                        );
                                        let localUri = manipResult.uri;
                                        let filename = localUri.split('/').pop();
                                        let match = /\.(\w+)$/.exec(filename);
                                        let type = match ? `image/${match[1]}` : `image`;
                                        form.append('PV_PREPARATION', {
                                                uri: localUri, name: filename, type
                                        })
                                }
                        }

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
                        const volumes = await fetchApi(`/scanning/volume/${id}`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.goBack()
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoadingData(false)
                }
        }

        //fonction pour recuperer le malle correspond a un volume
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const vol = await fetchApi(`/scanning/volume/maille/${volume.ID_VOLUME}`)
                                setMalles(vol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, [volume]))

        return (
                <>
                        {loadingData && <Loading />}
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
                                                <Text style={styles.title} numberOfLines={2}>Affecter un agent superviseur aile scanning</Text>
                                        </View>
                                </View>
                                <ScrollView style={styles.inputs}>
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
                                                        {volume.NUMERO_VOLUME}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Malle
                                                        </Text>
                                                </View>
                                                <View>
                                                        {mailleNoTraite ? <Text style={styles.selectedValue}>
                                                                {mailleNoTraite.NUMERO_MAILLE}
                                                        </Text> : malles ? <Text style={styles.selectedValue}>
                                                                {malles.maille.NUMERO_MAILLE}
                                                        </Text> :
                                                                <Text>N/B</Text>
                                                        }
                                                </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openFolioModalize}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <Ionicons name= "eye-off-outline"  size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Voir les dossiers
                                                        </Text>
                                                </View>
                                        </TouchableOpacity> 

                                        <TouchableOpacity style={styles.selectContainer} onPress={openAilleSUperviseurModalize}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <Feather name="user" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Agent superviseur aile scanning
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {ailleSuperviseur ? `${ailleSuperviseur.NOM} ${ailleSuperviseur.PRENOM}` : "Cliquer pour choisir l'agent"}
                                                </Text>
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
                                        {
                                                folios.length > 0 ? <View style={styles.cardPreparation}>
                                                        <Text style={styles.selectLabelPreration}>
                                                                Phase préparation
                                                        </Text>
                                                        <TouchableOpacity style={styles.selectContainer} onPress={openMallesModalize}>
                                                                <View style={styles.labelContainer}>

                                                                        <Text style={styles.selectLabel}>
                                                                                Malle des dossiers non préparés
                                                                        </Text>
                                                                </View>
                                                                <Text style={styles.selectedValue}>
                                                                        {males ? `${males.NUMERO_MAILLE}` : ' Sélectionner le malle'}
                                                                </Text>
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
                                                        {ailles ?
                                                                <TouchableOpacity style={styles.selectContainer} onPress={openAgentSupPreparationModalize}>
                                                                        <View style={styles.labelContainer}>
                                                                                <View style={styles.icon}>
                                                                                        <Feather name="user" size={20} color="#777" />
                                                                                </View>
                                                                                <Text style={styles.selectLabel}>
                                                                                        Agent superviseur aile préparation
                                                                                </Text>
                                                                        </View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {agentSupPreparation ? `${agentSupPreparation.NOM} ${agentSupPreparation.PRENOM}` : "Cliquer pour choisir l'agent"}
                                                                        </Text>
                                                                </TouchableOpacity> : null
                                                        }
                                                        <TouchableOpacity onPress={onTakePichaPreparation}>
                                                                <View style={[styles.addImageItem]}>
                                                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                        <FontAwesome5 name="file-signature" size={20} color="#777" />
                                                                                        <Text style={styles.addImageLabel}>
                                                                                                Photo du procès verbal
                                                                                        </Text>
                                                                                </View>
                                                                                {isCompressingPhotoPreparation ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                                                        </View>
                                                                        {documentPreparation && <Image source={{ uri: documentPreparation.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                                                </View>
                                                        </TouchableOpacity>
                                                </View> : null
                                        }
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitAgSupAilleData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View>
                        <Modalize ref={superviseurModalizeRef}  >
                                <AilleSuperviseurList />
                        </Modalize>
                        <Modalize ref={FolioModalizeRef}  >
                                <FolioList />
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
                        <Modalize ref={agentSupPreparationModalizeRef}  >
                                <AilleSuperviseurPreparationList ailes={ailles} />
                        </Modalize>

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
        inputs: {
                paddingHorizontal: 10
        },
        selectContainer: {
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#ddd",
                marginVertical: 10
        },
        selectedValue: {
                color: '#777',
                marginTop: 2,
                marginHorizontal: 5
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
        },
        selectLabelPreration: {
                textAlign: "center",
                fontWeight: 'bold',
                color: '#777',
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
                width: '90%',
                height: '90%',
                borderRadius: 10
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
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#ddd",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5
        },
        addImageItemPreparation: {
                borderWidth: 0.5,
                borderColor: "#fff",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5
        },
        addImageLabel: {
                marginLeft: 5,
                opacity: 0.8
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
        folio: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ddd',
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
                backgroundColor: '#fff',
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
        modalList: {
                marginHorizontal: 10
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
        modalItemCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
        },
        cardPreparation: {
                backgroundColor: "#f1f1f1",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#ddd",
                marginVertical: 10
        },
})