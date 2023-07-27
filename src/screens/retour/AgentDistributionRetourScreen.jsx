import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppHeaderAgentDistributeurRetour from "../../components/app/AppHeaderAgentDistributeurRetour";

/**
 * Screen pour la listes des volume retourner pour un agent distributeur
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 27/7/2023
 * @returns 
 */

export default function AgentDistributionRetourScreen(){
        return(
                <>
                <AppHeaderAgentDistributeurRetour/>
                <View>
                        <Text>AgentDistributionRetourScreen</Text>
                </View>
                </>
        )
}

const styles = StyleSheet.create({

})