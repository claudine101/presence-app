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
import SelectFlashAgentSupScreen from '../screens/indexation/chefEquipe/SelectFlashAgentSupScreen';
import SelectChefPlateauScreen from '../screens/indexation/supAile/SelectChefPlateauScreen';
import SelectAgentIndexationScreen from '../screens/indexation/chefPlateau/SelectAgentIndexationScreen';
import ChefEquipeFlashDetailScreen from '../screens/indexation/chefEquipe/ChefEquipeFlashDetailScreen';

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
                <Stack.Screen name='AgentArchivageScreen' component={AgentArchivageScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurScreen' component={AgentSuperviseurScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurMalleScreen' component={AgentSuperviseurMalleScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurAilleScreen' component={AgentSuperviseurAilleScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentChefPlateauScreen' component={AgentChefPlateauScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentPreparationScreen' component={AgentPreparationScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurFinScreen' component={AgentSuperviseurFinScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSupPlateauScreen' component={AgentSupPlateauScreen} options={{ headerShown: false }}/>

                <Stack.Screen name='VolumeDetailsScreen' component={VolumeDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSupPhasePreparationRetourDetailsScreen' component={AgentSupPhasePreparationRetourDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentChefPlateauRetourDetailsScreen' component={AgentChefPlateauRetourDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurAilleRetourDetailsScreen' component={AgentSuperviseurAilleRetourDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentDesarchivagesRetourDetailsScreen' component={AgentDesarchivagesRetourDetailsScreen} options={{ headerShown: false }}/>

                <Stack.Screen name='DescriptionEtapeScreen' component={DescriptionEtapeScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='DescriptionEtapeSupMailleScreen' component={DescriptionEtapeSupMailleScreen} options={{ headerShown: false }}/>

                {/* indexation */}
                <Stack.Screen name='SelectFlashAgentSupScreen' component={SelectFlashAgentSupScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='SelectChefPlateauScreen' component={SelectChefPlateauScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='SelectAgentIndexationScreen' component={SelectAgentIndexationScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='ChefEquipeFlashDetailScreen' component={ChefEquipeFlashDetailScreen} options={{ headerShown: false }}/>
                
            </Stack.Navigator>

        </NavigationContainer>
    )
}