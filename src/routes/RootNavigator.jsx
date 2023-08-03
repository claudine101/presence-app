import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import NewVolumeScreen from '../screens/preparation/NewVolumeScreen';
import DetailsVolumeScreen from '../screens/preparation/DetailsVolumeScreen';
import AddNombreFolioScreen from '../screens/preparation/AddNombreFolioScreen';
import AgentArchivageScreen from '../screens/agentArchivages/AgentArchivageScreen';
import DetaillerFolioScreen from '../screens/preparation/DetaillerFolioScreen';
import AgentSuperviseurMalleScreen from '../screens/agentSuperviseurArchivage/AgentSuperviseurMalleScreen';
import AddSuperviseurAileVolumeScreen from '../screens/preparation/AddSuperviseurAileVolumeScreen';
import AgentChefPlateauScreen from '../screens/chefPlateaux/AgentChefPlateauScreen';
import AddSupervisurPreparationFolioScreen from '../screens/preparation/AddSupervisurPreparationFolioScreen';
import AddAgentPreparationFolioScreen from '../screens/preparation/AddAgentPreparationFolioScreen';
import DetailsAgentPreparationScreen from '../screens/preparation/DetailsAgentPreparationScreen';
import AddDetailsFolioScreen from '../screens/preparation/AddDetailsFolioScreen';
import DetailsFolioScreen from '../screens/preparation/DetailsFolioScreen';
import FolioRetourSuperviseurScreen from '../screens/preparation/FolioRetourSuperviseurScreen';
import VolumeRetourChefPlateau from '../screens/preparation/VolumeRetourChefPlateau';
import VolumeRetourAgentSuperviseur from '../screens/preparation/VolumeRetourAgentSuperviseur';





import VolumeDetailsScreen from '../screens/volume/details/VolumeDetailsScreen';
import AddChefPlateauVolumeScreen from '../screens/preparation/AddChefPlateauVolumeScreen';
import DescriptionEtapeScreen from '../screens/description/DescriptionEtapeScreen';
import DescriptionEtapeSupMailleScreen from '../screens/description/DescriptionEtapeSupMailleScreen';
import AgentSupPhasePreparationRetourDetailsScreen from '../screens/retour/details/AgentSupPhasePreparationRetourDetailsScreen';
import AgentChefPlateauRetourDetailsScreen from '../screens/retour/details/AgentChefPlateauRetourDetailsScreen';
import AgentSuperviseurAilleRetourDetailsScreen from '../screens/retour/details/AgentSuperviseurAilleRetourDetailsScreen';
import AgentDesarchivagesRetourDetailsScreen from '../screens/retour/details/AgentDesarchivagesRetourDetailsScreen';

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
                <Stack.Screen name='NewVolumeScreen' component={NewVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsVolumeScreen' component={DetailsVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddNombreFolioScreen' component={AddNombreFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentArchivageScreen' component={AgentArchivageScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetaillerFolioScreen' component={DetaillerFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentSuperviseurMalleScreen' component={AgentSuperviseurMalleScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddSuperviseurAileVolumeScreen' component={AddSuperviseurAileVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentChefPlateauScreen' component={AgentChefPlateauScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddSupervisurPreparationFolioScreen' component={AddSupervisurPreparationFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddAgentPreparationFolioScreen' component={AddAgentPreparationFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddChefPlateauVolumeScreen' component={AddChefPlateauVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsAgentPreparationScreen' component={DetailsAgentPreparationScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AddDetailsFolioScreen' component={AddDetailsFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsFolioScreen' component={DetailsFolioScreen} options={{ headerShown: false }} />
                <Stack.Screen name='FolioRetourSuperviseurScreen' component={FolioRetourSuperviseurScreen} options={{ headerShown: false }} />
                <Stack.Screen name='VolumeRetourChefPlateau' component={VolumeRetourChefPlateau} options={{ headerShown: false }} />
                <Stack.Screen name='VolumeRetourAgentSuperviseur' component={VolumeRetourAgentSuperviseur} options={{ headerShown: false }} />

                <Stack.Screen name='VolumeDetailsScreen' component={VolumeDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentSupPhasePreparationRetourDetailsScreen' component={AgentSupPhasePreparationRetourDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentChefPlateauRetourDetailsScreen' component={AgentChefPlateauRetourDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentSuperviseurAilleRetourDetailsScreen' component={AgentSuperviseurAilleRetourDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentDesarchivagesRetourDetailsScreen' component={AgentDesarchivagesRetourDetailsScreen} options={{ headerShown: false }} />

                <Stack.Screen name='DescriptionEtapeScreen' component={DescriptionEtapeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DescriptionEtapeSupMailleScreen' component={DescriptionEtapeSupMailleScreen} options={{ headerShown: false }} />

            </Stack.Navigator>

        </NavigationContainer>
    )
}