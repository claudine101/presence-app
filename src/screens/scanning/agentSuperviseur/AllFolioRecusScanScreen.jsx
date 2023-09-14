import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { COLORS } from "../../../styles/COLORS";
<<<<<<< HEAD
import { AntDesign, Ionicons } from '@expo/vector-icons';
=======
import { AntDesign, Fontisto } from '@expo/vector-icons';
>>>>>>> 21141350a80a70ba8978a9898b672706b8f8f086
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchApi from "../../../helpers/fetchApi";
import moment from 'moment'
import PROFILS from "../../../constants/PROFILS"
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/selectors/userSelector";
import AppHeaderChefPlateauRetour from "../../../components/app/AppHeaderChefPlateauRetour";

/**
 * Screen pour afficher les folios d'un agent superviseur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 2/8/2023
 * @returns 
 */

export default function AllFolioRecusScanScreen() {
        const navigation = useNavigation()
        const [allFolios, setAllFolios] = useState([])
        const [loading, setLoading] = useState(false)

        const handleSubmit = (folio) => {
<<<<<<< HEAD
                navigation.navigate("NewEquipeScanScreen", { folio: folio, fol: folio.folios })
=======
                navigation.navigate("NewEquipeScanScreen", { folio: folio, fol:folio.folios })
>>>>>>> 21141350a80a70ba8978a9898b672706b8f8f086
        }

        //fonction pour recuperer les folios d'un agent qui est connecter
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const fol = await fetchApi(`/scanning/retour/agent/foliosRecus`)
                                setAllFolios(fol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))
        return (
                <>
                        <AppHeaderChefPlateauRetour />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
<<<<<<< HEAD
                                </View> : allFolios.length <= 0 ?
                                        <View style={styles.emptyContainer}>
                                                <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                                                <Text style={styles.emptyLabel}>Aucun dossier trouvé</Text>
                                        </View>
                                        :
                                        <FlatList
                                                style={styles.contain}
                                                data={allFolios}
                                                renderItem={({ item: volume, index }) => {
                                                        return (
                                                                <>
                                                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                        </View> :

                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                        onPress={() => handleSubmit(volume)}
                                                                                >
                                                                                        <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                <View style={styles.folio}>
                                                                                                        <View style={styles.folioLeftSide}>
                                                                                                                <View style={styles.folioImageContainer}>
                                                                                                                        <Image source={require("../../../../assets/images/dossierDetail.png")} style={styles.folioImage} />
                                                                                                                </View>
                                                                                                                <View style={styles.folioDesc}>
                                                                                                                        <Text style={styles.folioName}>{volume?.volume?.NUMERO_VOLUME}</Text>
                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                        <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                {moment(volume?.date).format('DD/MM/YYYY HH:mm')}
                                                                                                                                        </Text>
                                                                                                                                </View>
                                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                        <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                {volume?.folios?.length ? volume?.folios?.length : "0"} dossier{volume?.folios?.length > 1 && 's'}
                                                                                                                                        </Text>
                                                                                                                                </View>
=======
                                </View> :
                                        allFolios.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun folio trouvés
                                                </Text>
                                                {/* <Text style={styles.emptyDesc}>
                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
                                                </Text> */}
                                        </View> :
                                                <FlatList
                                                        style={styles.contain}
                                                        data={allFolios}
                                                        renderItem={({ item: folio, index }) => {
                                                                return (
                                                                        <>
                                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> :

                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={()=>handleSubmit(folio)}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.cardImages}>
                                                                                                                <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                        </View>
                                                                                                        <View style={styles.cardAllDetails}>
                                                                                                                <View>
                                                                                                                        <Text style={styles.titlePrincipal}>{folio.volume.NUMERO_VOLUME}</Text>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <Fontisto name="date" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio.volume.DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                <View>
                                                                                                                        <View ><Text></Text></View>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio.folios.length} dossiers</Text></View>

>>>>>>> 21141350a80a70ba8978a9898b672706b8f8f086
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </View>
<<<<<<< HEAD
                                                                                        </View>

                                                                                </TouchableNativeFeedback>
                                                                        }
                                                                </>
                                                        )
                                                }}
                                                keyExtractor={(volume, index) => index.toString()}
                                        />}
=======
                                                                                        </TouchableNativeFeedback>
                                                                                }
                                                                        </>
                                                                )
                                                        }}
                                                        keyExtractor={(volume, index) => index.toString()}
                                                />}
>>>>>>> 21141350a80a70ba8978a9898b672706b8f8f086
                        </View>
                </>
        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
        },
        actionIcon: {
                width: 45,
                height: 45,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
        },
        actionLabel: {
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 5,
                marginRight: 10,
                fontWeight: 'bold',
        },
        action: {
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center'
        },
        emptyContaier: {
                // flex: 1,
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
        cardDetails: {
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#FFF',
                padding: 10,
                overflow: 'hidden',
                marginHorizontal: 10,
                flexDirection:"row"
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
                color: "#777"
        },
        cardDescDetails: {
                flexDirection: "row",
                marginTop:8
        },
        cardAllDetails:{
                flexDirection:"row",
                alignItems:"center",
                justifyContent:"space-between",
                flex:1,
                marginLeft:8
        },
<<<<<<< HEAD

        folio: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                padding: 10,
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
        folioName: {
                fontWeight: 'bold',
                color: '#333',
        },
        folioSubname: {
                color: '#777',
                fontSize: 12
        },
        amountChanger: {
                width: 50,
                height: 50,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 1,
                position: "absolute",
                left: "80%",
                bottom: 0,
                marginBottom: 10

        },
        amountChangerText: {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 20
        },
        emptyContainer: {
                flex: 1,
=======
        emptyContaier: {
                flex:1,
>>>>>>> 21141350a80a70ba8978a9898b672706b8f8f086
                justifyContent: 'center',
                alignItems: 'center'
        },
        emptyImage: {
                width: 100,
                height: 100,
                opacity: 0.8
        },
        emptyLabel: {
                fontWeight: 'bold',
                marginTop: 20,
                color: '#777',
                fontSize: 16
        },
})