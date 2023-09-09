import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Ionicons, AntDesign, MaterialIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS"
import moment from 'moment'
import ImageView from "react-native-image-viewing";
import fetchApi from "../../../../helpers/fetchApi";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import Loading from "../../../../components/app/Loading";

/**
 * Screen pour afficher le details de folios lors de retours chez un chef plateau
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 23/8/2023
 * @returns 
 */

export default function FoliosRetourdetailChefPlateauScreen() {
        const route = useRoute()
        const navigation = useNavigation()
        const { details, userTraite } = route.params
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [loadingData, setLoadingData] = useState(false)
        const [galexyIndex, setGalexyIndex] = useState(null)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [pvs, setPvs] = useState(false)
        const [check, setCheck] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)

        const folio_ids = details?.map(folio => folio.folio.ID_FOLIO)

        const isValidAdd = () => {
                var isValid = false
                isValid = document != null && multiFolios.length > 0 ? true : false
                return isValid
        }

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingPvs(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                form.append('AGENT_SUPERVISEUR', userTraite.USERS_ID)
                                const res = await fetchApi(`/scanning/retour/agent/pvs`, {
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
        }, [userTraite]))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCheck(true)
                                const res = await fetchApi(`/scanning/retour/agent/retour/pvs/${userTraite.USERS_ID}`)
                                setCheck(res.result)

                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
                        }
                })()
        }, [userTraite]))

        //Multi select pour selectionner les filios bien renconciliers
        const [multiFolios, setMultiFolios] = useState([]);
        const isSelected = id_folio => multiFolios.find(u => u.folio.ID_FOLIO == id_folio) ? true : false
        const setSelectedFolio = (folio) => {
                if (isSelected(folio.folio.ID_FOLIO)) {
                        const newfolio = multiFolios.filter(u => u.folio.ID_FOLIO != folio.folio.ID_FOLIO)
                        setMultiFolios(newfolio)
                } else {
                        setMultiFolios(u => [...u, folio])
                }

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
                        form.append('ID_FOLIO', JSON.stringify(folio_ids))
                        form.append('folio', JSON.stringify(multiFolios))
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
                        const folioss = await fetchApi(`/scanning/retour/agent/retour/plateau`, {
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
                                        <View style={styles.cardTitle}>
                                                <Text style={styles.title} numberOfLines={2}>{userTraite.NOM} {userTraite.PRENOM}</Text>
                                        </View>
                                </View>
                                <ScrollView>
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
                                                                Pv
                                                        </Text>
                                                        {pvs?.result ?
                                                                <>
                                                                        <TouchableOpacity onPress={() => {
                                                                                setGalexyIndex(0)
                                                                        }}>
                                                                                <Image source={{ uri: pvs?.result?.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                        </TouchableOpacity>
                                                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(pvs.result.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                </> : null}
                                                </View>
                                        </View>
                                        {check.length > 0 ? <View style={styles.selectContainer}>
                                                <View style={{ width: '100%' }}>
                                                        <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Text style={styles.selectedValue}>
                                                                </Text>
                                                                <Text style={styles.selectedValue}>
                                                                        {details.length} pret à être validé{details.length > 1 && 's'}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.contain}>
                                                                {details.map((folio, index) => {
                                                                        return (
                                                                                <TouchableOpacity style={{ marginTop: 10, borderRadius: 80, }} key={index} onPress={() => setSelectedFolio(folio)}>
                                                                                        <View style={[styles.folio]}>
                                                                                                <View style={styles.folioLeftSide}>
                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                <Image source={require("../../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.folioDesc}>
                                                                                                                <Text style={styles.folioName}>{folio?.folio?.NUMERO_FOLIO}</Text>
                                                                                                                <Text style={styles.folioSubname}>{folio?.folio?.NUMERO_FOLIO}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                                {isSelected(folio.folio.ID_FOLIO) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}

                                                                                        </View>
                                                                                </TouchableOpacity>
                                                                        )
                                                                })
                                                                }
                                                        </View>
                                                </View>
                                        </View> : <View style={styles.selectContainer}>
                                                <View style={{ width: '100%' }}>
                                                        <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Text style={styles.selectedValue}>
                                                                </Text>
                                                                <Text style={styles.selectedValue}>
                                                                        {details.length} pret à être validé{details.length > 1 && 's'}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.contain}>
                                                                {details.map((folio, index) => {
                                                                        return (
                                                                                <View style={{ marginTop: 10, borderRadius: 80, }} key={index}>
                                                                                        <View style={[styles.folio]}>
                                                                                                <View style={styles.folioLeftSide}>
                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                <Image source={require("../../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                        </View>
                                                                                                        <View style={styles.folioDesc}>
                                                                                                                <Text style={styles.folioName}>{folio?.folio?.NUMERO_FOLIO}</Text>
                                                                                                                <Text style={styles.folioSubname}>{folio?.folio?.NUMERO_FOLIO}</Text>
                                                                                                        </View>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        )
                                                                })
                                                                }
                                                        </View>
                                                </View>
                                        </View>}
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
                                </ScrollView>
                                {check.length > 0 ? <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitPlateauData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback> : null}
                        </View >
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
                borderRadius: 10,
        },
        contain: {
                flex: 1
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
