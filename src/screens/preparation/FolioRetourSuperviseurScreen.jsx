import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, FlatList, TouchableWithoutFeedback, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'
import { Ionicons, MaterialIcons, FontAwesome5, Fontisto } from '@expo/vector-icons';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import Loading from "../../components/app/Loading";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import ImageView from "react-native-image-viewing";
import { ScrollView } from "react-native-gesture-handler";


/**
 * Screen pour afficher le details de folio avec leur nature  
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 02/8/2023
 * @returns 
 */

export default function FolioRetourSuperviseurScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { folio } = route.params
        const [loading, setLoading] = useState(false)
        const [loadingSubmit, setLoadingSubmit] = useState(false)
        const [document, setDocument] = useState(null)
        const [nbre, setNbre] = useState(null)
        const [check, setCheck] = useState([])
        const [checkDetails, setDetails] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [pvs, setPvs] = useState(false)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [galexyIndex, setGalexyIndex] = useState(null)
        const [data, handleChange, setValue] = useForm({
                motif: null,
        })

        const folio_ids = folio?.folios?.map(folio => folio.ID_FOLIO)
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingPvs(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                form.append('AGENT_SUPERVISEUR', folio.users.USERS_ID)
                                const res = await fetchApi(`/preparation/folio/getPvRetourne`, {
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
        }, [folio.folios]))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCheck(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                form.append('USERS_ID', folio.users.USERS_ID)
                                const res = await fetchApi(`/preparation/folio/checkAgentsup`, {
                                        method: "POST",
                                        body: form
                                })
                                setCheck(res.result)

                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
                        }
                })()
        }, [folio.users]))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingCheck(true)
                                const form = new FormData()
                                form.append('folioIds', JSON.stringify(folio_ids))
                                form.append('USERS_ID', folio.users.USERS_ID)
                                const res = await fetchApi(`/preparation/folio/checkAgentsupDetails`, {
                                        method: "POST",
                                        body: form
                                })
                                setDetails(res.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
                        }
                })()
        }, [folio.users]))
        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                // document: {
                //         required: true
                // },
        }, {
                // document: {
                //         required: 'ce champ est obligatoire',
                // },
        })
        const isValidAdd = () => {
                var existMotif = false
                var isValidMotif = false

                existMotif = !(folio?.folios?.length == nbre) ? true : false
                existMotif && (isValidMotif = data.motif != null ? true : false)

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
                        form.append('folio', JSON.stringify(folio?.folios))
                        form.append('motif', data.motif)
                        form.append('AGENT_SUPERVISEUR', folio.users.USERS_ID)
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
                        const res = await fetchApi(`/preparation/folio/retourAgentSuperviseur`, {
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
                <>{(galexyIndex != null && pvs?.result && pvs?.result) &&
                        <ImageView
                                images={[{ uri: pvs?.result.PV_PATH }, pvs?.result?.retour ? { uri: pvs?.result?.retour.PV_PATH } : undefined]}
                                imageIndex={galexyIndex}
                                visible={(galexyIndex != null) ? true : false}
                                onRequestClose={() => setGalexyIndex(null)}
                                swipeToCloseEnabled
                                keyExtractor={(_, index) => index.toString()}
                        />
                }

                        {(loadingSubmit || loadingCheck) && <Loading />}
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
                                <View style={styles.selectContainer}>
                                                <View style={{ width: '100%' }}>
                                                        {loadingPvs ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <ActivityIndicator animating size={'small'} color={'#777'} />
                                                                <Text style={[styles.selectedValue, { marginLeft: 5 }]}>
                                                                        Chargement
                                                                </Text>
                                                        </View> : null}
                                                        <Text style={styles.selectedValue}>
                                                                {pvs?.result?.traitement?.NOM} {pvs?.result?.traitement?.PRENOM}
                                                        </Text>
                                                        {pvs.result ?
                                                                <>
                                                                        <TouchableOpacity onPress={() => {
                                                                                setGalexyIndex(0)
                                                                        }}>
                                                                                <Image source={{ uri: pvs.result.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                        </TouchableOpacity>
                                                                        <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(pvs.result.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                </> : null}
                                                </View>
                                        </View>
                                        <View style={styles.selectContainer}>
                                                <View style={styles.contain}>
                                                        {folio?.folios.map((folio, index) => {
                                                                return (
                                                                        <View style={{ marginTop: 10, borderRadius: 80, }} key={index}>
                                                                                <View style={[styles.folio]}>
                                                                                        <View style={styles.folioLeftSide}>
                                                                                                <View style={styles.folioImageContainer}>
                                                                                                        <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                </View>
                                                                                                <View style={styles.folioDesc}>
                                                                                                        <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                                                                                        <View style={styles.cardNature}>
                                                                                                                <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                                                                <Text style={styles.folioSubname}>Nature:{folio.natures.DESCRIPTION}</Text>
                                                                                                                {
                                                                                                                        !(check.length > 0) ?
                                                                                                                                <Fontisto name="checkbox-passive" size={21} color="#ddd" /> :
                                                                                                                                folio.IS_PREPARE == 0 ?
                                                                                                                                        <MaterialIcons style={styles.checkIndicator} name="cancel" size={24} color="red" />
                                                                                                                                        : <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                                                                }

                                                                                                        </View>
                                                                                                </View>

                                                                                        </View>

                                                                                </View>
                                                                        </View>
                                                                )
                                                        })
                                                        }
                                                </View>
                                        </View>
                                       

                                        {check.length > 0 && !checkDetails.length > 0 ?
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
                                                </TouchableOpacity> : null}
                                </ScrollView>
                                {check.length > 0 && !checkDetails.length > 0 ?
                                        <TouchableWithoutFeedback
                                                disabled={!isValidAdd()}
                                                onPress={submitData}
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
                marginLeft: 10,
                flex:1
        },
        cardNature: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
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