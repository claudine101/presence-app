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

console.log(PROFILS)

/**
 * Screen pour afficher les volumes en ettente pour le chef equipe
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 9/8/2023
 * @returns 
 */

export default function VolumeEnEttenteChefEquipeScreen() {
        const [allVolumes, setAllVolumes] = useState([])
        const [loading, setLoading] = useState(false)
        const navigation = useNavigation()

        const [allVolumesChefPlateau, setAllVolumesChefPlateau] = useState([])
        const [allVolumesSupAilleScan, setAllVolumesSupAilleScan] = useState([])
        const user = useSelector(userSelector)

        const handleSubmit = (volume) => {
                console.log(volume)
                if(user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING){
                        navigation.navigate("DetailsVolumeChefPlateauTraitesScreen", { folio: volume, userTraite: volume?.users, PV_PATH: volume?.PV_PATH, date: volume.date })
                }else{
                        navigation.navigate("DetailsSupAilleScanTraiteVolumeScreen", { volume: volume.volumes, userTraite: volume?.users, PV_PATH: volume?.PV_PATH, date: volume.date })
                }
        }

        //fonction pour recuperer les volumes associer a un chef d'equipe
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/traitees/plateau`)
                                        setAllVolumesChefPlateau(vol.PvFolios)
                                } else if (user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/traitees/supaillescanning`)
                                        setAllVolumesSupAilleScan(vol.PvVolume)
                                } else {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/chefEquipe/envoyer`)
                                        setAllVolumes(vol.result)
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
                        {user.ID_PROFIL == PROFILS.CHEF_EQUIPE ?
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumes.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun volume trouvé
                                                        </Text>
                                                        <Text style={styles.emptyDesc}>
                                                                Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                        </Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumes}
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
                                                                                                                <View style={styles.carddetailItem}>
                                                                                                                        <View style={styles.cardImages}>
                                                                                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                                                                                        </View>
                                                                                                                        <View style={styles.cardDescription}>
                                                                                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                                        <View style={{ width: "62%" }}>
                                                                                                                                                <Text numberOfLines={2} style={styles.itemVolume}>{volume.traitant.NOM} {volume.traitant.PRENOM}</Text>
                                                                                                                                                <Text>{volume.traitant.EMAIL}</Text>
                                                                                                                                        </View>
                                                                                                                                        <Text>{moment(volume.DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text>
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

                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING ?
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesSupAilleScan.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun volume trouvé
                                                        </Text>
                                                        <Text style={styles.emptyDesc}>
                                                                Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                        </Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesSupAilleScan}
                                                                renderItem={({ item: volume, index }) => {
                                                                        console.log(volume)
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
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume?.date).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume?.volumes?.length} dossiers</Text></View>

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

                        {user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING ?
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesChefPlateau.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun volume trouvé
                                                        </Text>
                                                        <Text style={styles.emptyDesc}>
                                                                Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
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
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume?.date).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume?.folios?.length} dossiers</Text></View>

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