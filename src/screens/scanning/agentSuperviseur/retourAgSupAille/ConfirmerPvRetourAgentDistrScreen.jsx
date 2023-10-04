import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { COLORS } from "../../../../styles/COLORS";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, EvilIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useState } from "react";
import Loading from "../../../../components/app/Loading";
import fetchApi from "../../../../helpers/fetchApi";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../../hooks/useFetch";

/**
 * Screen pour voir le details de volumes retourner chez un chef plateau
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 4/8/2023
 * @returns 
 */

export default function ConfirmerPvRetourAgentDistrScreen() {
        const route = useRoute()
        const navigation = useNavigation()
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const { volume, id } = route.params
        const [loadingData, setLoadingData] = useState(false)
        const [allVolumes, setAllVolumes] = useState([])
        const [loadingAilleScanning, setLoadingAilleScanning] = useState(false)
        const [checkIsvalid, setCheckIsvalid] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)
        const [check, setCheck] = useState([])


        const modelRef = useRef(null)
        const choixAction = async (allVolumes) => {
                setCheckIsvalid(allVolumes)
                modelRef.current.open()
        }
        const choixArchives = (volume) => {
                navigation.navigate("ChoixAgentDistributeurRetourScreen", { volume: volume })
                // modelRef.current.close()
        }
        const choixRetourScanning = (volume) => {
                navigation.navigate("RetourPhaseScanningVolumeScreen", { volume: volume })
                // modelRef.current.close()
        }

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                if (volume) {
                                        setLoadingAilleScanning(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/details/chefEquiScan/${volume.ID_VOLUME}`)
                                        setAllVolumes(vol.result)
                                }
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingAilleScanning(false)
                        }
                })()
        }, [volume]))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                if (volume) {
                                        setLoadingCheck(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/details/verifier/volume/dossier/valid/${volume.ID_VOLUME}`)
                                        setCheck(vol)
                                }
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingCheck(false)
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
                                                <Text style={styles.title} numberOfLines={2}>Details du volume</Text>
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
                                                                                        {allVolumes?.foliosValid?.length}validé{allVolumes?.foliosValid?.length > 0 ? "s" : ""}
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
                                                                                                                                <View style={styles.cardNature}>
                                                                                                                                        <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                                                                                        <Text style={styles.folioSubname}>Nature:{folio.natures.DESCRIPTION}</Text>
                                                                                                                                        <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                </View>
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
                                                                                        {allVolumes?.foliosNonValid?.length}non validé{allVolumes?.foliosNonValid?.length > 0 ? "s" : ""}
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
                                                                                                                                <View style={styles.cardNature}>
                                                                                                                                        <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                                                                                        <Text style={styles.folioSubname}>Nature:{folio.natures.DESCRIPTION}</Text>
                                                                                                                                        <MaterialIcons name="cancel-presentation" size={24} color="red" />
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
                                                                                        {allVolumes?.foliosNoScanReconcilier?.length}non scanné{allVolumes?.foliosNoScanReconcilier?.length > 0 ? "s" : ""}
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
                                                                                                                                <View style={styles.cardNature}>
                                                                                                                                        <Text style={styles.folioSubname}>Folio:{folio.FOLIO}</Text>
                                                                                                                                        <Text style={styles.folioSubname}>Nature:{folio.natures.DESCRIPTION}</Text>
                                                                                                                                        <MaterialIcons name="cancel-presentation" size={24} color="red" />
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
                                </ScrollView>
                                {allVolumes?.foliosNonValid?.length > 0 ? <TouchableWithoutFeedback
                                        onPress={() => choixRetourScanning(volume)}
                                >
                                        <View style={styles.button}>
                                                <Text style={styles.buttonText}>Retour phase scanning</Text>
                                        </View>
                                </TouchableWithoutFeedback> : null}
                                {(check?.check?.length == volume?.NOMBRE_DOSSIER) ?

                                        <TouchableWithoutFeedback
                                                onPress={() => choixArchives(volume)}
                                        >
                                                <View style={styles.button}>
                                                        <Text style={styles.buttonText}>Archiver</Text>
                                                </View>
                                        </TouchableWithoutFeedback>
                                        : null}
                        </View>
                        <Portal>
                                <Modalize ref={modelRef}
                                        handlePosition="inside"
                                        adjustToContentHeight
                                        modalStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                                        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                                >
                                        <View style={styles.modalContent}>
                                                {(check?.check?.length == volume?.NOMBRE_DOSSIER) ? <>
                                                        <TouchableNativeFeedback
                                                                onPress={() => choixArchives(volume)}
                                                        >
                                                                <View style={[styles.modalItem, { marginTop: 10 }]}>
                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                        <Text style={styles.modalItemTitle}>
                                                                                Archives
                                                                        </Text>
                                                                </View>
                                                        </TouchableNativeFeedback>
                                                        <View style={styles.separator} />
                                                </> : null}

                                                {allVolumes?.foliosNonValid?.length > 0 ? <>
                                                        <TouchableNativeFeedback
                                                                onPress={() => choixRetourScanning(volume)}
                                                        >
                                                                <View style={styles.modalItem}>
                                                                        <AntDesign name="back" size={24} color="black" />
                                                                        <Text style={styles.modalItemTitle}>
                                                                                Retour phase scanning
                                                                        </Text>
                                                                </View>
                                                        </TouchableNativeFeedback>
                                                        <View style={styles.separator} />
                                                </> : null}
                                        </View>
                                </Modalize>
                        </Portal>
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
                marginHorizontal: 10,
                marginBottom:5
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
                marginLeft: 10,
                flex: 1
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
        folioList: {
        },
        modalItem: {
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 20
        },
        modalItemTitle: {
                marginLeft: 10,
                fontWeight: "bold"
        },
        separator: {
                height: 1,
                width: "100%",
                backgroundColor: '#F1F1F1'
        },
})