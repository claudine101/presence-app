import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { COLORS } from "../../../../styles/COLORS";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useState } from "react";
import Loading from "../../../../components/app/Loading";
import fetchApi from "../../../../helpers/fetchApi";
import moment from 'moment'
import ImageView from "react-native-image-viewing";

/**
 * Screen pour signer le pv entre chef plateau et agent superviseur aille
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 4/8/2023
 * @returns 
 */


export default function ConfimerPvScreen() {
        const navigation = useNavigation()
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const route = useRoute()
        const { detail , userTraite} = route.params
        const [loadingData, setLoadingData] = useState(false)
        const [galexyIndex, setGalexyIndex] = useState(null)
        const [check, setCheck] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)

        const [allVolumes, setAllVolumes] = useState([])
        const [loadingAilleScanning, setLoadingAilleScanning] = useState(false)

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

        const submitAgentSup = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('USER_TRAITEMENT', userTraite.USERS_ID)
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
                        const volume = await fetchApi(`/scanning/retour/agent/${detail.volume.ID_VOLUME}`, {
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
                                if (detail) {
                                        setLoadingAilleScanning(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/details/volume/${detail.volume.ID_VOLUME}`)
                                        setAllVolumes(vol.result)
                                }
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingAilleScanning(false)
                        }
                })()
        }, [detail]))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCheck(true)
                                const res = await fetchApi(`/scanning/retour/agent/retour/pvs/supAilles/${detail.volume.ID_VOLUME}`)
                                setCheck(res.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
                        }
                })()
        }, [detail]))


        return (
                <>
                        {(galexyIndex != null && detail) &&
                                <ImageView
                                        images={[{ uri: detail?.PV_PATH } ? { uri: detail?.PV_PATH } : undefined]}
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
                                        <View style={styles.cardTitle}>
                                                <Text style={styles.title} numberOfLines={2}>{detail?.volume?.NUMERO_VOLUME}</Text>
                                        </View>
                                </View>

                                <ScrollView>
                                        <View style={styles.selectContainer}>
                                                <View style={{ width: '100%' }}>
                                                        <View style={styles.labelContainer}>
                                                                <View style={styles.icon}>
                                                                        <Feather name="user" size={20} color="#777" />
                                                                </View>
                                                                <Text style={styles.selectLabel}>
                                                                        Chef du plateau
                                                                </Text>
                                                        </View>
                                                        <Text style={styles.selectedValue}>
                                                                {detail?.traitant?.NOM} {detail?.traitant?.PRENOM}
                                                        </Text>
                                                        {detail ?
                                                                <>
                                                                        <TouchableOpacity onPress={() => {
                                                                                setGalexyIndex(0)
                                                                        }}
                                                                        >
                                                                                <Image source={{ uri: detail?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                        </TouchableOpacity>
                                                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(detail?.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                </> : null}
                                                </View>
                                        </View>
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
                                                                                        {allVolumes?.foliosValid?.length}validé{allVolumes?.foliosValid?.length>0 ? "s":""}
                                                                                </Text>
                                                                        </View>
                                                                        <View style={styles.folioList}>
                                                                                {allVolumes?.foliosValid?.map((folio, index) => {
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
                                                                                                                <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                                                        </View>
                                                                                                </TouchableOpacity>
                                                                                        )
                                                                                })}
                                                                        </View>
                                                                </View>
                                                        </View> : null
                                        }
                                        {loadingAilleScanning ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumes?.foliosNonValid?.length > 0 ?
                                                        <View style={styles.selectContainer}>
                                                                <View style={{ width: '100%' }}>
                                                                        <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                <Text style={styles.selectedValue}>
                                                                                </Text>
                                                                                <Text style={styles.selectedValue}>
                                                                                {allVolumes?.foliosNonValid?.length}non validé{allVolumes?.foliosValid?.length>0 ? "s":""}
                                                                                </Text>
                                                                        </View>
                                                                        <View style={styles.folioList}>
                                                                                {allVolumes?.foliosNonValid?.map((folio, index) => {
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
                                                                                                                <MaterialIcons name="cancel-presentation" size={24} color="red" />
                                                                                                        </View>
                                                                                                </TouchableOpacity>
                                                                                        )
                                                                                })}
                                                                        </View>
                                                                </View>
                                                        </View> : null}
                                        {loadingAilleScanning ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                </View> :
                                                        allVolumes?.foliosNoScanReconcilier?.length > 0 ?
                                                                <View style={styles.selectContainer}>
                                                                        <View style={{ width: '100%' }}>
                                                                                <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                        <Text style={styles.selectedValue}>
                                                                                        </Text>
                                                                                        <Text style={styles.selectedValue}>
                                                                                {allVolumes?.foliosNonValid?.length}non scanné{allVolumes?.foliosValid?.length>0 ? "s":""}
                                                                                        </Text>
                                                                                </View>
                                                                                <View style={styles.folioList}>
                                                                                        {allVolumes?.foliosNoScanReconcilier?.map((folio, index) => {
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
                                                                                                                        <MaterialIcons name="cancel-presentation" size={24} color="red" />
                                                                                                                </View>
                                                                                                        </TouchableOpacity>
                                                                                                )
                                                                                        })}
                                                                                </View>
                                                                        </View>
                                                                </View> : null}
                                        {check.length ==detail.folios.length ? <TouchableOpacity onPress={onTakePicha}>
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
                                        </TouchableOpacity>:null}
                                </ScrollView>
                                {check.length == detail.folios.length ? <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitAgentSup}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>:null}
                        </View>
                </>
        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff'
        }, header: {
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
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center',
        },
        selectLabel: {
                marginLeft: 5,
                fontWeight: "bold"
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