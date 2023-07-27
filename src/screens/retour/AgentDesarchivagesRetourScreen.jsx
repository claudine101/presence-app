import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppHeaderAgentDesarchivageRetour from "../../components/app/AppHeaderAgentDesarchivageRetour";
import { useNavigation } from "@react-navigation/native";

/**
 * Screen pour la listes des volume retourner pour un agent desarchivages
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 27/7/2023
 * @returns 
 */

export default function AgentDesarchivagesRetourScreen(){
        const navigation = useNavigation()
        return(
                <>
                <AppHeaderAgentDesarchivageRetour/>
                <View>
                        <Text>AgentDesarchivagesRetourScreen</Text>
                </View>
                </>
        )
}

const styles = StyleSheet.create({

})