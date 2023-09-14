import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, FlatList, TouchableNativeFeedback } from "react-native";
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useState } from "react";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'
import PROFILS from "../../constants/PROFILS";


/**
 * Screen pour la listes des volume 
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 1/08/2023
 * @returns 
 */
export default function AllFolioScreen() {
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const [allVolumes, setAllVolumes] = useState([])
    const [nextRouteName, setNextRouteName] = useState(null)
    const [loading, setLoading] = useState(false)

    const Action = ({ title, image }) => {
        return (
            <View style={styles.action}>
                <Text style={styles.actionLabel}>{title}</Text>
                <View style={styles.actionIcon}>
                    <Image source={image} style={{ tintColor: '#fff', maxWidth: '50%', maxHeight: '50%', minWidth: '50%', minHeight: '50%' }} />
                </View>
            </View>
        )
    }

    //fonction pour recuperer les volumes planifier par rapport de l'utilisateur connecte
    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                setLoading(true)
                const vol = await fetchApi(`/preparation/folio/folios`)
                setAllVolumes(vol.result.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [user]))

    //fonction pour recuperer screen pour  detaillers
    useFocusEffect(useCallback(() => {
        if(user.ID_PROFIL==PROFILS.CHEF_DIVISION_ARCHIGES){
         setNextRouteName('DetailsVolumeScreen')
        }
        else if(user.ID_PROFIL==PROFILS.AGENTS_DESARCHIVAGES){
            setNextRouteName('AddNombreFolioScreen')
        }
        else if(user.ID_PROFIL==PROFILS.AGENTS_SUPERVISEUR_ARCHIVE){
            setNextRouteName('DetaillerFolioScreen')
        }
        else if(user.ID_PROFIL==PROFILS.AGENTS_DISTRIBUTEUR){
            setNextRouteName('AddSuperviseurAileVolumeScreen')
        }
        else if(user.ID_PROFIL==PROFILS.AGENTS_SUPERVISEUR_AILE){
            setNextRouteName('AddChefPlateauVolumeScreen')
        }
        else if(user.ID_PROFIL==PROFILS.CHEF_PLATEAU){
            setNextRouteName('AddSupervisurPreparationFolioScreen')
        }
        else if(user.ID_PROFIL==PROFILS.AGENT_SUPERVISEUR){
            setNextRouteName('AddAgentPreparationFolioScreen')
        }
    }, [user]))


    const actions = [
    ];
    const actionsPlanification = [
        {
            text: "Ajouter volume",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 1,
            render: () => <Action title={"Planification des activites"} image={require("../../../assets/images/dossier.png")} key={"key1"} />
        },
    ];
    const actionsAgentArchivages = [
        {
            text: "Agent Archivages",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 2,
            render: () => <Action title={"Ajouter les dossiers"} image={require("../../../assets/images/dossier.png")} key={"key2"} />
        },
    ];
    const actionsAgentSuperviseur = [
        {
            text: "Agent superviseur",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 3,
            render: () => <Action title={"Ajouter les details d'un folio"} image={require("../../../assets/images/dossier.png")} key={"key3"} />
        },
        {
            text: "Agent superviseur maille",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeSupMailleScreen",
            position: 4,
            render: () => <Action title={"Ajout de volume dans une malle"} image={require("../../../assets/images/dossier.png")} key={"key4"} />
        },
    ];
    const actionsAgentSuperviseurAille = [
        {
            text: "Agent superviseur aille",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 5,
            render: () => <Action title={"Nommer agnt superviseur aille"} image={require("../../../assets/images/dossier.png")} key={"key5"} />
        },
    ];
    const actionsAgentAille = [
        {
            text: "Superviseur aille",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 6,
            render: () => <Action title={"Nommer un chef plateau"} image={require("../../../assets/images/dossier.png")} key={"key6"} />
        },
    ];
    const actionsAgentchefPlateau = [
        {
            text: "Agent chef plateau",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 7,
            render: () => <Action title={"Agent superviseur phase preparation"} image={require("../../../assets/images/dossier.png")} key={"key7"} />
        },
    ];
    const actionsAgentSuperviseurPhasePreparation = [
        {
            text: "Agent superviseur phase preparation",
            icon: require("../../../assets/images/dossier.png"),
            name: "DescriptionEtapeScreen",
            position: 8,
            render: () => <Action title={"Nommer un agent preparation"} image={require("../../../assets/images/dossier.png")} key={"key8"} />
        },
        {
            text: "Agent traitement",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "DescriptionEtapeSupMailleScreen",
            position: 9,
            render: () => <Action title={"Ajout de detaits"} image={require("../../../assets/images/dossier.png")} key={"key9"} />
        },
    ];

    return (
        <>
            <AppHeader />
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
                                                                <Text>{moment(volume?.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
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
            </View>


            <FloatingAction
                actions={user.ID_PROFIL == 1 ? actionsPlanification :
                    user.ID_PROFIL == 2 ? actionsAgentArchivages :
                        user.ID_PROFIL == 3 ? actionsAgentSuperviseur :
                            user.ID_PROFIL == 29 ? actionsAgentSuperviseurAille :
                                user.ID_PROFIL == 7 ? actionsAgentAille :
                                    user.ID_PROFIL == 15 ? actionsAgentchefPlateau :
                                        user.ID_PROFIL == 8 ? actionsAgentSuperviseurPhasePreparation : actions}
                onPressItem={name => {
                    if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate("DescriptionEtapeScreen")
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeSupMailleScreen') {
                        navigation.navigate('DescriptionEtapeSupMailleScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else if (name == 'DescriptionEtapeScreen') {
                        navigation.navigate('DescriptionEtapeScreen')
                    } else {
                        navigation.navigate('DescriptionEtapeSupMailleScreen')
                    }
                }}
                color={COLORS.primary}
            />
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
    }
})