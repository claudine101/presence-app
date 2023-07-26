import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, FlatList, Image } from "react-native";
import { COLORS } from "../../styles/COLORS";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AppHeader from "../../components/app/AppHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'
import { useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { FloatingAction } from "react-native-floating-action";
import AppHeaderPhPreparationRetour from "../../components/app/AppHeaderPhPreparationRetour";

/**
 * Screen pour afficher le details de folio avec leurs natures deja donnees a un agent de preparation
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 17/7/2023
 * @returns 
 */


export default function AgentSupPhasePreparationRetourScreen() {
        const navigation = useNavigation()
        const [allDetails, setAllDetails] = useState([])
        const [loading, setLoading] = useState(false)
        const user = useSelector(userSelector)

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

        //Fonction pour recuperer les details
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const res = await fetchApi('/folio/dossiers/agentPreparations')
                                console.log(res)
                                setAllDetails(res.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))

        const actions = [
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
                        icon: require("../../../assets/images/dossier.png"),
                        name: "DescriptionEtapeSupMailleScreen",
                        position: 9,
                        render: () => <Action title={"Ajout de detaits"} image={require("../../../assets/images/dossier.png")} key={"key9"} />
                },
        ];

        return (
                <>
                        <AppHeaderPhPreparationRetour />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allDetails.length <= 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun Folio trouvé
                                                </Text>
                                                <Text style={styles.emptyDesc}>
                                                        Aucun folio deja envoyes chez un agent de preparation
                                                </Text>
                                        </View> :

                                                <FlatList
                                                        style={styles.contain}
                                                        data={allDetails}
                                                        renderItem={({ item: folio, index }) => {
                                                                return (
                                                                        <>
                                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> :
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={() => navigation.navigate("AgentSupPhasePreparationRetourDetailsScreen", { ID_USER_AILE_AGENT_PREPARATION: folio.ID_USER_AILE_AGENT_PREPARATION, ID_FOLIO_AILE_AGENT_PREPARATION: folio.ID_FOLIO_AILE_AGENT_PREPARATION, NOM: folio.NOM, PRENOM: folio.PRENOM, ID_ETAPE_FOLIO: folio.ID_ETAPE_FOLIO })}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.carddetailItem}>
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                                </View>
                                                                                                                <View style={styles.cardDescription}>
                                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                                <View style={styles.cardNames}>
                                                                                                                                        <Text style={styles.itemVolume} numberOfLines={1}>{folio.NOM} {folio.PRENOM}</Text>
                                                                                                                                        <Text>{folio.nbre_folio}</Text>
                                                                                                                                </View>
                                                                                                                                <Text style={{ color: "#777" }}>{moment(folio.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
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
                        <FloatingAction
                                actions={
                                        user.ID_PROFIL == 8 ? actionsAgentSuperviseurPhasePreparation : actions}
                                onPressItem={name => {
                                        if (name == 'DescriptionEtapeScreen') {
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
        cardNames: {
                maxWidth: "67%"
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
        actionIcon: {
                width: 45,
                height: 45,
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
        },
        emptyContaier: {
                // flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
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
        emptyImage: {
                width: 100,
                height: 100,
                resizeMode: 'contain'
            },
})