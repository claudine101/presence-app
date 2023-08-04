import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/volume/AllVolumeScreen";
import VolumePrepareScreen from "../screens/volume/VolumePrepareScreen";
import AgentSupPhasePreparationRetourScreen from "../screens/retour/AgentSupPhasePreparationRetourScreen";
import AllFolioSupAgentScreen from "../screens/chefPlateaux/AllFolioSupAgentScreen";
import { useSelector } from "react-redux";
import { userSelector } from "../store/selectors/userSelector";
import AgentChefPlateauRetourScreen from "../screens/retour/AgentChefPlateauRetourScreen";
import AgentSuperiveurAilleRetourScreen from "../screens/retour/AgentSuperiveurAilleRetourScreen";
import AgentDesarchivagesRetourScreen from "../screens/retour/AgentDesarchivagesRetourScreen";
import AgentSupArchiveRetourScreen from "../screens/retour/AgentSupArchiveRetourScreen";
import AgentDistributionRetourScreen from "../screens/retour/AgentDistributionRetourScreen";
import PROFILS from "../constants/PROFILS";
import IndexationChefEquipeFolioScreen from "../screens/indexation/chefEquipe/IndexationChefEquipeFolioScreen";
import ChefPlateauFlashScreen from "../screens/indexation/chefPlateau/ChefPlateauFlashScreen";
import ChefPlateauFlashRetourScreen from "../screens/indexation/chefPlateau/ChefPlateauFlashRetourScreen";
import ChefPlateauFlashValidesScreen from "../screens/indexation/chefPlateau/ChefPlateauFlashValidesScreen";
import SupFlashRetourScreen from "../screens/indexation/supAile/SupFlashRetourScreen";
import SupFlashScreen from "../screens/indexation/supAile/SupFlashScreen";
import SupFlashValidesScreen from "../screens/indexation/supAile/SupFlashValidesScreen";
import ChefEquipeFlashRetourScreen from "../screens/indexation/chefEquipe/ChefEquipeFlashRetourScreen";
import ChefEquipeFlashValidesScreen from "../screens/indexation/chefEquipe/ChefEquipeFlashValidesScreen";

export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                        {(user.ID_PROFIL == 1) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name='VolumePrepareScreen' component={VolumePrepareScreen} />
                                </>
                                : null}
                         {user.ID_PROFIL == 7 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSuperiveurAilleRetourScreen" component={AgentSuperiveurAilleRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 2 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentDesarchivagesRetourScreen" component={AgentDesarchivagesRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 3 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSupArchiveRetourScreen" component={AgentSupArchiveRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 29 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentDistributionRetourScreen" component={AgentDistributionRetourScreen} />
                                </>
                                : null}
                                {user.ID_PROFIL == PROFILS.CHEF_EQUIPE_INDEXATION ?
                                <>
                                <Drawer.Screen name="IndexationChefEquipeFolioScreen" component={IndexationChefEquipeFolioScreen} />
                                <Drawer.Screen name="ChefEquipeFlashRetourScreen" component={ChefEquipeFlashRetourScreen} />
                                <Drawer.Screen name="ChefEquipeFlashValidesScreen" component={ChefEquipeFlashValidesScreen} />
                                </>
                                : null}
                                {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_INDEXATION ?
                                        <>
                                                <Drawer.Screen name="SupFlashScreen" component={SupFlashScreen} />
                                                <Drawer.Screen name="SupFlashRetourScreen" component={SupFlashRetourScreen} />
                                                <Drawer.Screen name="SupFlashValidesScreen" component={SupFlashValidesScreen} />
                                        </>
                              : null}
                              {user.ID_PROFIL == PROFILS.CHEF_PLATEAU_INDEXATION ?
                                      <>
                                              <Drawer.Screen name="ChefPlateauFlashScreen" component={ChefPlateauFlashScreen} />
                                              <Drawer.Screen name="ChefPlateauFlashRetourScreen" component={ChefPlateauFlashRetourScreen} />
                                              <Drawer.Screen name="ChefPlateauFlashValidesScreen" component={ChefPlateauFlashValidesScreen} />
                                      </>
                            : null}
                        <Drawer.Screen name="AllFolioSupAgentScreen" component={AllFolioSupAgentScreen} />
                        <Drawer.Screen name="AgentSupPhasePreparationRetourScreen" component={AgentSupPhasePreparationRetourScreen} />
                </Drawer.Navigator>
        )
}