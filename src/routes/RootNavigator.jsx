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
import DossierArchivageDetailsScreen from '../screens/agentArchivages/details/DossierArchivageDetailsScreen';
import FolioNatureSupDetailsScreen from '../screens/agentSuperviseurArchivage/details/FolioNatureSupDetailsScreen';

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
                <Stack.Screen name='AgentArchivageScreen' component={AgentArchivageScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurScreen' component={AgentSuperviseurScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurMalleScreen' component={AgentSuperviseurMalleScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurAilleScreen' component={AgentSuperviseurAilleScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentChefPlateauScreen' component={AgentChefPlateauScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentPreparationScreen' component={AgentPreparationScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='AgentSuperviseurFinScreen' component={AgentSuperviseurFinScreen} options={{ headerShown: false }}/>

                <Stack.Screen name='VolumeDetailsScreen' component={VolumeDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='DossierArchivageDetailsScreen' component={DossierArchivageDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name='FolioNatureSupDetailsScreen' component={FolioNatureSupDetailsScreen} options={{ headerShown: false }}/>
            </Stack.Navigator>

        </NavigationContainer>
    )
}