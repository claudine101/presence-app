import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, FlatList, TouchableNativeFeedback } from "react-native";
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useCallback, useState } from "react";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'

/**
 * Screen pour la listes des volume planifier pour vous
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 11/7/2023
 * @returns 
 */
export default function AllVolumeScreen() {
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const [allVolumes, setAllVolumes] = useState([])
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
                const vol = await fetchApi(`/volume/dossiers/volume`)
                setAllVolumes(vol.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [user]))


    const actions = [
        {
            text: "Ajouter volume",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "NewVolumeScreen",
            position: 1,
            render: () => <Action title={"Planification des activites"} image={require("../../../assets/images/mail-receive-small.png")} key={"key1"} />
        },
        {
            text: "Agent Archivages",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentArchivageScreen",
            position: 2,
            render: () => <Action title={"Agent Archivages"} image={require("../../../assets/images/mail-receive-small.png")} key={"key2"} />
        },
        {
            text: "Agent superviseur",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentSuperviseurScreen",
            position: 3,
            render: () => <Action title={"Agent superviseur"} image={require("../../../assets/images/mail-receive-small.png")} key={"key3"} />
        },
        {
            text: "Agent superviseur maille",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentSuperviseurMalleScreen",
            position: 4,
            render: () => <Action title={"Agent superviseur maille"} image={require("../../../assets/images/mail-receive-small.png")} key={"key4"} />
        },
        {
            text: "Agent superviseur aille",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentSuperviseurAilleScreen",
            position: 5,
            render: () => <Action title={"Agent superviseur aille"} image={require("../../../assets/images/mail-receive-small.png")} key={"key5"} />
        },
        {
            text: "Agent chef plateau",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentChefPlateauScreen",
            position: 6,
            render: () => <Action title={"Agent chef plateau"} image={require("../../../assets/images/mail-receive-small.png")} key={"key6"} />
        },
        {
            text: "Agent preparation",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentPreparationScreen",
            position: 7,
            render: () => <Action title={"Agent preparation"} image={require("../../../assets/images/mail-receive-small.png")} key={"key7"} />
        },
        {
            text: "Agent traitement",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "AgentSuperviseurFinScreen",
            position: 8,
            render: () => <Action title={"Agent traitement"} image={require("../../../assets/images/mail-receive-small.png")} key={"key8"} />
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
                                            onPress={()=>navigation.navigate("VolumeDetailsScreen")}
                                        >
                                            <View style={styles.cardDetails}>
                                                <View style={styles.carddetailItem}>
                                                    <View style={styles.cardImages}>
                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                    </View>
                                                    <View style={styles.cardDescription}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                            <View>
                                                                <Text style={styles.itemVolume}>{volume.NUMERO_VOLUME}</Text>
                                                                <Text>{volume.CODE_VOLUME}</Text>
                                                            </View>
                                                            <Text>{moment(volume.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
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
                actions={actions}
                onPressItem={name => {
                    if (name == 'NewVolumeScreen') {
                        navigation.navigate("NewVolumeScreen")
                    } else if (name == 'AgentArchivageScreen') {
                        navigation.navigate('AgentArchivageScreen')
                    } else if (name == 'AgentSuperviseurScreen') {
                        navigation.navigate('AgentSuperviseurScreen')
                    } else if (name == 'AgentSuperviseurMalleScreen') {
                        navigation.navigate('AgentSuperviseurMalleScreen')
                    } else if (name == 'AgentSuperviseurAilleScreen') {
                        navigation.navigate('AgentSuperviseurAilleScreen')
                    } else if (name == 'AgentChefPlateauScreen') {
                        navigation.navigate('AgentChefPlateauScreen')
                    } else if (name == 'AgentPreparationScreen') {
                        navigation.navigate('AgentPreparationScreen')
                    } else {
                        navigation.navigate('AgentSuperviseurFinScreen')
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
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#c4c4c4',
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 15,
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
        borderRadius: 10,
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