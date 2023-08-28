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
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [loadingData, setLoadingData] = useState(false)

        const isValidAdd = () => {
                var isValid = false
                isValid = equipe != null && multiFolios.length > 0 && document != null ? true : false
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

        //Composent pour afficher la listes des equipe scanning
        const EquipeScanningList = () => {
                const [loadingVolume, volumesAll] = useFetch('/scanning/volume/allEquipe')
                return (

                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner une équipe</Text>
                                                </View>
                                                {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucune equipe trouves</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        {volumesAll.result.map((chef, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedEquipe(chef)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                <Image source={require('../../../../assets/images/user.png')} style={styles.listItemImage} />
                                                                                                                {/* <AntDesign name="folderopen" size={20} color="black" /> */}
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.itemTitle}>{chef.NOM_EQUIPE}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {equipe?.ID_EQUIPE == chef.ID_EQUIPE ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}

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
                                        <View style={styles.modalList}>
                                                {folio.folios.map((fol, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedFolio(fol)}>
                                                                                <View style={styles.listItem} >
                                                                                        <View style={styles.listItemDesc}>
                                                                                                <View style={styles.listItemImageContainer}>
                                                                                                        {/* <Image source={require('../../../../assets/images/user.png')} style={styles.listItemImage} /> */}
                                                                                                        <AntDesign name="folderopen" size={20} color="black" />
                                                                                                </View>
                                                                                                <View style={styles.listNames}>
                                                                                                        <Text style={styles.itemTitle}>{fol.folio.NUMERO_FOLIO}</Text>
                                                                                                </View>
                                                                                        </View>
                                                                                        {isSelected(fol.folio.ID_FOLIO) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}

                                                                                </View>
                                                                        </TouchableNativeFeedback>
                                                                </ScrollView>
                                                        )
                                                })}
                                        </View>
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
                                <View style={styles.header}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.headerBtn}>
                                                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                <Text style={styles.title} numberOfLines={2}>Affecter une équipe scanning</Text>
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
                                                        {folio.volume.NUMERO_VOLUME}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Nombre de dossiers
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {folio.volume.NOMBRE_DOSSIER}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openEquipeModalize}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <Feather name="user" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Equipe scanning
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {equipe ? `${equipe.NOM_EQUIPE}` : "Cliquer pour choisir une equipe"}
                                                </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.selectContainer} onPress={openMultiSelectModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Folios
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {multiFolios.length > 0 ? multiFolios.length : 'Selectioner les folios'}
                                                                        {multiFolios.length > 0 ? <Text> sélectionner</Text> : null}
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
                marginTop: 2
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
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
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F1F1'
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
                width: '80%',
                height: '80%',
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
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        butConfirmer: {
                borderRadius: 8,
                paddingVertical: 14,
                backgroundColor: COLORS.primary,
                marginHorizontal: 50,
                marginVertical: 15
        },
})