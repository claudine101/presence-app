import React, { useCallback, useState } from "react";
import AppHeaderPhPreparationRetour from "../../../../components/app/AppHeaderPhPreparationRetour";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../styles/COLORS"
import fetchApi from "../../../../helpers/fetchApi";
import moment from 'moment'

/**
 * Screen pour afficher les folios non scanner et non reconcilier
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 30/8/2023
 * @returns 
 */

export default function FoliosNonScanNonReconcilierScreen() {
        const navigation = useNavigation()
        const [allFolios, setAllFolios] = useState([])
        const [loading, setLoading] = useState(false)
        const handleSubmit = (folio) => {
                navigation.navigate("DetailsEquipeFoliosNonReconcilierScreen", { folio: folio, userTraite: folio?.users, PV_PATH: folio?.PV_PATH, date: folio.date })
        }

        //fonction pour recuperer les folios d'un agent qui est connecter
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const fol = await fetchApi(`/scanning/volume/allFoliosScanning/nonReconcilier`)
                                setAllFolios(fol.PvFolios)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))
        return (
                <>
                        <AppHeaderPhPreparationRetour />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allFolios.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun folio trouvé
                                                </Text>
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
                                                                                        folio?.folios[0]?.equipe.NOM_EQUIPE != null ?
                                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                        onPress={() => handleSubmit(folio)}
                                                                                                >
                                                                                                        <View style={styles.cardDetails}>
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.folios[0]?.equipe.NOM_EQUIPE}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.date).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio.folios.length} dossiers</Text></View>

                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </TouchableNativeFeedback> :

                                                                                                <View style={styles.emptyContaier}>
                                                                                                        <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                                                                        <Text style={styles.emptyTitle}>
                                                                                                                Aucun folio trouvé
                                                                                                        </Text>
                                                                                                </View>
                                                                                }
                                                                        </>
                                                                )
                                                        }}
                                                        keyExtractor={(folio, index) => index.toString()}
                                                />}
                        </View>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
        },
        cardDetails: {
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#fff',
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
                color: "#777"
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
                fontWeight: "bold"
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        emptyContaier: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:"8%"
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
})