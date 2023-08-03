import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import AppHeaderAgentSupArchiveRetour from "../../components/app/AppHeaderAgentSupArchiveRetour";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../styles/COLORS"
import { AntDesign } from '@expo/vector-icons';

/**
 * Screen pour la listes des volume retourner pour un agent superviseur archive
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 27/7/2023
 * @returns 
 */

export default function AgentSupArchiveRetourScreen() {
        const navigation = useNavigation()
        return (
                <>
                        <AppHeaderAgentSupArchiveRetour />
                        <View style={styles.container}>
                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}>
                                        <View style={styles.cardDetails}>
                                                <View style={styles.carddetailItem}>
                                                        <View style={styles.cardImages}>
                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                        </View>
                                                        <View style={styles.cardDescription}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                        <View>
                                                                                <Text style={styles.itemVolume}>dkdhdh</Text>
                                                                                <Text>1233</Text>
                                                                        </View>
                                                                        <Text>12/12/1111</Text>
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
        carddetailItem: {
                flexDirection: 'row',
                alignItems: 'center',
        },
})