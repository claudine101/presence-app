import React, { useCallback, useState } from "react";
import AppHeaderPhPreparationRetour from "../../../../components/app/AppHeaderPhPreparationRetour";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../styles/COLORS"
import fetchApi from "../../../../helpers/fetchApi";
import PROFILS from "../../../../constants/PROFILS";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../store/selectors/userSelector";
import moment from 'moment'


/**
 * Screen pour afficher les folios retourner par une equipe a un agent superviseur scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 3/8/2023
 * @returns 
 */

export default function AllFolioEquipeRetourScreen() {
        const navigation = useNavigation()
        const user = useSelector(userSelector)
        const [allFolios, setAllFolios] = useState([])
        const [allFoliosRetour, setAllFoliosRetour] = useState([])
        const [loading, setLoading] = useState(false)
        const [loadingRetour, setLoadingRetour] = useState(false)
        const handleSubmit = (folio) => {
                
                if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                        navigation.navigate("FoliosRetourdetailChefPlateauScreen", { details: folio?.folios, userTraite: folio?.users })
                } else {
                        navigation.navigate("DetailsFolioRetourScreen", { folio: folio, userTraite: folio?.users, ID_ETAPE_FOLIO: folio.folios[0].ID_ETAPE_FOLIO, ID_EQUIPE:folio.folios[0].equipe.ID_EQUIPE })
                }
        }

        //fonction pour recuperer les folios d'un agent qui est connecter
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const fol = await fetchApi(`/scanning/volume/equipeScanning`)
                                setAllFolios(fol.PvFolios)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))

        // fonction pour recuperer les folios d'un agent qui est connecter
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingRetour(true)
                                const fol = await fetchApi(`/scanning/volume/retour/plateau`)
                                setAllFoliosRetour(fol.PvFolios)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingRetour(false)
                        }
                })()
        }, []))
        return (
                <>
                        {(user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) ?
                                <>
                                        <AppHeaderPhPreparationRetour />
                                        <View style={styles.container}>
                                                {loadingRetour ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                </View> :
                                                        allFoliosRetour.length == 0 ? <View style={styles.emptyContaier}>
                                                                <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                                <Text style={styles.emptyTitle}>
                                                                        Aucun folio trouvé
                                                                </Text>
                                                        </View> :
                                                                <FlatList
                                                                        style={styles.contain}
                                                                        data={allFoliosRetour}
                                                                        renderItem={({ item: folio, index }) => {
                                                                                return (
                                                                                        <>
                                                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                                </View> : folio.users ?
                                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                                onPress={() => handleSubmit(folio)}
                                                                                                        >
                                                                                                                <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                                        <View style={styles.folio}>
                                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                                        <View style={styles.folioImageContainer}>

                                                                                                                                                <Image source={require('../../../../../assets/images/user.png')} style={styles.image} />
                                                                                                                                        </View>
                                                                                                                                        <View style={styles.folioDesc}>
                                                                                                                                                <Text style={styles.folioName}>{folio.users?.NOM} {folio.users?.PRENOM}</Text>
                                                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                                <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                        {moment(folio?.date).format('DD/MM/YYYY HH:mm')}
                                                                                                                                                                </Text>
                                                                                                                                                        </View>
                                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                                <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                        {folio.folios?.length ? folio.folios?.length : "0"} dossier{folio.folios?.length > 1 && 's'}
                                                                                                                                                                </Text>
                                                                                                                                                        </View>
                                                                                                                                                </View>
                                                                                                                                        </View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </TouchableNativeFeedback> : null
                                                                                                }
                                                                                        </>
                                                                                )
                                                                        }}
                                                                        keyExtractor={(folio, index) => index.toString()}
                                                                />
                                                }
                                        </View>
                                </> :
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

                                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                                onPress={() => handleSubmit(folio)}
                                                                                                        >
                                                                                                                <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                                        <View style={styles.folio}>
                                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                                                {folio.users?.PHOTO_USER ? <Image source={{ uri: folio.users?.PHOTO_USER }} style={styles.folioImageContainer} /> :
                                                                                                                                                        <Image source={require('../../../../../assets/images/user.png')} style={styles.folioImageContainer} />}
                                                                                                                                        </View>
                                                                                                                                        <View style={styles.folioDesc}>
                                                                                                                                                <Text style={styles.folioName}>{folio.folios[0].equipe.NOM_EQUIPE}</Text>
                                                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                                <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                        {moment(folio.date).format('DD/MM/YYYY HH:mm')}
                                                                                                                                                                </Text>
                                                                                                                                                        </View>
                                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                                <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                        {folio.folios.length ? folio.folios?.length : "0"}dossier{folio.folios?.length > 1 && 's'}
                                                                                                                                                                </Text>
                                                                                                                                                        </View>
                                                                                                                                                </View>
                                                                                                                                        </View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </TouchableNativeFeedback>
                                                                                                }
                                                                                        </>
                                                                                )
                                                                        }}
                                                                        keyExtractor={(folio, index) => index.toString()}
                                                                />}
                                        </View>
                                </>
                                }
                </>

        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
        },
        image: {
                width: "100%",
                height: "100%",
                borderRadius: 10,
                resizeMode: "cover"
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
        contain: {
        },
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
        emptyContainer: {
                flex: 1,
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