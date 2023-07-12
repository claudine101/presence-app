import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import NewVolumeScreen from '../screens/volume/NewVolumeScreen';
import AgentArchivageScreen from '../screens/agentArchivages/AgentArchivageScreen';
import AgentSuperviseurScreen from '../screens/agentSuperviseurArchivage/AgentSuperviseurScreen';
import AgentSuperviseurMalleScreen from '../screens/agentSuperviseurArchivage/AgentSuperviseurMalleScreen';

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
            </Stack.Navigator>

        </NavigationContainer>
    )
}