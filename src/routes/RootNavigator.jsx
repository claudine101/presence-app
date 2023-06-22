import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';

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
            </Stack.Navigator>

        </NavigationContainer>
    )
}