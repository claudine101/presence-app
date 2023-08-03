import React from "react";
import AppHeaderPhPreparationRetour from "../../../../components/app/AppHeaderPhPreparationRetour";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from 'moment'
import { useSelector } from "react-redux";
import { COLORS } from "../../../../styles/COLORS"

/**
 * Screen pour afficher les folios retourner par une equipe a un agent superviseur scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 3/8/2023
 * @returns 
 */

export default function AllFolioEquipeRetourScreen() {
        const navigation = useNavigation()
        const handleSubmit = (folio) => {
                navigation.navigate("NewFolioRetourScreen")
        }
        return (
                <>
                        <AppHeaderPhPreparationRetour />
                        <View style={styles.container}>
                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                        onPress={() => handleSubmit()}
                                >
                                        <View style={styles.cardDetails}>
                                                <View style={styles.carddetailItem}>
                                                        <View style={styles.cardImages}>
                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                        </View>
                                                        <View style={styles.cardDescription}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                        <View>
                                                                                <Text style={styles.itemVolume}>sjjsjs</Text>
                                                                                <Text>sksksk</Text>
                                                                        </View>
                                                                        <Text>sjsjs</Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>
                                </TouchableNativeFeedback>
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