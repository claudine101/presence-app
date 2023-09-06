import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { COLORS } from "../../../../../styles/COLORS";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useState } from "react";
import Loading from "../../../../../components/app/Loading";
import fetchApi from "../../../../../helpers/fetchApi";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../../../hooks/useFetch";

/**
 * Screen pour signer le pv avec agents distibuteur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 2/9/2023
 * @returns 
 */

export default function ChoixAgentDistributeurRetourScreen() {
        const route = useRoute()
        const navigation = useNavigation()
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const { volume } = route.params
        const [loadingData, setLoadingData] = useState(false)

        const [allVolumes, setAllVolumes] = useState([])
        const [loadingAilleScanning, setLoadingAilleScanning] = useState(false)

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
                                                                                                {equipe?.USERS_ID == chef.USERS_ID ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
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

        const submitChefEquScan = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('USER_TRAITEMENT', equipe.USERS_ID)
                        form.append('ID_VOLUMES', volume?.ID_VOLUME)
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
                        const respo = await fetchApi(`/scanning/retour/agent/distributeur/${volume.ID_VOLUME}`, {
                                method: "PUT",
                                body: form
                        })
                        navigation.navigate("AllVolumeFolioRetourSupAilleScreen")
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
                                if (volume) {
                                        setLoadingAilleScanning(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/details/pretArchives/${volume.ID_VOLUME}`)
                                        setAllVolumes(vol.result)
                                }
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingAilleScanning(false)
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
                                                <Text style={styles.title} numberOfLines={2}>Affecter un agent distributeur</Text>
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
                                                <Text style={styles.selectedValue}>
                                                        {volume.ID_MALLE}
                                                </Text>
                                        </TouchableOpacity>
                                        {loadingAilleScanning ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumes?.foliosValid?.length > 0 ?
                                                        <View style={styles.selectContainer}>
                                                                <View style={{ width: '100%' }}>
                                                                        <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                <Text style={styles.selectedValue}>
                                                                                </Text>
                                                                                <Text style={styles.selectedValue}>
                                                                                        Les dossiers validés
                                                                                </Text>
                                                                        </View>
                                                                        <View style={styles.folioList}>
                                                                                {allVolumes?.foliosValid?.map((folio, index) => {
                                                                                        return (
                                                                                                <TouchableOpacity style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }} key={index}>
                                                                                                        <View style={[styles.folio]}>
                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                                <Image source={require("../../../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                        </View>
                                                                                                                        <View style={styles.folioDesc}>
                                                                                                                                <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                                <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                                                        </View>
                                                                                                </TouchableOpacity>
                                                                                        )
                                                                                })}
                                                                        </View>
                                                                </View>
                                                        </View> : null
                                        }
                                        <TouchableOpacity style={styles.selectContainer} onPress={openEquipeModalize}>
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
                        {/* <Portal>
                                <Modalize ref={foliosModalizeRef}  >
                                        <ListFolioStatusList />
                                </Modalize>
                        </Portal> */}
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
        },
})