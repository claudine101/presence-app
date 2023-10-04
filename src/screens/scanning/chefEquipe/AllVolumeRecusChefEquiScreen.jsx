import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { COLORS } from "../../../styles/COLORS";
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchApi from "../../../helpers/fetchApi";
import moment from 'moment'
import PROFILS from "../../../constants/PROFILS"
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/selectors/userSelector";

/**
 * Screen pour afficher les volumes d'un chef d'equipe
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 2/8/2023
 * @returns 
 */

export default function AllVolumeRecusChefEquiScreen() {
        const navigation = useNavigation()
        const [allVolumes, setAllVolumes] = useState([])
        const [allVolumesPlateau, setAllVolumesPlateau] = useState([])
        const [loading, setLoading] = useState(false)
        const user = useSelector(userSelector)
        const handleSubmit = (volume) => {
                if (user.ID_PROFIL == PROFILS.CHEF_EQUIPE) {
                        navigation.navigate("NewAgentSupAIlleScanScreen", { volume: volume.volume, id: volume.volume.ID_VOLUME })
                } else if (user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING) {
                        navigation.navigate("NewChefPlateauScreen", { volume: volume, id: volume.volume.ID_VOLUME, folios: volume.folios })
                } else {
                        navigation.navigate("NewAgentSupScanScreen", { volume: volume, id: volume.volume.ID_VOLUME, folios: volume.folios })
                }
        }

        //fonction pour recuperer les volumes associer a un chef d'equipe
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/plateau`)
                                        setAllVolumesPlateau(vol.result)
                                }
                                else if (user.ID_PROFIL == PROFILS.CHEF_EQUIPE) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/volume`)
                                        setAllVolumes(vol.result)
                                }
                                else {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/tousVolume`)
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
                        <AppHeader title="Volumes reçus" />
                        {(user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) ?
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesPlateau?.length == 0 ? <View style={styles.emptyContainer}>
                                                        <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                                                        <Text style={styles.emptyLabel}>Aucun volume trouvé</Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesPlateau}
                                                                renderItem={({ item: volume, index }) => {
                                                                        return (
                                                                                <>
                                                                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                        </View> :
                                                                                                volume?.folios?.length > 0 ?
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
                                                                                                                                                                        {moment(volume?.DATE_INSERTION).format('DD/MM/YYYY HH:mm')}
                                                                                                                                                                        {/* {volume.DATE_INSERTION} */}
                                                                                                                                                                </Text>
                                                                                                                                                        </View>
                                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                                <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                                                {
                                                                                                                                                                        <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                                {volume?.folios?.length ? volume?.folios?.length : "0"} dossier{volume?.folios?.length > 1 && 's'}
                                                                                                                                                                        </Text>
                                                                                                                                                                }
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
                                                                keyExtractor={(volume, index) => index.toString()}
                                                        />
                                                        }
                                </View>

                                :
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumes?.length == 0 ? <View style={styles.emptyContainer}>
                                                        <Image source={require("../../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                                                        <Text style={styles.emptyLabel}>Aucun volume trouvé</Text>
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
                                                                                                                                                                {moment(volume?.DATE_INSERTION).format('DD/MM/YYYY HH:mm')}
                                                                                                                                                        </Text>
                                                                                                                                                </View>
                                                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                        <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                                        {
                                                                                                                                                             (user.ID_PROFIL == PROFILS.CHEF_EQUIPE) ?   
                                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                        {volume?.volume?.NOMBRE_DOSSIER ? volume?.volume?.NOMBRE_DOSSIER : "0"} dossier{volume?.volume.NOMBRE_DOSSIER > 1 && 's'}
                                                                                                                                                                </Text>:
                                                                                                                                                                 <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                                 {volume?.folios?.length ? volume?.folios?.length : "0"} dossier{volume?.folios?.length > 1 && 's'}
                                                                                                                                                         </Text>
                                                                                                                                                        }
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
                                                                keyExtractor={(volume, index) => index.toString()}
                                                        />
                                                        }
                                </View>
                        }
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