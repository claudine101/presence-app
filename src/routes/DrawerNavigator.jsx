import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import { useSelector } from "react-redux";
import { userSelector } from "../store/selectors/userSelector";
import AgentSuperiveurAilleRetourScreen from "../screens/retour/AgentSuperiveurAilleRetourScreen";
import AllVolumesRecusScreen from "../screens/scanning/chefEquipe/AllVolumesRecusScreen";
import AllVolumeRecusChefEquiScreen from "../screens/scanning/chefEquipe/AllVolumeRecusChefEquiScreen";

export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                         {user.ID_PROFIL == 9 ?
                                <>
                                        <Drawer.Screen name="AllVolumesRecusScreen" component={AllVolumesRecusScreen} />
                                        <Drawer.Screen name="AgentSuperiveurAilleRetourScreen" component={AgentSuperiveurAilleRetourScreen} />
                                        <Drawer.Screen name="AllVolumeRecusChefEquiScreen" component={AllVolumeRecusChefEquiScreen}/>
                                </>
                                : null}
                </Drawer.Navigator>
        )
}