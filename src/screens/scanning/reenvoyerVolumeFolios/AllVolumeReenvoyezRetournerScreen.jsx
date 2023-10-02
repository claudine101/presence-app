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
 * Screen pour afficher les volumes reenvoyez qui attend le retour chez agent sup aille scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 4/9/2023
 * @returns 
 */

export default function AllVolumeReenvoyezRetournerScreen() {
        const navigation = useNavigation()
        const [loading, setLoading] = useState(false)
        const [allVolumes, setAllVolumes] = useState([])
        const [allVolumesChefPlateau, setAllVolumesChefPlateau] = useState([])
        const [allVolumesChefEquipe, setAllVolumesChefEquipe] = useState([])
        const [allVolumesDistributeur, setAllVolumesDistributeur] = useState([])
        const [allVolumesArchives, setAllVolumesArchives] = useState([])
        const [allVolumesDesarchives, setAllVolumesDesarchives] = useState([])
        const user = useSelector(userSelector)

        const handleSubmit = (folio) => {
                if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                        navigation.navigate("DetailsFoliosReenvoyezretourPlateauScreen", { details: folio?.folios, userTraite: folio?.users })
                } else if(user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING) {
                        navigation.navigate("DetailsVolReenvoyerRetourSupAilleScanScreen", { details: folio?.folios, userTraite: folio?.users })
                }else if(user.ID_PROFIL == PROFILS.CHEF_EQUIPE_SCANNING){
                        navigation.navigate("DetailsVolReenvoyezRetourChefEquipeScreen", { details: folio?.folios, userTraite: folio?.users })
                }else if(user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR){
                        navigation.navigate("DetailsAffecterAgentArchivagesScreen", { details: folio?.folios, userTraite: folio?.users })
                }else if(user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE){
                        navigation.navigate("DetailsAffecterAgentDesarchivagesScreen", { details: folio?.folios, userTraite: folio?.users })
                }else if(user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES){
                        navigation.navigate("DetailsAccepteVolArchivesScreen", { details: folio?.folios, userTraite: folio?.users })
                }
        }

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                if (user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/reenvoyez/supailleScanning/retour/aileSupe/retour`)
                                        setAllVolumes(vol.volumeFolios)
                                } else if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) {
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/reenvoyez/supailleScanning/retour/chefPlateau/bien`)
                                        setAllVolumesChefPlateau(vol.UserFolios)
                                }else if(user.ID_PROFIL == PROFILS.CHEF_EQUIPE_SCANNING){
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/volume/traitees/plateau/reenvoyer/ChefEquipe/getVol`)
                                        setAllVolumesChefEquipe(vol.PvFolios)
                                }else if(user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR){
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/reenvoyez/supailleScanning/retour/archivages/dist`)
                                        setAllVolumesDistributeur(vol.UserFolios)
                                }else if(user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE){
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/reenvoyez/supailleScanning/retour/archivages/archives`)
                                        setAllVolumesArchives(vol.UserFolios)
                                }else if(user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES){
                                        setLoading(true)
                                        const vol = await fetchApi(`/scanning/retour/agent/reenvoyez/supailleScanning/retour/archivages/archives/finito`)
                                        setAllVolumesDesarchives(vol.UserFolios)
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
                        {(user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING) ? <View style={styles.container}>
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumes?.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun folio trouvé
                                                        </Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumes}
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
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.users?.NOM} {folio?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.folios[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio?.folios.length} dossiers</Text></View>

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
                        </View> : null}
                        {(user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING) ? <View style={styles.container}>
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesChefPlateau?.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun folio trouvé
                                                        </Text>
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesChefPlateau}
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
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.users?.NOM} {folio?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.date).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio?.folios.length} dossiers</Text></View>

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
                        </View> : null}
                        {(user.ID_PROFIL == PROFILS.CHEF_EQUIPE_SCANNING) ? <View style={styles.container}>
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesChefEquipe?.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun folio trouvé
                                                        </Text>
                                                        {/* <Text style={styles.emptyDesc}>
                                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
                                                                </Text> */}
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesChefEquipe}
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
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.users?.NOM} {folio?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.date).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio?.folios.length} dossiers</Text></View>

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
                        </View> : null}
                        {(user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR) ? <View style={styles.container}>
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesDistributeur?.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun folio trouvé
                                                        </Text>
                                                        {/* <Text style={styles.emptyDesc}>
                                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
                                                                </Text> */}
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesDistributeur}
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
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.users?.NOM} {folio?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.folios[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio?.folios.length} dossiers</Text></View>

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
                        </View> : null}
                        {(user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE) ? <View style={styles.container}>
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesArchives?.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun folio trouvé
                                                        </Text>
                                                        {/* <Text style={styles.emptyDesc}>
                                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
                                                                </Text> */}
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesArchives}
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
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.users?.NOM} {folio?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.folios[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio?.folios.length} dossiers</Text></View>

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
                        </View> : null}
                        {(user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES) ? <View style={styles.container}>
                                <View style={styles.container}>
                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> :
                                                allVolumesDesarchives?.length == 0 ? <View style={styles.emptyContaier}>
                                                        <Image source={require('../../../../assets/images/empty-folio.png')} style={styles.emptyImage} />
                                                        <Text style={styles.emptyTitle}>
                                                                Aucun folio trouvé
                                                        </Text>
                                                        {/* <Text style={styles.emptyDesc}>
                                                                        Aucun folio planifier ou vous n'êtes pas affecte a aucun folio
                                                                </Text> */}
                                                </View> :
                                                        <FlatList
                                                                style={styles.contain}
                                                                data={allVolumesDesarchives}
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
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <Image source={require('../../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                                                                                                </View>
                                                                                                                <View style={styles.cardAllDetails}>
                                                                                                                        <View>
                                                                                                                                <Text style={styles.titlePrincipal}>{folio?.users?.NOM} {folio?.users?.PRENOM}</Text>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <Fontisto name="date" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{moment(folio?.folios[0].DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text></View>
                                                                                                                                </View>
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                <View ><Text></Text></View>
                                                                                                                                <View style={styles.cardDescDetails}>
                                                                                                                                        <AntDesign name="filetext1" size={20} color="#777" />
                                                                                                                                        <View style={{ marginLeft: 3 }}><Text style={styles.titeName}>{folio?.folios.length} dossiers</Text></View>

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