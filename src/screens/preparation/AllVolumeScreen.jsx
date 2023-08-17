import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, FlatList, TouchableNativeFeedback } from "react-native";
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from "react";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'
import PROFILS from "../../constants/PROFILS";


/**
 * Screen pour la listes des volume planifier pour vous
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 1/08/2023
 * @returns 
 */
export default function AllVolumeScreen() {
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const [allVolumes, setAllVolumes] = useState([])
    const [nextRouteName, setNextRouteName] = useState(null)
    const [loading, setLoading] = useState(false)
    //fonction pour recuperer les volumes planifier par rapport de l'utilisateur connecte
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                if (user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR) {
                    setLoading(true)
                    const vol = await fetchApi(`/preparation/folio/folios`)
                    setAllVolumes(vol.result)
                }
                else {
                    setLoading(true)
                    const vol = await fetchApi(`/preparation/volume`)
                    setAllVolumes(vol.result.data)
                }

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [user]))

    //fonction pour recuperer screen pour  detaillers
    useFocusEffect(useCallback(() => {
        if (user.ID_PROFIL == PROFILS.CHEF_DIVISION_ARCHIGES) {
            setNextRouteName('DetaillerVolumeScreen')
        }
        else if (user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES) {
            setNextRouteName('AddNombreFolioScreen')
        }
        else if (user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE) {
            setNextRouteName('DetaillerFolioScreen')
        }
        else if (user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR) {
            setNextRouteName('AddSuperviseurAileVolumeScreen')
        }
        else if (user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_AILE) {
            setNextRouteName('AddChefPlateauVolumeScreen')
        }
        else if (user.ID_PROFIL == PROFILS.CHEF_PLATEAU) {
            setNextRouteName('AddSupervisurPreparationFolioScreen')
        }
        else if (user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR) {
            setNextRouteName('AddAgentPreparationFolioScreen')
        }

    }, [user]))

    //Fonction pour ajouter un volume
    const onPressAdd = () => {
        navigation.navigate("NewVolumeScreen")
    }
    return (
        <>
            <AppHeader />
            {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR ?
                <View style={styles.container}>
                    {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>

                    </View> : allVolumes.length <= 0 ? <View style={styles.emptyContaier}>
                        <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
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

                                                onPress={() => navigation.navigate(nextRouteName, { volume: volume })}
                                            >
                                                {
                                                    <View style={styles.cardDetails}>
                                                        <View style={styles.carddetailItem}>
                                                            <View style={styles.cardImages}>
                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                            </View>
                                                            <View style={styles.cardDescription}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                    <View>
                                                                        <Text style={styles.itemVolume}>{volume.volume.NUMERO_VOLUME}</Text>
                                                                    </View>
                                                                    <View>


                                                                    </View>
                                                                    <Text>{moment(volume?.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
                                                                </View>
                                                                {volume.folios.length >= 2 ? <Text style={styles.itemVolume}>{volume.folios.length} dossiers</Text> :
                                                                    <Text style={styles.itemVolume}>{volume.folios.length} dossier</Text>}

                                                            </View>
                                                        </View>
                                                    </View>


                                                }
                                            </TouchableNativeFeedback>
                                        }
                                    </>
                                )
                            }}
                            keyExtractor={(volume, index) => index.toString()}
                        />}
                </View> :

                <View style={styles.container}>
                    {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator animating size={'large'} color={'#777'} />
                    </View> :
                        allVolumes.length <= 0 ? <View style={styles.emptyContaier}>
                            <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
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
                                                    onPress={() => navigation.navigate(nextRouteName, { volume: volume })}
                                                >
                                                    <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>
                                                        <View style={styles.folio}>
                                                            <View style={styles.folioLeftSide}>
                                                                <View style={styles.folioImageContainer}>
                                                                    <Image source={require("../../../assets/images/dossierDetail.png")} style={styles.folioImage} />
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
                                                                            <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                {volume?.volume?.NOMBRE_DOSSIER ? volume?.volume?.NOMBRE_DOSSIER : "0"} dossier{volume?.volume?.NOMBRE_DOSSIER > 1 && 's'}
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
                                keyExtractor={(volume, index) => index.toString()}
                            />}
                   { user.ID_PROFIL==PROFILS.CHEF_DIVISION_ARCHIGES ? <View style={[styles.amountChanger]}>
                        <TouchableOpacity onPress={onPressAdd} >
                            <Text style={styles.amountChangerText}>+</Text>
                        </TouchableOpacity>
                    </View>:null}

                </View>}


        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd'
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
    contain: {
        backgroundColor: '#ddd'
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
})