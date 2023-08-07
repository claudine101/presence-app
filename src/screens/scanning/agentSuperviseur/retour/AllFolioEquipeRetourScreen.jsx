import React, { useCallback, useState } from "react";
import AppHeaderPhPreparationRetour from "../../../../components/app/AppHeaderPhPreparationRetour";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../styles/COLORS"
import fetchApi from "../../../../helpers/fetchApi";
import PROFILS from "../../../../constants/PROFILS";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../store/selectors/userSelector";


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
        const handleSubmit = (folio) => {
                if(user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING){
                        navigation.navigate("DetailsFolioRetourChefPlateau", {folio: folio.folios, ID_ETAPE_FOLIO: folio.folios[0].folio.ID_ETAPE_FOLIO})
                }else{
                        navigation.navigate("DetailsFolioRetourScreen", { folio: folio, ID_ETAPE_FOLIO: folio.folios[0].ID_ETAPE_FOLIO, ID_EQUIPE: folio.folios[0].folio.equipe.ID_EQUIPE })
                }
        }

        //fonction pour recuperer les folios d'un agent qui est connecter
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const fol = await fetchApi(`/scanning/volume/equipeScanning`)
                                setAllFolios(fol.UserFolios)
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
                                setLoading(true)
                                const fol = await fetchApi(`/scanning/volume/retour/plateau`)
                                setAllFoliosRetour(fol.UserFolios)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))
        return (
                <>
                        {(user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) ?
                                <>
                                        <AppHeaderPhPreparationRetour />
                                        <View style={styles.container}>
                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                </View> :
                                                        allFoliosRetour.length == 0 ? <View style={styles.emptyContaier}>
                                                                <Image source={require('../../../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                                <Text style={styles.emptyTitle}>
                                                                        Aucun folio trouvé
                                                                </Text>
                                                                <Text style={styles.emptyDesc}>
                                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
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
                                                                                                </View> :
                                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                                onPress={() => handleSubmit(folio)}
                                                                                                        >
                                                                                                                <View style={styles.cardDetails}>
                                                                                                                        <View style={styles.carddetailItem}>
                                                                                                                                <View style={styles.cardImages}>
                                                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                                                </View>
                                                                                                                                <View style={styles.cardDescription}>
                                                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                                                <View>
                                                                                                                                                        <Text style={styles.itemVolume}>{folio.folios[0].traitement.NOM} {folio.folios[0].traitement.PRENOM}</Text>
                                                                                                                                                        <Text>{folio.folios.length}</Text>
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
                                </> : <>
                                        <AppHeaderPhPreparationRetour />
                                        <View style={styles.container}>
                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                </View> :
                                                        allFolios.length == 0 ? <View style={styles.emptyContaier}>
                                                                <Image source={require('../../../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                                <Text style={styles.emptyTitle}>
                                                                        Aucun folio trouvé
                                                                </Text>
                                                                <Text style={styles.emptyDesc}>
                                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
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
                                                                                                                <View style={styles.cardDetails}>
                                                                                                                        <View style={styles.carddetailItem}>
                                                                                                                                <View style={styles.cardImages}>
                                                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                                                </View>
                                                                                                                                <View style={styles.cardDescription}>
                                                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                                                <View>
                                                                                                                                                        <Text style={styles.itemVolume}>{folio.folios[0].folio.equipe.NOM_EQUIPE}</Text>
                                                                                                                                                        <Text>{folio.folios.length}</Text>
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
                                </>}
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
})