import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React, { useState } from 'react'
import ConnexionScreen from '../screens/welcome/ConnexionScreen'

export default function WelcomeNavigator({ showOnBoarding }){
    const Stack = createStackNavigator()
    return (
        <NavigationContainer theme={{colors: { background: "#fff" }}}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="ConnexionScreen" component={ConnexionScreen} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}