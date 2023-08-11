import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from 'moment'
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import IDS_ETAPES_FOLIO from "../../../../constants/IDS_ETAPES_FOLIO"
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import fetchApi from "../../../../helpers/fetchApi";
import Loading from "../../../../components/app/Loading";

export default function DetailsFolioRetourChefPlateau() {
        const route = useRoute()
        const { folio, ID_ETAPE_FOLIO } = route.params
        const navigation = useNavigation()
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [loadingData, setLoadingData] = useState(false)

        const isValidAdd = () => {
                var isValid = false
                isValid = document != null ? true : false
                return isValid
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

        const submitPlateauData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('folio', JSON.stringify(folio))
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
                        const folioss = await fetchApi(`/scanning/volume/retour/plateau`, {
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
                                        <Text style={styles.title} numberOfLines={2}>Listes des folios</Text>
                                </View>
                        </View>
                        <ScrollView>
                                {folio.map((fol, index) => {
                                        console.log(fol)
                                        return (
                                                <>
                                                        <View>
                                                                <View style={styles.cardDetails}>
                                                                        <View style={styles.carddetailItem}>
                                                                                <View style={styles.cardImages}>
                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                </View>
                                                                                <View style={styles.cardDescription}>
                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                <View>
                                                                                                        <Text style={styles.itemVolume}>{fol.folio.NUMERO_FOLIO}</Text>
                                                                                                        {/* <Text>sjjjs</Text> */}
                                                                                                </View>
                                                                                                <Text>{moment(fol.DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text>
                                                                                        </View>
                                                                                </View>
                                                                        </View>
                                                                </View>
                                                        </View>
                                                </>
                                        )
                                })}
                        </ScrollView>
                        {ID_ETAPE_FOLIO == IDS_ETAPES_FOLIO.RETOUR_EQUIPE_SCANNING_V_AGENT_SUP_SCANNING ? <View style={{ marginHorizontal: 10 }}>
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
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitPlateauData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
                        </View> : null}
                </View>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
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
        cardDetails: {
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#fff',
                padding: 10,
                overflow: 'hidden',
                marginHorizontal: 10
        },
        carddetailItem: {
                flexDirection: 'row',
                alignItems: 'center',
        },
        cardImages: {
                backgroundColor: '#DCE4F7',
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center'
        },
        cardDescription: {
                marginLeft: 10,
                flex: 1
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary,
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
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