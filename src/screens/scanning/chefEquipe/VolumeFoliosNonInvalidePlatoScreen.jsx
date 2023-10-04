import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { COLORS } from "../../../styles/COLORS";
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchApi from "../../../helpers/fetchApi";
import moment from 'moment'
import PROFILS from "../../../constants/PROFILS"
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/selectors/userSelector";


/**
 * Screen pour afficher les volumes avec les folios non invalide
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 30/8/2023
 * @returns 
 */

export default function VolumeFoliosNonInvalidePlatoScreen() {
        const [allVolumes, setAllVolumes] = useState([])
        const [loading, setLoading] = useState(false)
        const navigation = useNavigation()
        const [allVolumesChefPlateau, setAllVolumesChefPlateau] = useState([])
        const [allVolumesSuperviseur, setAllVolumesSuperviseur] = useState([])
        const user = useSelector(userSelector)

        const handleSubmit = (volume) => {
                if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                        navigation.navigate("DetailsVolumeChefPlateauNonValideScreen", { folio: volume, userTraite: volume?.users, PV_PATH: volume?.PV_PATH, date: volume.date })
                }else if(user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_SCANNING){
                        navigation.navigate("DetailsFoliosRetourSupScanNonValidScreen", { folio: volume, userTraite: volume?.users, PV_PATH: volume?.PV_PATH, date: volume.date })
                }
        }

        //fonction pour recuperer les volumes associer a un chef d'equipe
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/traitees/plateau/nonvalide`)
                                        setAllVolumesChefPlateau(vol.PvFolios)
                                }else if(user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_SCANNING){
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/plateau/retour/nonvalide`)
                                        setAllVolumesSuperviseur(vol.PvFolios)
                                }
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, [user, PROFILS]))
        return (
                <>
                        <AppHeader />
                        {user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING ?
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesChefPlateau.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun volume trouvé
                                                        </Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesChefPlateau}
                                                                renderItem={({ item: volume, index }) => {
                                                                        return (
                                                                                <>
                                                                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                        </View> :

                                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                        onPress={() => handleSubmit(volume)}
                                                                                                >
                                                                                                        <View style={styles.cardDetails}>
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{volume.users.NOM} {volume.users.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={[styles.titeName, { marginLeft: 3 }]}>{moment(volume?.date).format('DD/MM/YYYY HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={[styles.titeName, { marginLeft: 3 }]}>{volume?.folios?.length} dossiers</Text></View>

                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </TouchableNativeFeedback>

                                                                                        }
                                                                                </>
                                                                        )
                                                                }}
                                                                keyExtractor={(volume, index) => index.toString()}
                                                        />}
                                </View> : null
                        }
                         {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_SCANNING ?
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesSuperviseur.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun volume trouvé
                                                        </Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesSuperviseur}
                                                                renderItem={({ item: volume, index }) => {
                                                                        return (
                                                                                <>
                                                                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                        </View> :

                                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                        onPress={() => handleSubmit(volume)}
                                                                                                >
                                                                                                        <View style={styles.cardDetails}>
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{volume.users.NOM} {volume.users.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={[styles.titeName, { marginLeft: 3 }]}>{moment(volume?.date).format('DD/MM/YYYY HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={[styles.titeName, { marginLeft: 3 }]}>{volume?.folios?.length} dossiers</Text></View>

                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </TouchableNativeFeedback>

                                                                                        }
                                                                                </>
                                                                        )
                                                                }}
                                                                keyExtractor={(volume, index) => index.toString()}
                                                        />}
                                </View> : null
                        }
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
                color: "#777",
                fontSize: 12
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