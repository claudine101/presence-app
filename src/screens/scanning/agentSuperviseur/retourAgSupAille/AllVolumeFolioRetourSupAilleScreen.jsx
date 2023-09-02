import React, { useCallback, useState } from "react";
import AppHeaderPhPreparationRetour from "../../../../components/app/AppHeaderPhPreparationRetour";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../styles/COLORS"
import fetchApi from "../../../../helpers/fetchApi";
import PROFILS from "../../../../constants/PROFILS";
import moment from 'moment'
import { useSelector } from "react-redux";
import { userSelector } from "../../../../store/selectors/userSelector";

/**
 * Screen pour afficher les volumes retourner par un chef plateau vers un agent superviseur aille
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 4/8/2023
 * @returns 
 */


export default function AllVolumeFolioRetourSupAilleScreen() {
        const navigation = useNavigation()

        const [allVolumes, setAllVolumes] = useState([])
        const [loadingAilleScanning, setLoadingAilleScanning] = useState(false)

        const [loading, setLoading] = useState(false)

        const [allRetourVolumes, setAllRetourVolumes] = useState([])
        const [loadingChefPlateau, setLoadingChefPlateau] = useState(false)

        const [allRetourVolumesDistributeur, setAllRetourVolumesDistributeur] = useState([])
        const [loadingDistributeaur, setLoadingDistributeaur] = useState(false)

        const [allRetourVolumesArchives, setAllRetourVolumesArchives] = useState([])
        const [loadingSupArchives, setLoadingSupArchives] = useState(false)

        const [allRetourVolumesDesarchivages, setAllRetourVolumesDesarchivages] = useState([])
        const user = useSelector(userSelector)
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingAilleScanning(true)
                                const vol = await fetchApi(`/scanning/volume/retour/agent`)
                                setAllVolumes(vol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingAilleScanning(false)
                        }
                })()
        }, []))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingChefPlateau(true)
                                const vol = await fetchApi(`/scanning/retour/agent/chefEquipe`)
                                setAllRetourVolumes(vol.volu)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingChefPlateau(false)
                        }
                })()
        }, []))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingDistributeaur(true)
                                const vol = await fetchApi(`/scanning/retour/agent/allVolume`)
                                setAllRetourVolumesDistributeur(vol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingDistributeaur(false)
                        }
                })()
        }, []))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoadingSupArchives(true)
                                const vol = await fetchApi(`/scanning/retour/agent/allVolume/archives`)
                                setAllRetourVolumesArchives(vol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoadingSupArchives(false)
                        }
                })()
        }, []))

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const vol = await fetchApi(`/scanning/retour/agent/allVolume/desarchivages`)
                                setAllRetourVolumesDesarchivages(vol.result)
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
                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING ? <View style={styles.container}>
                                {loadingAilleScanning ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allVolumes.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun volume trouvé
                                                </Text>
                                                {/* <Text style={styles.emptyDesc}>
                                                        Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                </Text> */}
                                        </View> :
                                                <FlatList
                                                        style={styles.contain}
                                                        data={allVolumes}
                                                        renderItem={({ item: volume, index }) => {
                                                                return (
                                                                        <>
                                                                                {loadingAilleScanning ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> :
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                // onPress={() => navigation.navigate("ConfimerPvScreen", { volume: volume, id: volume.volume.ID_VOLUME })}
                                                                                                onPress={() => navigation.navigate('DetailsParAgentClickVolumeScreen', { details: volume?.volumes, userTraite: volume?.users })}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.cardImages}>
                                                                                                                <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                        </View>
                                                                                                        <View style={styles.cardAllDetails}>
                                                                                                                <View>
                                                                                                                        <Text style={styles.titlePrincipal}>{volume?.users?.NOM} {volume?.users?.PRENOM}</Text>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <Fontisto name="date" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume?.volumes[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                <View>
                                                                                                                        <View ><Text></Text></View>
                                                                                                                        {/* <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume?.volumes[0].volume.NOMBRE_DOSSIER}</Text></View>

                                                                                                                        </View> */}
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
                        </View> : null}
                        {user.ID_PROFIL == PROFILS.CHEF_EQUIPE_SCANNING ? <View style={styles.container}>
                                {loadingChefPlateau ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allRetourVolumes.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun volume trouvé
                                                </Text>
                                                {/* <Text style={styles.emptyDesc}>
                                                        Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                </Text> */}
                                        </View> :
                                                <FlatList
                                                        style={styles.contain}
                                                        data={allRetourVolumes}
                                                        renderItem={({ item: volume, index }) => {
                                                                return (
                                                                        <>
                                                                                {loadingChefPlateau ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> :
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={() => navigation.navigate("ConfirmerPvRetourAgentDistrScreen", { volume: volume, id: volume.ID_VOLUME })}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.cardImages}>
                                                                                                                <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                        </View>
                                                                                                        <View style={styles.cardAllDetails}>
                                                                                                                <View>
                                                                                                                        <Text style={styles.titlePrincipal}>{volume.NUMERO_VOLUME}</Text>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <Fontisto name="date" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume.DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                <View>
                                                                                                                        <View ><Text></Text></View>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume.NOMBRE_DOSSIER} dossiers</Text></View>

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
                        </View> : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR ?
                                <View style={styles.container}>
                                        {loadingDistributeaur ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allRetourVolumesDistributeur.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun volume trouvé
                                                        </Text>
                                                        {/* <Text style={styles.emptyDesc}>
                                                                Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                        </Text> */}
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allRetourVolumesDistributeur}
                                                                renderItem={({ item: volume, index }) => {
                                                                        return (
                                                                                <>
                                                                                        {loadingDistributeaur ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                        </View> :
                                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                        onPress={() => navigation.navigate('DetailsClickAgentDistributeurVolumeScreen', { details: volume?.volumes, userTraite: volume?.volumes[0]?.users })}
                                                                                                >
                                                                                                        <View style={styles.cardDetails}>
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{volume?.volumes[0]?.users?.NOM} {volume?.volumes[0]?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume?.volumes[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume?.volumes.length} dossiers</Text></View>

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
                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE ? <View style={styles.container}>
                                {loadingSupArchives ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allRetourVolumesArchives.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun volume trouvé
                                                </Text>
                                                {/* <Text style={styles.emptyDesc}>
                                                        Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                </Text> */}
                                        </View> :
                                                <FlatList
                                                        style={styles.contain}
                                                        data={allRetourVolumesArchives}
                                                        renderItem={({ item: volume, index }) => {
                                                                return (
                                                                        <>
                                                                                {loadingSupArchives ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> :
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={() => navigation.navigate('DetailsClickAgentSupArchiveVolumeScreen', { details: volume?.volumes, userTraite: volume?.volumes[0]?.users })}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.cardImages}>
                                                                                                                <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                        </View>
                                                                                                        <View style={styles.cardAllDetails}>
                                                                                                                <View>
                                                                                                                        <Text style={styles.titlePrincipal}>{volume?.volumes[0]?.users?.NOM} {volume?.volumes[0]?.users?.PRENOM}</Text>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <Fontisto name="date" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume?.volumes[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                <View>
                                                                                                                        <View ><Text></Text></View>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume?.volumes[0].volume.NOMBRE_DOSSIER} dossiers</Text></View>

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
                        </View> : null}

                        {user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES ? <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allRetourVolumesDesarchivages.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun volume trouvé
                                                </Text>
                                                {/* <Text style={styles.emptyDesc}>
                                                        Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                </Text> */}
                                        </View> :
                                                <FlatList
                                                        style={styles.contain}
                                                        data={allRetourVolumesDesarchivages}
                                                        renderItem={({ item: volume, index }) => {
                                                                return (
                                                                        <>

                                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> :
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={() => navigation.navigate('DetailsAgentDesarchivagesVolumeScreen', { details: volume?.volumes, userTraite: volume?.volumes[0]?.users })}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.cardImages}>
                                                                                                                <Image source={require('../../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                        </View>
                                                                                                        <View style={styles.cardAllDetails}>
                                                                                                                <View>
                                                                                                                        <Text style={styles.titlePrincipal}>{volume?.volumes[0]?.users?.NOM} {volume?.volumes[0]?.users?.PRENOM}</Text>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <Fontisto name="date" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(volume?.volumes[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                                <View>
                                                                                                                        <View ><Text></Text></View>
                                                                                                                        <View style={styles.cardDescDetails}>
                                                                                                                                <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{volume?.volumes[0].volume.NOMBRE_DOSSIER} dossiers</Text></View>

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
                        </View> : null}


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
        emptyContaier: {
                flex:1,
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