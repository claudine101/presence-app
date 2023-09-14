import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from "../../../styles/COLORS";
import { useRef } from "react";
import { useState } from "react";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../hooks/useFetch";
import fetchApi from "../../../helpers/fetchApi";
import { useCallback } from "react";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import Loading from "../../../components/app/Loading";

/**
 * Le screen pour de donner les volumes a un chef du plateau
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/8/2023
 * @returns 
 */

export default function NewChefPlateauScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { volume, id, folios } = route.params
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [malles, setMalles] = useState('')
        const [loading, setLoading] = useState(false)
        const [loadingData, setLoadingData] = useState(false)

        const isValidAdd = () => {
                var isValid = false
                isValid = chefPlateau != null && document != null ? true : false
                return isValid
        }

        // Aile superviseur select
        const chefPlateauModalizeRef = useRef(null);
        const [chefPlateau, setChefPlateau] = useState(null);
        const openChefPlateuModalize = () => {
                chefPlateauModalizeRef.current?.open();
        };
        const setSelectedChefPlateu = (chef) => {
                chefPlateauModalizeRef.current?.close();
                setChefPlateau(chef)
        }

        //Composent pour afficher la listes les chefs plateaux
        const ChefPlateauList = () => {
                const [loadingVolume, volumesAll] = useFetch('/scanning/volume/plateau')
                return (
                        <>
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner chef plateau</Text>
                                                </View>
                                                {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun chef plateau trouves</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        {volumesAll.result.map((chef, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedChefPlateu(chef)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                <Image source={{ uri: chef.PHOTO_USER }} style={styles.listItemImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.itemTitle}>{chef.NOM} {chef.PRENOM}</Text>
                                                                                                                <Text style={styles.itemTitleDesc}>{chef.EMAIL}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {chefPlateau?.USERS_ID == chef.USERS_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color={COLORS.primary} />}

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

        const submitChefPlateauData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('USER_TRAITEMENT', chefPlateau.USERS_ID)
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
                        const volume = await fetchApi(`/scanning/retour/agent/chef/${id}`, {
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
                                const vol = await fetchApi(`/scanning/volume/maille/${volume.volume.ID_VOLUME}`)
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
                                                <Text style={styles.title} numberOfLines={2}>Affecter un chef plateau</Text>
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
                                                        {volume.volume.NUMERO_VOLUME}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <Text style={styles.selectLabel}>
                                                                Malle
                                                        </Text>
                                                </View>
                                                <View>
                                                        {malles ? <Text style={styles.selectedValue}>
                                                                {malles.maille.NUMERO_MAILLE}
                                                        </Text> : <Text>N/B</Text>}
                                                </View>
                                        </TouchableOpacity>
                                        {folios?.length > 0 ? <View style={styles.selectContainer}>
                                                <View style={{ width: '100%' }}>
                                                        <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <View style={styles.icon}>
                                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                                        </View>
                                                                        <Text style={styles.selectLabel}>
                                                                                Les dossiers
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Text style={styles.selectedValue}>
                                                                        {folios.length} dossier{folios.length > 1 && 's'}
                                                                </Text>
                                                                <Text style={styles.selectedValue}>
                                                                        {folios?.length} préparé{folios.length > 1 && 's'}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.folioList}>
                                                                {folios?.map((folio, index) => {
                                                                        return (
                                                                                <TouchableOpacity style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }} key={index}>
                                                                                        <View style={[styles.folio]}>
                                                                                                <View style={styles.folioLeftSide}>
                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.folioDesc}>
                                                                                                                <Text style={styles.folioName}>{folio?.NUMERO_FOLIO}</Text>
                                                                                                                <View style={styles.natureCard}>
                                                                                                                        <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                                                                        <Text style={styles.folioSubname}>Nature:{folio?.natures?.DESCRIPTION}</Text>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </View>
                                                                                        </View>
                                                                                </TouchableOpacity>
                                                                        )
                                                                })}
                                                        </View>
                                                </View>
                                        </View> : null}
                                        <TouchableOpacity style={styles.selectContainer} onPress={openChefPlateuModalize}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <Feather name="user" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Chef du plateau
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {chefPlateau ? `${chefPlateau.NOM} ${chefPlateau.PRENOM}` : "Cliquer pour choisir chef plateau"}
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
                                        onPress={submitChefPlateauData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View>
                        <Modalize ref={chefPlateauModalizeRef}  >
                                <ChefPlateauList />
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
                marginTop: 2
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                // marginLeft: 5
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
                flex: 1,
                marginLeft: 10
        },
        natureCard: {
                flexDirection: "row",
                justifyContent: "space-between",
               
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