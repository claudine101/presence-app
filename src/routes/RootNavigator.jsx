import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import SelectFlashAgentSupScreen from '../screens/indexation/chefEquipe/SelectFlashAgentSupScreen';
import SelectChefPlateauScreen from '../screens/indexation/supAile/SelectChefPlateauScreen';
import SelectAgentIndexationScreen from '../screens/indexation/chefPlateau/SelectAgentIndexationScreen';
import ChefEquipeFlashDetailScreen from '../screens/indexation/chefEquipe/ChefEquipeFlashDetailScreen';
import NewVolumeScreen from '../screens/preparation/NewVolumeScreen';
import DetailsVolumeScreen from '../screens/preparation/DetailsVolumeScreen';
import AddNombreFolioScreen from '../screens/preparation/AddNombreFolioScreen';
import DetaillerFolioScreen from '../screens/preparation/DetaillerFolioScreen';
import AddSuperviseurAileVolumeScreen from '../screens/preparation/AddSuperviseurAileVolumeScreen';
import AddSupervisurPreparationFolioScreen from '../screens/preparation/AddSupervisurPreparationFolioScreen';
import AddAgentPreparationFolioScreen from '../screens/preparation/AddAgentPreparationFolioScreen';
import AddDetailsFolioScreen from '../screens/preparation/AddDetailsFolioScreen';
import DetailsFolioScreen from '../screens/preparation/DetailsFolioScreen';
import FolioRetourSuperviseurScreen from '../screens/preparation/FolioRetourSuperviseurScreen';
import VolumeRetourChefPlateau from '../screens/preparation/VolumeRetourChefPlateau';
import VolumeRetourAgentSuperviseur from '../screens/preparation/VolumeRetourAgentSuperviseur';
import AddChefPlateauVolumeScreen from '../screens/preparation/AddChefPlateauVolumeScreen';
import DescriptionEtapeScreen from '../screens/preparation/DescriptionEtapeScreen';
import NewAgentSupAIlleScanScreen from '../screens/scanning/chefEquipe/NewAgentSupAIlleScanScreen';
import NewChefPlateauScreen from '../screens/scanning/agentAileSuperviseur/NewChefPlateauScreen';
import ValideChefEquipeScreen from '../screens/scanning/chefEquipe/ValideChefEquipeScreen';
import NewAgentSupScanScreen from '../screens/scanning/agentAileSuperviseur/NewAgentSupScanScreen';
import NewEquipeScanScreen from '../screens/scanning/agentSuperviseur/NewEquipeScanScreen';
import NewFolioRetourScreen from '../screens/scanning/agentSuperviseur/retour/NewFolioRetourScreen';
import DetailsFolioRetourScreen from '../screens/scanning/agentSuperviseur/retour/DetailsFolioRetourScreen';
import DetailsFolioRetourChefPlateau from '../screens/scanning/agentAileSuperviseur/retour/DetailsFolioRetourChefPlateau';
import ConfimerPvScreen from '../screens/scanning/agentSuperviseur/retourAgSupAille/ConfimerPvScreen';
import ConfirmerPvRetourAgentDistrScreen from '../screens/scanning/agentSuperviseur/retourAgSupAille/ConfirmerPvRetourAgentDistrScreen';
import ConfirmerPvRetourAgentSupArchives from '../screens/scanning/agentSuperviseur/retourAgSupAille/ConfirmerPvRetourAgentSupArchives';
import ConfirmerPvRetourAgentDesarchivages from '../screens/scanning/agentSuperviseur/retourAgSupAille/ConfirmerPvRetourAgentDesarchivages';

export default function RootNavigator() {
    const Stack = createStackNavigator()
    return (
        <NavigationContainer
            theme={{
                colors: {
                    background: "#E1EAF3",
                },
            }}>
            <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                <Stack.Screen name='Root' component={DrawerNavigator} options={{ headerShown: false }} />
                <Stack.Screen name='NewVolumeScreen' component={NewVolumeScreen} options={{ headerShown: false }} />

                <Stack.Screen name='DescriptionEtapeScreen' component={DescriptionEtapeScreen} options={{ headerShown: false }}/>

                {/* indexation */}
                <Stack.Screen name='SelectFlashAgentSupScreen' component={SelectFlashAgentSupScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='SelectChefPlateauScreen' component={SelectChefPlateauScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='SelectAgentIndexationScreen' component={SelectAgentIndexationScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='ChefEquipeFlashDetailScreen' component={ChefEquipeFlashDetailScreen} options={{ headerShown: false }}/>

                <Stack.Screen name='DetailsVolumeScreen' component={DetailsVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddNombreFolioScreen' component={AddNombreFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetaillerFolioScreen' component={DetaillerFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddSuperviseurAileVolumeScreen' component={AddSuperviseurAileVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddSupervisurPreparationFolioScreen' component={AddSupervisurPreparationFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddAgentPreparationFolioScreen' component={AddAgentPreparationFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddChefPlateauVolumeScreen' component={AddChefPlateauVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddDetailsFolioScreen' component={AddDetailsFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsFolioScreen' component={DetailsFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='FolioRetourSuperviseurScreen' component={FolioRetourSuperviseurScreen} options={{ headerShown: false }} />
                <Stack.Screen name='VolumeRetourChefPlateau' component={VolumeRetourChefPlateau} options={{ headerShown: false }} />
                <Stack.Screen name='VolumeRetourAgentSuperviseur' component={VolumeRetourAgentSuperviseur} options={{ headerShown: false }} />
                <Stack.Screen name='NewAgentSupAIlleScanScreen' component={NewAgentSupAIlleScanScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewChefPlateauScreen' component={NewChefPlateauScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='ValideChefEquipeScreen' component={ValideChefEquipeScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewAgentSupScanScreen' component={NewAgentSupScanScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewEquipeScanScreen' component={NewEquipeScanScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='NewFolioRetourScreen' component={NewFolioRetourScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='DetailsFolioRetourScreen' component={DetailsFolioRetourScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='DetailsFolioRetourChefPlateau' component={DetailsFolioRetourChefPlateau} options={{ headerShown: false }}/>
                <Stack.Screen name='ConfimerPvScreen' component={ConfimerPvScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='ConfirmerPvRetourAgentDistrScreen' component={ConfirmerPvRetourAgentDistrScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='ConfirmerPvRetourAgentSupArchives' component={ConfirmerPvRetourAgentSupArchives} options={{ headerShown: false }}/>
                <Stack.Screen name='ConfirmerPvRetourAgentDesarchivages' component={ConfirmerPvRetourAgentDesarchivages} options={{ headerShown: false }}/>
            </Stack.Navigator>

        </NavigationContainer>
    )
}