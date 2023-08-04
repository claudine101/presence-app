import React, { useCallback, useState } from "react";
import AppHeaderPhPreparationRetour from "../../../../components/app/AppHeaderPhPreparationRetour";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../styles/COLORS"
import fetchApi from "../../../../helpers/fetchApi";
import PROFILS from "../../../../constants/PROFILS";
import moment from 'moment'

/**
 * Screen pour afficher les volumes retourner par un chef plateau vers un agent superviseur aille
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 4/8/2023
 * @returns 
 */


export default function AllVolumeFolioRetourSupAilleScreen() {
        const navigation = useNavigation()
        const [allVolumes, setAllVolumes] = useState([])
        const [loading, setLoading] = useState(false)
        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const vol = await fetchApi(`/scanning/volume/retour/agent`)
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
                              <AppHeaderPhPreparationRetour />
                        <View style={styles.container}>
                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View> :
                                         allVolumes.length == 0 ? <View style={styles.emptyContaier}>
                                                <Image source={require('../../../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                                <Text style={styles.emptyTitle}>
                                                        Aucun volume trouvé
                                                </Text>
                                                <Text style={styles.emptyDesc}>
                                                        Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                                                </Text>
                                        </View>:
                                        <FlatList
                                                style={styles.contain}
                                                data={allVolumes}
                                                renderItem={({ item: volume, index }) => {
                                                        console.log(volume)
                                                        return (
                                                                <>
                                                                        {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                        </View> :
                                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                                        onPress={()=>navigation.navigate("ConfimerPvScreen", {volume:volume, id:volume.volume.ID_VOLUME})}
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
                                                                                                                                <Text>{volume.volume.NOMBRE_DOSSIER}</Text>
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