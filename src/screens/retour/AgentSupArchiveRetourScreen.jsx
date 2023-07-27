import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppHeaderAgentSupArchiveRetour from "../../components/app/AppHeaderAgentSupArchiveRetour";

/**
 * Screen pour la listes des volume retourner pour un agent superviseur archive
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 27/7/2023
 * @returns 
 */

export default function AgentSupArchiveRetourScreen(){
        return(
                <>
                <AppHeaderAgentSupArchiveRetour/>
                <View>
                        <Text>AgentSupArchiveRetourScreen</Text>
                </View>
                </>
        )
}

const styles = StyleSheet.create({

})