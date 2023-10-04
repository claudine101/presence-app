import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, MaterialIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import moment from 'moment'
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import IDS_ETAPES_FOLIO from "../../../../constants/IDS_ETAPES_FOLIO"
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import fetchApi from "../../../../helpers/fetchApi";
import Loading from "../../../../components/app/Loading";
import PROFILS from "../../../../constants/PROFILS";
import ImageView from "react-native-image-viewing";
import { useRef } from "react";
import { useCallback } from "react";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../../hooks/useFetch";

/**
 * Screen pour afficher les details de volumes contenant les folios traites
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 28/8/2023
 * @returns 
 */

export default function DetailsTraitesChefEquipeScanScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { folio, PV_PATH, date, userTraite } = route.params

        const [galexyIndex, setGalexyIndex] = useState(null)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [loadingData, setLoadingData] = useState(false)
        const [pvs, setPvs] = useState(null)
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)

        const folio_ids = folio?.folios?.map(foli => foli.ID_FOLIO)

        const isValidAdd = () => {
                var isValid = false
                isValid = document != null && equipe != null ? true : false
                return isValid
        }

        // Agent distributeur select
        const equipeModalizeRef = useRef(null);
        const [equipe, setEquipe] = useState(null);
        const openEquipeModalize = () => {
                equipeModalizeRef.current?.open();
        };
        const setSelectedEquipe = (equi) => {
                equipeModalizeRef.current?.close();
                setEquipe(equi)
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

        //Composent pour afficher la listes des distributeurs
        const EquipeScanningList = () => {
                const [loadingVolume, volumesAll] = useFetch('/scanning/retour/agent/distributeur')
                return (

                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner l'agent</Text>
                                                </View>
                                                {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun agent distributeur trouves</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        {volumesAll.result.map((chef, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedEquipe(chef)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                <Image source={{ uri: chef.PHOTO_USER }} style={styles.listItemImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.itemTitle}>{chef.NOM} {chef.PRENOM}</Text>
                                                                                                                <Text style={{ ...styles.itemTitle, color: "#777" }}>{chef.EMAIL}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {equipe?.USERS_ID == chef.USERS_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}

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

        const submitChefEquScan = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('ID_FOLIOS', JSON.stringify(folio_ids))
                        form.append('USER_TRAITEMENT', equipe.USERS_ID)
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
                        const folioss = await fetchApi(`/scanning/retour/agent/retour/plateau/archivages/equi/distr`, {
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

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingPvs(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                const res = await fetchApi(`/scanning/retour/agent/chefPlateau/retour/pvs/ChefEquipe/retour/Pvscscs`, {
                                        method: "POST",
                                        body: form
                                })
                                setPvs(res)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingPvs(false)
                        }
                })()
        }, []))

        return (
                <>{(galexyIndex != null && PV_PATH && pvs?.result) &&
                        <ImageView
                                images={[{ uri: pvs?.result.PV_PATH }, date ? { uri: PV_PATH } : undefined]}
                                imageIndex={galexyIndex}
                                visible={(galexyIndex != null) ? true : false}
                                onRequestClose={() => setGalexyIndex(null)}
                                swipeToCloseEnabled
                                keyExtractor={(_, index) => index.toString()}
                        />
                }
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
                                        <Text style={styles.title}>{folio?.folios[0]?.volume?.NUMERO_VOLUME}</Text>
                                </View>
                                {
                                        loadingPvs ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                <ScrollView style={styles.inputs}>
                                                        <View style={styles.selectContainer}>
                                                                <View style={{ width: '100%' }}>
                                                                        <View style={styles.labelContainer}>
                                                                                <View style={styles.icon}>
                                                                                        <Feather name="user" size={20} color="#777" />
                                                                                </View>
                                                                                <Text style={styles.selectLabel}>
                                                                                        Agent superviseur aille
                                                                                </Text>
                                                                        </View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {userTraite?.NOM} {userTraite?.PRENOM}
                                                                        </Text>
                                                                        <View style={{ width: '100%' }}>
                                                                                {pvs?.result ?
                                                                                        <>
                                                                                                <TouchableOpacity onPress={() => {
                                                                                                        setGalexyIndex(0)
                                                                                                }}>
                                                                                                        <Image source={{ uri: pvs?.result.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                                </TouchableOpacity>
                                                                                                <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(pvs.result.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                                        </> : null}

                                                                        </View>
                                                                </View>
                                                        </View>

                                                        {folio?.folios?.length > 0 ? <View style={styles.selectContainer}>
                                                                <View style={{ width: '100%' }}>
                                                                        <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                <Text style={styles.selectedValue}>
                                                                                </Text>
                                                                                <Text style={styles.selectedValue}>
                                                                                        {/* {pvs?.result?.foliosPrepares.length} préparé{pvs?.result?.foliosPrepares.length > 1 && 's'} */}
                                                                                        {/* {folio?.folios.length} pret à être reconcilier{folio?.folios.length > 1 && 's'} */}
                                                                                </Text>
                                                                        </View>
                                                                        <View style={styles.folioList}>
                                                                                {folio?.folios.map((folio, index) => {
                                                                                        return (
                                                                                                <TouchableOpacity style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }} key={index}>
                                                                                                        <View style={[styles.folio]}>
                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                                <Image source={require("../../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                        </View>
                                                                                                                        <View style={styles.folioDesc}>
                                                                                                                                <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                                <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                {folio.IS_VALIDE == 1 ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> : null}
                                                                                                                {folio.IS_RECONCILIE == 0 ? <MaterialIcons name="cancel-presentation" size={24} color="red" /> : null}
                                                                                                                {(folio.IS_VALIDE == 0 && folio.IS_RECONCILIE == 1) ? <MaterialIcons name="cancel-presentation" size={24} color="red" /> : null}
                                                                                                        </View>
                                                                                                </TouchableOpacity>
                                                                                        )
                                                                                })}
                                                                        </View>
                                                                </View>
                                                        </View> : null}
                                                        <View style={styles.selectContainer}>
                                                                <View style={{ width: '100%' }}>
                                                                        {loadingPvs ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <ActivityIndicator animating size={'small'} color={'#777'} />
                                                                                <Text style={[styles.selectedValue, { marginLeft: 5 }]}>
                                                                                        Chargement
                                                                                </Text>
                                                                        </View> : null}
                                                                        <Text style={styles.selectedValue}>
                                                                                {/* {pvs?.result?.traitement?.NOM} {pvs?.result?.traitement?.PRENOM} */}
                                                                                PV de retour
                                                                        </Text>
                                                                        {PV_PATH ?
                                                                                <>
                                                                                        <TouchableOpacity onPress={() => {
                                                                                                setGalexyIndex(0)
                                                                                        }}>
                                                                                                <Image source={{ uri: PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                        </TouchableOpacity>
                                                                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(date).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                                </> : null}
                                                                </View>
                                                        </View>
                                                        <TouchableOpacity style={styles.selectContainer1} onPress={openEquipeModalize}>
                                                                <View style={styles.labelContainer}>
                                                                        <View style={styles.icon}>
                                                                                <Feather name="user" size={20} color="#777" />
                                                                        </View>
                                                                        <Text style={styles.selectLabel}>
                                                                                Agent distributeur
                                                                        </Text>
                                                                </View>
                                                                <Text style={styles.selectedValue}>
                                                                        {equipe ? `${equipe.NOM} ${equipe.PRENOM}` : "Cliquer pour choisir l'agent"}
                                                                </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={onTakePicha}>
                                                                <View style={[styles.addImageItem1]}>
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
                                                </ScrollView>}
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitChefEquScan}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View>
                        <Portal>
                                <Modalize ref={equipeModalizeRef}  >
                                        <EquipeScanningList />
                                </Modalize>
                        </Portal>
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
                backgroundColor: '#f1f1f1',
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
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary,
                marginHorizontal: 10,
                marginBottom:5
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        selectContainer1: {
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
                marginTop: 2
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
        },
        addImageItem1: {
                borderWidth: 0.5,
                borderColor: "#ddd",
                borderRadius: 5,
                paddingVertical: 15,
                marginBottom: 5,
                marginHorizontal: 10
        },
})
