import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import NewVolumeScreen from '../screens/volume/NewVolumeScreen';
import AgentArchivageScreen from '../screens/agentArchivages/AgentArchivageScreen';
import AgentSuperviseurScreen from '../screens/agentSuperviseurArchivage/AgentSuperviseurScreen';
import AgentSuperviseurMalleScreen from '../screens/agentSuperviseurArchivage/AgentSuperviseurMalleScreen';
import AgentSuperviseurAilleScreen from '../screens/agentSuperviseurAilles/AgentSuperviseurAilleScreen';
import AgentChefPlateauScreen from '../screens/chefPlateaux/AgentChefPlateauScreen';
import AgentPreparationScreen from '../screens/chefPlateaux/AgentPreparationScreen';
import AgentSuperviseurFinScreen from '../screens/chefPlateaux/AgentSuperviseurFinScreen';
import VolumeDetailsScreen from '../screens/volume/details/VolumeDetailsScreen';
import AgentSupPlateauScreen from '../screens/agentSuperviseurAilles/AgentSupPlateauScreen';
import DescriptionEtapeScreen from '../screens/description/DescriptionEtapeScreen';
import DescriptionEtapeSupMailleScreen from '../screens/description/DescriptionEtapeSupMailleScreen';
import AgentSupPhasePreparationRetourDetailsScreen from '../screens/retour/details/AgentSupPhasePreparationRetourDetailsScreen';
import AgentChefPlateauRetourDetailsScreen from '../screens/retour/details/AgentChefPlateauRetourDetailsScreen';
import AgentSuperviseurAilleRetourDetailsScreen from '../screens/retour/details/AgentSuperviseurAilleRetourDetailsScreen';
import AgentDesarchivagesRetourDetailsScreen from '../screens/retour/details/AgentDesarchivagesRetourDetailsScreen';
import NewAgentSupAIlleScanScreen from '../screens/scanning/chefEquipe/NewAgentSupAIlleScanScreen';
import NewChefPlateauScreen from '../screens/scanning/agentAileSuperviseur/NewChefPlateauScreen';
import ValideChefEquipeScreen from '../screens/scanning/chefEquipe/ValideChefEquipeScreen';
import NewAgentSupScanScreen from '../screens/scanning/agentAileSuperviseur/NewAgentSupScanScreen';
import NewEquipeScanScreen from '../screens/scanning/agentSuperviseur/NewEquipeScanScreen';
import NewFolioRetourScreen from '../screens/scanning/agentSuperviseur/retour/NewFolioRetourScreen';
import DetailsFolioRetourScreen from '../screens/scanning/agentSuperviseur/retour/DetailsFolioRetourScreen';
import DetailsFolioRetourChefPlateau from '../screens/scanning/agentAileSuperviseur/retour/DetailsFolioRetourChefPlateau';
import ConfimerPvScreen from '../screens/scanning/agentSuperviseur/retourAgSupAille/ConfimerPvScreen';

export default function RootNavigator() {
    const Stack = createStackNavigator()
    return (
        <NavigationContainer
            theme={{
                colors: {
                    background: "#fff",
                },
            }}>
            <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                <Stack.Screen name='Root' component={DrawerNavigator} options={{ headerShown: false }} />
                <Stack.Screen name='NewAgentSupAIlleScanScreen' component={NewAgentSupAIlleScanScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewChefPlateauScreen' component={NewChefPlateauScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='ValideChefEquipeScreen' component={ValideChefEquipeScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewAgentSupScanScreen' component={NewAgentSupScanScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewEquipeScanScreen' component={NewEquipeScanScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewFolioRetourScreen' component={NewFolioRetourScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='DetailsFolioRetourScreen' component={DetailsFolioRetourScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='DetailsFolioRetourChefPlateau' component={DetailsFolioRetourChefPlateau} options={{ headerShown: false }}/>
                <Stack.Screen name='ConfimerPvScreen' component={ConfimerPvScreen} options={{ headerShown: false }}/>
            </Stack.Navigator>

        </NavigationContainer>
    )
}