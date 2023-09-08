import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import moment from 'moment'
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import IDS_ETAPES_FOLIO from "../../../../constants/IDS_ETAPES_FOLIO"
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import fetchApi from "../../../../helpers/fetchApi";
import Loading from "../../../../components/app/Loading";
import PROFILS from "../../../../constants/PROFILS";
import ImageView from "react-native-image-viewing";
import { useRef } from "react";
import { useCallback } from "react";

/**
 * Screen pour afficher les details de volumes deja traites par un agent aile scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 28/8/2023
 * @returns 
 */

export default function DetailsSupAilleScanTraiteVolumeScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { volume, PV_PATH, date, userTraite } = route.params
        const [galexyIndex, setGalexyIndex] = useState(null)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [pvs, setPvs] = useState(null)
        const volume_ids = volume?.map(vol => vol.ID_VOLUME)

        const [allVolumes, setAllVolumes] = useState([])
        const [loadingAilleScanning, setLoadingAilleScanning] = useState(false)

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingPvs(true)
                                const form = new FormData()
                                form.append('volume_ids', JSON.stringify(volume_ids))
                                form.append('AGENT_SUPERVISEUR', userTraite.USERS_ID)
                                const res = await fetchApi(`/scanning/retour/agent/chefPlateau/retour/pvs/supAille/pvs`, {
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
                                if (volume) {
                                        setLoadingAilleScanning(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/details/traites/${volume[0].ID_VOLUME}`)
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
                        {(galexyIndex != null && PV_PATH && pvs?.result) &&
                                <ImageView
                                        images={[{ uri: pvs?.result.PV_PATH }, date ? { uri: PV_PATH } : undefined]}
                                        imageIndex={galexyIndex}
                                        visible={(galexyIndex != null) ? true : false}
                                        onRequestClose={() => setGalexyIndex(null)}
                                        swipeToCloseEnabled
                                        keyExtractor={(_, index) => index.toString()}
                                />
                        }
                        <View style={styles.container}>
                                <View style={styles.header}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.headerBtn}>
                                                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <Text style={styles.title}>{volume[0]?.NUMERO_VOLUME}</Text>
                                </View>
                                <ScrollView style={styles.inputs}>
                                        <TouchableOpacity style={styles.selectContainer1}>
                                                <View style={styles.labelContainer1}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel1}>
                                                                Nombre de dossiers
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue1}>
                                                        {volume[0]?.NOMBRE_DOSSIER}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer1}>
                                                <View style={styles.labelContainer1}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel1}>
                                                                Malle
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue1}>
                                                        {volume[0]?.maille?.NUMERO_MAILLE}
                                                </Text>
                                        </TouchableOpacity>
                                        <View style={styles.selectContainer}>
                                                <View style={{ width: '100%' }}>
                                                        <View style={styles.labelContainer}>
                                                                <View style={styles.icon}>
                                                                        <Feather name="user" size={20} color="#777" />
                                                                </View>
                                                                <Text style={styles.selectLabel}>
                                                                        Chef plateau
                                                                </Text>
                                                        </View>
                                                        <Text style={styles.selectedValue}>
                                                                {userTraite?.NOM} {userTraite?.PRENOM}
                                                        </Text>
                                                        <View style={{ width: '100%' }}>
                                                                {PV_PATH ?
                                                                        <>
                                                                                <TouchableOpacity onPress={() => {
                                                                                        setGalexyIndex(0)
                                                                                }}>
                                                                                        <Image source={{ uri: PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                </TouchableOpacity>
                                                                                <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(date).format("DD/MM/YYYY [à] HH:mm")}</Text>
                                                                        </> : null}
                                                        </View>
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
                                                                                        Les dossiers non validés
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
                                                                                        Les dossiers non scannés
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
                                                                PV de retour
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

                                </ScrollView>
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
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
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
                justifyContent: 'space-between',
                marginHorizontal: 10
        },
        selectedValue: {
                color: '#777',
                marginTop: 2
        },

        cardDetails: {
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#777',
                padding: 10,
                overflow: 'hidden',
                marginHorizontal: 10,
                flexDirection: "row"
        },
        cardImages: {
                backgroundColor: '#ddd',
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center'
        },
        imageIcon: {
                width: 25,
                height: 25
        },
        titeName: {
                color: "#fff"
        },
        cardDescDetails: {
                flexDirection: "row",
                marginTop: 8
        },
        cardAllDetails: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                marginLeft: 8
        },
        titlePrincipal: {
                fontWeight: "bold",
                color: "#fff"
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        emptyContaier: {
                justifyContent: 'center',
                alignItems: 'center'
        },
        emptyImage: {
                width: 100,
                height: 100,
                resizeMode: 'contain'
        },
        emptyTitle: {
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#333',
                marginVertical: 10,
                fontSize: 15
        },
        emptyDesc: {
                color: '#777',
                textAlign: 'center',
                maxWidth: 300,
                lineHeight: 20
        },
        selectContainer1: {
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#ddd",
                marginVertical: 5,
                marginHorizontal: 10
        },
        selectedValue1: {
                color: '#777',
                marginTop: 2
        },
        labelContainer1: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel1: {
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
