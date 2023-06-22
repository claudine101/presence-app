import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ShopScreen from "../screens/e-commerce/ShopScreen";
import EcommerceHeader from "../components/ecommerce/main/EcommerceHeader";
// import CourrierScreen from "../screens/courrier/courrierScreen";
import RemettantScreen from "../screens/courrier/RemettantScreen";
import NewRemettantScreen from "../screens/courrier/NewRemettantScreen";
import SocieteScreen from "../screens/courrier/SocieteScreen";
import NewSocieteScreen from "../screens/courrier/NewSocieteScreen";
import TypecourrierScreen from "../screens/courrier/TypecourrierScreen";
import UtisateurScreen from "../screens/courrier/UtisateurScreen";
import DocumentCourrierScreen from "../screens/courrier/DocumentCourrierScreen";
import CourrierScreen from "../screens/courrier/CourrierScreen";
import CourrierScanScreen from "../screens/courrier/CourrierScanScreen";
import CourrierScreen from "../screens/courrier/CourrierScreen";

export default function EcommerceNavigator() {

    const Stack = createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Group screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}>
                <Stack.Group screenOptions={{ headerShown: false, }}>
                    <Stack.Screen name="CourrierScreen" component={CourrierScreen} />
                </Stack.Group>
                {/* <Stack.Screen name="ShopScreen" component={ShopScreen} options={{ 
                                                  headerShown: true,
                                                  header: props => <EcommerceHeader {...props} />

                                        }} /> */}

                                               <Stack.Screen name="RemettantScreen" component={RemettantScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="NewRemettantScreen" component={NewRemettantScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="SocieteScreen" component={SocieteScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="NewSocieteScreen" component={NewSocieteScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="TypecourrierScreen" component={TypecourrierScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="CourrierScreen" component={CourrierScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="DocumentCourrierScreen" component={DocumentCourrierScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="UtisateurScreen" component={UtisateurScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                <Stack.Screen name="CourrierScanScreen" component={CourrierScanScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }} />
                                        
            </Stack.Group>
        </Stack.Navigator>
    )
}