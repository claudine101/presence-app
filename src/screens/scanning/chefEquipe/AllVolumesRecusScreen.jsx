import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { COLORS } from "../../../styles/COLORS";
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchApi from "../../../helpers/fetchApi";
import moment from 'moment'
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/selectors/userSelector";


/**
 * Screen pour la listes des volume planifier pour vous
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/8/2023
 * @returns 
 */

export default function AllVolumesRecusScreen() {
        const navigation = useNavigation()
        const [allVolumes, setAllVolumes] = useState([])
        const [loading, setLoading] = useState(false)
        const user = useSelector(userSelector)

        //fonction pour recuperer les volumes associer a un chef d'equipe
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const vol = await fetchApi(`/scanning/volume/sup/aille`)
                                setAllVolumes(vol.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))

        return (
                <>
                        <AppHeader />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View>:
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
                                                                                onPress={() => navigation.navigate("ValideChefEquipeScreen", {details:volume})}
                                                                        >
                                                                                <View style={styles.cardDetails}>
                                                                                        <View style={styles.carddetailItem}>
                                                                                                <View style={styles.cardImages}>
                                                                                                        <AntDesign name="folderopen" size={24} color="black" />
                                                                                                </View>
                                                                                                <View style={styles.cardDescription}>
                                                                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                                                                <View>
                                                                                                                        <Text style={styles.itemVolume}>{volume.NOM} {volume.PRENOM}</Text>
                                                                                                                        {/* <Text>{volume.CODE_VOLUME}</Text> */}
                                                                                                                </View>
                                                                                                                {/* <Text>12/12/2023</Text> */}
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