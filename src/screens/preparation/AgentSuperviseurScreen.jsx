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


export default function AgentSuperviseurScreen() {
        const navigation = useNavigation()
        const [allDetails, setAllDetails] = useState([])
        const [loading, setLoading] = useState(false)
        const [header, setHeader] = useState("Agents superviseurs")
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
                                const res = await fetchApi('/preparation/folio/superviseur')
                                setAllDetails(res.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))
        return (
                <>
                        <AppHeaderPhPreparationRetour header={header} />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allDetails.length <= 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun Agent  superviseur trouvé
                                                </Text>
                                                <Text style={styles.emptyDesc}>
                                                        Aucun folio deja envoyes chez un agent superviseur
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
                                                                                </View> :folio.users?
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={() => navigation.navigate("FolioRetourSuperviseurScreen", { folio:folio,users:folio.users})}
                                                                                        >
                                                                                                <View style={styles.cardDetails}>
                                                                                                        <View style={styles.carddetailItem}>
                                                                                                                <View style={styles.cardImages}>
                                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                                </View>
                                                                                                                <View style={styles.cardDescription}>
                                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                                <View style={styles.cardNames}>
                                                                                                                                        <Text style={styles.itemVolume} numberOfLines={1}>
                                                                                                                                            {folio.users?.NOM} {folio.users?.PRENOM}</Text>
                                                                                                                                        <Text>{folio.folios?.length}</Text>
                                                                                                                                </View>
                                                                                                                                <Text style={{ color: "#777" }}>{moment(folio.DATE_INSERTION).format('DD-MM-YYYY')}</Text>
                                                                                                                        </View>
                                                                                                                </View>
                                                                                                        </View>
                                                                                                </View>
                                                                                        </TouchableNativeFeedback>:null
                                                                                }
                                                                        </>
                                                                )
                                                        }}
                                                        keyExtractor={(folio, index) => index.toString()}
                                                />}
                        </View>
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