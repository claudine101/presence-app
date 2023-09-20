import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import moment from 'moment'
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import fetchApi from "../../../../helpers/fetchApi";
import Loading from "../../../../components/app/Loading";
import ImageView from "react-native-image-viewing";
import { useRef } from "react";
import { useCallback } from "react";

/**
 * Screen pour afficher les details des folios par equipe
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 3/8/2023
 * @returns 
 */

export default function DetailsFolioRetourScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { folio, ID_ETAPE_FOLIO, ID_EQUIPE, userTraite } = route.params
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [loadingData, setLoadingData] = useState(false)
        const [reconsilier, setReconsilier] = useState(0)

        const [loading, setLoading] = useState(true)
        const agentsModalRef = useRef()
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [galexyIndex, setGalexyIndex] = useState(null)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [pvs, setPvs] = useState(null)

        const [check, setCheck] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)

        const folio_ids = folio?.folios?.map(foli => foli?.ID_FOLIO)

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingPvs(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                form.append('AGENT_SUPERVISEUR', userTraite)
                                const res = await fetchApi(`/scanning/retour/agent/equipe/pvs`, {
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

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCheck(true)
                                const res = await fetchApi(`/scanning/retour/agent/retour/equipeScanning/${userTraite}`)
                                setCheck(res.result)

                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
                        }
                })()
        }, [userTraite]))

        //Multi select pour selectionner les folios reconcilier
        const [multiFolios, setMultiFolios] = useState([]);
        const isSelected = id_folio => multiFolios.find(u => u.ID_FOLIO == id_folio) ? true : false
        const setSelectedFolio = (folio) => {
                if (isSelected(folio.ID_FOLIO)) {
                        const newfolio = multiFolios.filter(u => u.ID_FOLIO != folio.ID_FOLIO)
                        setMultiFolios(newfolio)
                } else {
                        setMultiFolios(u => [...u, folio])
                }

        }
        const isValidAdd = () => {
                var isValid = false
                isValid = document != null && multiFolios.length > 0 ? true : false
                return isValid
        }
        // const handleSubmit = (fol) => {
        //         navigation.navigate("NewFolioRetourScreen", { details: fol })
        // }

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

        const submitEquipeData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('ID_FOLIO', JSON.stringify(folio_ids))
                        form.append('folio', JSON.stringify(multiFolios))
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
                        const folioss = await fetchApi(`/scanning/volume/retour/chef`, {
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
                        {(galexyIndex != null && pvs?.result && pvs?.result) &&
                                <ImageView
                                        images={[{ uri: pvs?.result.PV_PATH }, pvs?.result?.retour ? { uri: pvs?.result?.retour.PV_PATH } : undefined]}
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
                                        <Text style={styles.title}>{folio.folios[0].equipe.NOM_EQUIPE}</Text>
                                </View>
                                {loadingPvs ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        <ScrollView style={styles.inputs}>

                                                <View style={styles.content}>
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
                                                                                {/* dggdggd */}
                                                                        </Text>
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

                                                        {folio?.folios?.length > 0 ? <View style={styles.selectContainer}>
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
                                                                                        {multiFolios?.length} Scanné{multiFolios.length > 1 && 's'}
                                                                                </Text>
                                                                        </View>
                                                                        <View style={styles.folioList}>
                                                                                {folio?.folios.map((folio, index) => {
                                                                                        return (
                                                                                                <TouchableOpacity style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }} key={index} onPress={() => setSelectedFolio(folio)}>
                                                                                                        <View style={[styles.folio]}>
                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                                <Image source={require("../../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                        </View>
                                                                                                                        <View style={styles.folioDesc}>
                                                                                                                                <Text style={styles.folioName}>{folio?.NUMERO_FOLIO}</Text>
                                                                                                                                <View style={styles.natureCard}>
                                                                                                                                        <Text style={styles.folioSubname}>Folio:{folio?.FOLIO}</Text>
                                                                                                                                        <Text style={styles.folioSubname}>Nature:{folio?.natures.DESCRIPTION}</Text>
                                                                                                                                        {isSelected(folio?.ID_FOLIO) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                                                                                <MaterialIcons name="check-box-outline-blank" size={24} color="#ddd" />}

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

                                                        {check.length > 0 ? <TouchableOpacity onPress={onTakePicha}>
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
                                                        </TouchableOpacity> : null}

                                                </View>
                                        </ScrollView>}
                                {check.length > 0 ? <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitEquipeData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback> : null}

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
                marginHorizontal: 10
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
})
