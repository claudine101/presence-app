import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Le screen pour aider le distributeur a renger les males dans le batiments
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AgentSuperviseurAilleScreen(){
        const navigation = useNavigation()
        return(
                <View style={styles.container}>
                        <View style={styles.cardHeader}>
                                <TouchableNativeFeedback
                                        onPress={() => navigation.goBack()}
                                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                        <View style={styles.backBtn}>
                                                <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                        </View>
                                </TouchableNativeFeedback>
                                <Text style={styles.titlePrincipal}>Detailler par le distributeur</Text>
                        </View>
                        <Text>AgentDistributeurScreen</Text>
                </View>
        )
}

const styles = StyleSheet.create({

})