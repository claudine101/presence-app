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
 * Screen pour afficher agents de preparation et leurs folio
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 17/7/2023
 * @returns 
 */


export default function FolioRetourneScreen() {
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
                                const res = await fetchApi('/preparation/folio/agentsRetourne')
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
                        <AppHeader title="Folio préparés" />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                        allDetails.length <= 0 ? <View style={styles.emptyContainer}>
                                                <Image source={require("../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                                                <Text style={styles.emptyLabel}>Aucun Folio  trouvé</Text>
                                        </View> :

                                                <FlatList
                                                        style={styles.contain}
                                                        data={allDetails}
                                                        renderItem={({ item: folio, index }) => {
                                                                return (
                                                                        <>
                                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                                </View> : folio.users ?
                                                                                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                                onPress={() => navigation.navigate("DetailsFolioScreen", { folio: folio, users: folio.users, folioRetour: true })}
                                                                                        >
                                                                                                <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                        <View style={styles.folio}>
                                                                                                                <View style={styles.folioLeftSide}>
                                                                                                                        <View style={styles.folioImageContainer}>
                                                                                                                                {folio.users?.PHOTO_USER ? <Image source={{ uri: folio.users?.PHOTO_USER }} style={styles.folioImageContainer} /> :
                                                                                                                                        <Image source={require('../../../assets/images/user.png')} style={styles.folioImageContainer} />}
                                                                                                                        </View>
                                                                                                                        <View style={styles.folioDesc}>
                                                                                                                                <Text style={styles.folioName}>{folio.users?.NOM} {folio.users?.PRENOM}</Text>
                                                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                <AntDesign name="calendar" size={20} color="#777" />
                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                        {moment(folio?.date).format('DD/MM/YYYY HH:mm')}
                                                                                                                                                </Text>
                                                                                                                                        </View>
                                                                                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                                                <Ionicons name="ios-document-text-outline" size={20} color="#777" />
                                                                                                                                                <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                                                                                                        {folio.folios?.length ? folio.folios?.length : "0"} dossier{folio.folios?.length > 1 && 's'}
                                                                                                                                                </Text>
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
                                                        keyExtractor={(folio, index) => index.toString()}
                                                />}
                        </View>

                </>
        )
}
const styles = StyleSheet.create({
        container: {
                flex: 1,
        },
        image: {
                width: "100%",
                height: "100%",
                borderRadius: 10,
                resizeMode: "cover"
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