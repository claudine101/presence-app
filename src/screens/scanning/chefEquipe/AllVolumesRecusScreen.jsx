import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import AppHeader from "../../../components/app/AppHeader";
import { COLORS } from "../../../styles/COLORS";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


/**
 * Screen pour la listes des volume planifier pour vous
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/8/2023
 * @returns 
 */

export default function AllVolumesRecusScreen() {
        const navigation = useNavigation()
        return (
                <>
                        <AppHeader />
                        <View style={styles.container}>
                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} 
                                        onPress={()=>navigation.navigate("NewChefPlateauScreen")}
                                >
                                        <View style={styles.cardDetails}>
                                                <View style={styles.carddetailItem}>
                                                        <View style={styles.cardImages}>
                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                        </View>
                                                        <View style={styles.cardDescription}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                        <View>
                                                                                <Text style={styles.itemVolume}>eehhdehdh</Text>
                                                                                {/* <Text>{volume.CODE_VOLUME}</Text> */}
                                                                        </View>
                                                                        <Text>12/12/2023</Text>
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
})