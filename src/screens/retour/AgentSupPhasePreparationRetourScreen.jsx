import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import { COLORS } from "../../styles/COLORS";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AppHeader from "../../components/app/AppHeader";
import { useNavigation } from "@react-navigation/native";

/**
 * Screen pour afficher le details de folio avec leurs natures
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 17/7/2023
 * @returns 
 */

export default function AgentSupPhasePreparationRetourScreen() {
        const navigation = useNavigation()
        return (
                <>
                        <AppHeader />
                        <View style={styles.container}>
                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                        onPress={() => navigation.navigate("AgentSupPhasePreparationRetourDetailsScreen")}
                                >
                                        <View style={styles.cardDetails}>
                                                <View style={styles.carddetailItem}>
                                                        <View style={styles.cardImages}>
                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                        </View>
                                                        <View style={styles.cardDescription}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                        <View>
                                                                                <Text style={styles.itemVolume}>Folio</Text>
                                                                                <Text>Dossier</Text>
                                                                        </View>
                                                                        <Text>Etapes</Text>
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
})