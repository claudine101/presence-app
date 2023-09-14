import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableNativeFeedback, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../styles/COLORS";
import { useNavigation, useRoute } from "@react-navigation/native";
import fetchApi from "../../helpers/fetchApi";
import { Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import * as DocumentPicker from 'expo-document-picker';
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import IDS_ETAPES_FOLIO from "../../constants/ETAPES_FOLIO";
import moment from 'moment'
import ImageView from "react-native-image-viewing";


/**
 * Screen pour afficher le details de folio avec leur nature  
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 02/8/2023
 * @returns 
 */

export default function DetailsAgentPreparationRetourneScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { folio } = route.params
    const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [document, setDocument] = useState(null)
    const [selectedItems, setSelectedItems] = useState(folio.folios)
    const [galexyIndex, setGalexyIndex] = useState(null)
    // setSelectedItems(folio?.folios)
    const [data, handleChange, setValue] = useForm({
        // document: null,
    })

    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
    }, {
    })
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
    const submitData = async () => {
        try {
            setLoadingSubmit(true)
            const form = new FormData()
            form.append('folio', JSON.stringify(folio.folios))
            form.append('folioPrepare', JSON.stringify(selectedItems))
            form.append('AGENT_PREPARATION', folio.users.USERS_ID)
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

            if (folio?.mailleNoTraite) {
                form.append('ID_MAILLE_NO_TRAITE', folio?.mailleNoTraite.ID_MAILLE)
            }
            const res = await fetchApi(`/preparation/folio/retourAgentPreparation`, {
                method: "PUT",
                body: form
            })
            navigation.goBack()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoadingSubmit(false)
        }
    }


    return (
        <>
            {(galexyIndex != null && folio && folio) &&
                <ImageView
                    images={[{ uri: folio.PV_PATH }]}
                    imageIndex={galexyIndex}
                    visible={(galexyIndex != null) ? true : false}
                    onRequestClose={() => setGalexyIndex(null)}
                    swipeToCloseEnabled
                    keyExtractor={(_, index) => index.toString()}
                />
            }

            {loadingSubmit && <Loading />}
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
                        <Text style={styles.title} numberOfLines={2}>{folio.users.NOM} {folio.users.PRENOM}</Text>
                    </View>
                </View>
                <ScrollView>
                    {folio.folios.length > 0 ?
                        <View style={styles.selectContainer}>
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
                                        {folio.folios.length} dossier{folio.folios.length > 1 && 's'}
                                    </Text>
                                    <Text style={styles.selectedValue}>
                                        {selectedItems?.length} préparé{selectedItems.length > 1 && 's'}
                                    </Text>
                                </View>
                                <View style={styles.folioList}>
                                    {folio?.folios?.map((folio, index) => {
                                        return (
                                            <View key={index}>
                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ActivityIndicator animating size={'large'} color={'#777'} />
                                                </View> :
                                                    <View style={{ marginTop: 10, borderRadius: 80, }} >
                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple("#c4c4c4", false)}
                                                            disabled>
                                                            <View style={[styles.folio]}>
                                                                <View style={styles.folioLeftSide}>
                                                                    <View style={styles.folioLeft}>
                                                                        <View style={styles.folioImageContainer}>
                                                                            <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                        </View>
                                                                        <View style={styles.folioDesc}>
                                                                            <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                                                            <View style={styles.natureCard}>
                                                                                <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                                <Text style={styles.folioSubname}>Nature:{folio.natures.DESCRIPTION}</Text>
                                                                                <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableNativeFeedback>
                                                    </View>
                                                }
                                            </View>
                                        )
                                    })}

                                </View>
                            </View>
                        </View> : null}
                    <View style={styles.selectContainer}>
                        <View style={{ width: '100%' }}>

                            <>
                                <TouchableOpacity onPress={() => {
                                    setGalexyIndex(0)
                                }}>
                                    <Image source={{ uri: folio.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                </TouchableOpacity>
                                <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(folio.date).format("DD/MM/YYYY [à] HH:mm")}</Text>
                            </>
                        </View>
                    </View>
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
                    onPress={submitData}
                >
                    <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                        <Text style={styles.buttonText}>Enregistrer</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    cardDetails: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#c4c4c4',
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 15,
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
    cardHeader: {
        flexDirection: 'row',
        // marginTop: StatusBar.currentHeight,
        alignContent: "center",
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
        marginVertical: 10
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
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10,
        marginHorizontal: 10
    },
    selectedValue: {
        color: '#777'
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#000",
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
    headerRead: {
        borderRadius: 8,
        backgroundColor: "#f1f1f1",
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginHorizontal: 10
    },
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1

    },
    folioLeft: {
        flexDirection: 'row',
        alignItems: 'center',

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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#777',
        // color: COLORS.primary
    },
    cardTitle: {
        maxWidth: "85%"
    },
})