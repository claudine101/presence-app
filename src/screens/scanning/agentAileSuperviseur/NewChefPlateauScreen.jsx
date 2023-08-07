import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
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
 * @date 1/8/2021
 * @returns 
 */

export default function NewChefPlateauScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { volume, id } = route.params
        const [document, setDocument] = useState(null)
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
                                {loadingVolume ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Listes des chefs plateaux</Text>
                                                </View>
                                                {volumesAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun chef plateau trouves</Text></View> : null}
                                                {volumesAll.result.map((chef, index) => {
                                                        return (
                                                                <ScrollView key={index}>
                                                                        <TouchableNativeFeedback onPress={() => setSelectedChefPlateu(chef)}>
                                                                                <View style={styles.modalItem} >
                                                                                        <View style={styles.modalImageContainer}>
                                                                                                <AntDesign name="folderopen" size={20} color="black" />
                                                                                        </View>
                                                                                        <View style={styles.modalItemCard}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemTitle}>{chef.NOM} {chef.PRENOM}</Text>
                                                                                                        <Text style={styles.itemTitleDesc}>{chef.EMAIL}</Text>
                                                                                                </View>
                                                                                                {chefPlateau?.USERS_ID == chef.USERS_ID ? <Fontisto name="checkbox-active" size={21} color="#007bff" /> :
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

        //Fonction pour le prendre l'image avec l'appareil photos
        const onTakePicha = async () => {
                try {
                        const permission = await ImagePicker.requestCameraPermissionsAsync()
                        if (!permission.granted) return false
                        const image = await ImagePicker.launchCameraAsync()
                        if (!image.canceled) {
                                setDocument(image)
                        }
                }
                catch (error) {
                        console.log(error)
                }
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
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                <Text numberOfLines={2} style={styles.titlePrincipal}>Selection d'un chef plateau</Text>
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
                                                                                {volume.volume.NUMERO_VOLUME}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <View>
                                                <View style={styles.selectContainer}>
                                                        <View>
                                                                <Text style={styles.selectLabel}>
                                                                        Malle
                                                                </Text>
                                                                <View>
                                                                        {malles ? <Text style={styles.selectedValue}>
                                                                                {malles.maille.NUMERO_MAILLE}
                                                                        </Text> : <Text>N/B</Text>}
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openChefPlateuModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le chef du plateau
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {chefPlateau ? `${chefPlateau.NOM}` + `${chefPlateau.PRENOM}` : 'Aucun'}
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
                                onPress={submitChefPlateauData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View>
                        <Portal>
                                <Modalize ref={chefPlateauModalizeRef}  >
                                        <ChefPlateauList />
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
                backgroundColor: COLORS.primary,
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
                backgroundColor:COLORS.primary,
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
})