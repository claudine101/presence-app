import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
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

/**
 * Le screen pour de donner les folios au chef equipe
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 2/8/2021
 * @returns 
 */

export default function NewEquipeScanScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { folio } = route.params
        const [document, setDocument] = useState(null)
        const [loadingData, setLoadingData] = useState(false)

        const isValidAdd = () => {
                var isValid = false
                isValid =  equipe != null && multiFolios.length > 0 && document != null ? true : false
                return isValid 
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

        // Equipe scanning select
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

        //Composent pour afficher la listes des equipe scanning
        const EquipeScanningList = () => {
                const [loadingVolume, volumesAll] = useFetch('/scanning/volume/allEquipe')
                console.log(volumesAll)
                return (
                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des chefs plateaux</Text>
                                                </View>
                                                {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun equipe scanning trouves</Text></View> : null}
                                                {volumesAll.result.map((chef, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedEquipe(chef)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{chef.NOM_EQUIPE}</Text>
                                                                                                </View>
                                                                                                {equipe?.ID_EQUIPE == chef.ID_EQUIPE ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                        <Fontisto name="checkbox-passive" size={21} color="black" />}
                                                                                        </View>
                                                                                </View>
                                                                        </TouchableNativeFeedback>
                                                                </ScrollView>
                                                        )
                                                })}
                                        </View>}
                        </>
                )
        }

        //Composent pour afficher le modal de multi select des folio
        const MultiFolioSelctList = () => {
                const [allFolios, setAllFolios] = useState([]);
                const [foliosLoading, setFoliosLoading] = useState(false);

                const isSelected = id_folio => multiFolios.find(u => u.folio.ID_FOLIO == id_folio) ? true : false
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
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Listes des folios</Text>
                                        </View>
                                        {folio.folios.map((fol, index) => {
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
                                                                                                {/* <Text style={styles.itemTitleDesc}>{fol?.folio.CODE_FOLIO}</Text> */}
                                                                                        </View>
                                                                                        {isSelected(fol.folio.ID_FOLIO) ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
                                                                                                <Fontisto name="checkbox-passive" size={21} color="black" />}
                                                                                </View>
                                                                        </View>
                                                                </TouchableNativeFeedback>
                                                        </ScrollView>
                                                )
                                        })}
                                </View>
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

        const submitEquipeData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('ID_VOLUME', folio.ID_VOLUME)
                        form.append('folio', JSON.stringify(multiFolios))
                        form.append('USER_TRAITEMENT', equipe.ID_EQUIPE)
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
                        const volume = await fetchApi(`/scanning/folio/equipeScanning`, {
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
        return (
                <>
                         {loadingData && <Loading />}
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                <Text numberOfLines={2} style={styles.titlePrincipal}>Selection d'equipe scanning</Text>
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
                                                                        <Text style={styles.selectedValue}>
                                                                                {folio.volume.NUMERO_VOLUME}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <View>
                                                <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Nombre de dossiers
                                                                </Text>
                                                                <View>
                                                                        <Text style={styles.selectedValue}>
                                                                                {folio.volume.NOMBRE_DOSSIER}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openEquipeModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner une equipe scanning
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {equipe ? `${equipe.NOM_EQUIPE}` : 'Aucun'}
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
                                </ScrollView>
                                <TouchableWithoutFeedback
                                disabled={!isValidAdd()}
                                onPress={submitEquipeData}
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
                        <Portal>
                                <Modalize ref={multSelectModalizeRef}  >
                                        <MultiFolioSelctList />
                                </Modalize>
                        </Portal>
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
        cardTitle: {
                maxWidth: "85%"
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
        modalItemCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
        },
        itemTitle: {
                marginLeft: 10
        },
        itemTitleDesc: {
                color: "#777",
                marginLeft: 10,
                fontSize: 11
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
        },
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#000",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5,
                marginTop: 7
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
                backgroundColor: "#18678E",
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        butConfirmer: {
                borderRadius: 8,
                paddingVertical: 14,
                backgroundColor: "#18678E",
                marginHorizontal: 50,
                marginVertical: 15
        },
})