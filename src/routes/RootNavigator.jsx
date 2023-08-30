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
import DetailsAgentPreparationScreen from '../screens/preparation/DetailsAgentPreparationScreen';
import AllVolumeChefPlateauScreen from '../screens/preparation/AllVolumeChefPlateauScreen';
import ChefPlatauRetourScreen from '../screens/preparation/ChefPlatauRetourScreen';

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
import DetaillerVolumeScreen from '../screens/preparation/DetaillerVolumeScreen';
import FolioPrepareDetailScreen from '../screens/preparation/FolioPrepareDetailScreen';
import AgentSuperviseurValideDetailScreen from '../screens/preparation/AgentSuperviseurValideDetailScreen';
import ChefPlatauValideDetailsScreen from '../screens/preparation/ChefPlatauValideDetailsScreen';


{/* phase uploadEDRMS */ }
import SelectFolioAgentScreen from '../screens/uploadEDRMS/chefEquipe/SelectFolioAgentScreen';
import ChefEquipeFlashDetailsScreen from '../screens/uploadEDRMS/chefEquipe/ChefEquipeFlashDetailsScreen';
import DetailleFlashScreen from '../screens/uploadEDRMS/agentUpload/DetailleFlashScreen';
import DetailsFolioFlashScreen from '../screens/uploadEDRMS/agentUpload/DetailsFolioFlashScreen';
import DetailsFolioUploadScreen from '../screens/uploadEDRMS/agentUpload/DetailsFolioUploadScreen';
import DetailsUploadScreen from '../screens/uploadEDRMS/verificateur/DetailsUploadScreen';
import FolioEnregistreScreen from '../screens/uploadEDRMS/verificateur/FolioEnregistreScreen';
import FolioNoEnregistreScreen from '../screens/uploadEDRMS/verificateur/FolioNoEnregistreScreen';
import ChefEquipeDetailsFlashUploadScreen from '../screens/uploadEDRMS/chefEquipe/ChefEquipeDetailsFlashUploadScreen';
import DetailValideScreen from '../screens/uploadEDRMS/chefEquipe/DetailValideScreen';
import DetailIsUploadScreen from '../screens/uploadEDRMS/chefEquipe/DetailValideScreen';

import DetailsParAgentClickVolumeScreen from '../screens/scanning/agentSuperviseur/detailClikAgentAileSup/DetailsParAgentClickVolumeScreen';
import FoliosRetourdetailChefPlateauScreen from '../screens/scanning/agentSuperviseur/retour/FoliosRetourdetailChefPlateauScreen';
import DetailsClickAgentDistributeurVolumeScreen from '../screens/scanning/agentSuperviseur/detailClikAgentAileSup/DetailsClickAgentDistributeurVolumeScreen';
import DetailsClickAgentSupArchiveVolumeScreen from '../screens/scanning/agentSuperviseur/detailClikAgentAileSup/DetailsClickAgentSupArchiveVolumeScreen';
import DetailsAgentDesarchivagesVolumeScreen from '../screens/scanning/agentSuperviseur/detailClikAgentAileSup/DetailsAgentDesarchivagesVolumeScreen';
import DetailsEquipeFoliosTraiteScreen from '../screens/scanning/agentSuperviseur/retour/DetailsEquipeFoliosTraiteScreen';
import DetailsVolumeChefPlateauTraitesScreen from '../screens/scanning/agentSuperviseur/retour/DetailsVolumeChefPlateauTraitesScreen';
import DetailsSupAilleScanTraiteVolumeScreen from '../screens/scanning/agentSuperviseur/retour/DetailsSupAilleScanTraiteVolumeScreen';
import DetailsVolumeChefEquipScanTraiteScreen from '../screens/scanning/agentSuperviseur/retour/DetailsVolumeChefEquipScanTraiteScreen';
import DetailsVolumeAgentDistributeurTraiteScreen from '../screens/scanning/agentSuperviseur/retour/DetailsVolumeAgentDistributeurTraiteScreen';
import DetailsVolumeAgentArchivesTraiteScreen from '../screens/scanning/agentSuperviseur/retour/DetailsVolumeAgentArchivesTraiteScreen';
import DetailVolumeSuperviserScreen from '../screens/preparation/DetailVolumeSuperviserScreen';
import DetailsChefEquipePrepTraiteVolumeScreen from '../screens/scanning/agentSuperviseur/retour/DetailsChefEquipePrepTraiteVolumeScreen';


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
                <Stack.Screen name='AllVolumeChefPlateauScreen' component={AllVolumeChefPlateauScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DescriptionEtapeScreen' component={DescriptionEtapeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ChefPlatauRetourScreen' component={ChefPlatauRetourScreen} options={{ headerShown: false }} />
                <Stack.Screen name='FolioPrepareDetailScreen' component={FolioPrepareDetailScreen} options={{ headerShown: false }} />
                <Stack.Screen name='AgentSuperviseurValideDetailScreen' component={AgentSuperviseurValideDetailScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ChefPlatauValideDetailsScreen' component={ChefPlatauValideDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailVolumeSuperviserScreen' component={DetailVolumeSuperviserScreen} options={{ headerShown: false }} />
                
                
                {/* indexation */}
                <Stack.Screen name='SelectFlashAgentSupScreen' component={SelectFlashAgentSupScreen} options={{ headerShown: false }} />
                <Stack.Screen name='SelectChefPlateauScreen' component={SelectChefPlateauScreen} options={{ headerShown: false }} />
                <Stack.Screen name='SelectAgentIndexationScreen' component={SelectAgentIndexationScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ChefEquipeFlashDetailScreen' component={ChefEquipeFlashDetailScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsAgentPreparationScreen' component={DetailsAgentPreparationScreen} options={{ headerShown: false }} />
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
                <Stack.Screen name='NewAgentSupAIlleScanScreen' component={NewAgentSupAIlleScanScreen} options={{ headerShown: false }} />
                <Stack.Screen name='NewChefPlateauScreen' component={NewChefPlateauScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ValideChefEquipeScreen' component={ValideChefEquipeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='NewAgentSupScanScreen' component={NewAgentSupScanScreen} options={{ headerShown: false }} />
                <Stack.Screen name='NewEquipeScanScreen' component={NewEquipeScanScreen} options={{ headerShown: false }} />
                <Stack.Screen name='NewFolioRetourScreen' component={NewFolioRetourScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsFolioRetourScreen' component={DetailsFolioRetourScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsEquipeFoliosTraiteScreen' component={DetailsEquipeFoliosTraiteScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsVolumeChefPlateauTraitesScreen' component={DetailsVolumeChefPlateauTraitesScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsSupAilleScanTraiteVolumeScreen' component={DetailsSupAilleScanTraiteVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsVolumeChefEquipScanTraiteScreen' component={DetailsVolumeChefEquipScanTraiteScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsVolumeAgentDistributeurTraiteScreen' component={DetailsVolumeAgentDistributeurTraiteScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsVolumeAgentArchivesTraiteScreen' component={DetailsVolumeAgentArchivesTraiteScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsChefEquipePrepTraiteVolumeScreen' component={DetailsChefEquipePrepTraiteVolumeScreen} options={{ headerShown: false }} />


                <Stack.Screen name='DetailsFolioRetourChefPlateau' component={DetailsFolioRetourChefPlateau} options={{ headerShown: false }} />
                <Stack.Screen name='ConfimerPvScreen' component={ConfimerPvScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsParAgentClickVolumeScreen' component={DetailsParAgentClickVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsClickAgentDistributeurVolumeScreen' component={DetailsClickAgentDistributeurVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsClickAgentSupArchiveVolumeScreen' component={DetailsClickAgentSupArchiveVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsAgentDesarchivagesVolumeScreen' component={DetailsAgentDesarchivagesVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ConfirmerPvRetourAgentDistrScreen' component={ConfirmerPvRetourAgentDistrScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ConfirmerPvRetourAgentSupArchives' component={ConfirmerPvRetourAgentSupArchives} options={{ headerShown: false }} />
                <Stack.Screen name='ConfirmerPvRetourAgentDesarchivages' component={ConfirmerPvRetourAgentDesarchivages} options={{ headerShown: false }} />
                <Stack.Screen name='DetaillerVolumeScreen' component={DetaillerVolumeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='FoliosRetourdetailChefPlateauScreen' component={FoliosRetourdetailChefPlateauScreen} options={{ headerShown: false }} />
                {/* phase uploadEDRMS */}
                <Stack.Screen name='SelectFolioAgentScreen' component={SelectFolioAgentScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ChefEquipeFlashDetailsScreen' component={ChefEquipeFlashDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailleFlashScreen' component={DetailleFlashScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsFolioFlashScreen' component={DetailsFolioFlashScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsFolioUploadScreen' component={DetailsFolioUploadScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsUploadScreen' component={DetailsUploadScreen} options={{ headerShown: false }} />
                <Stack.Screen name='FolioEnregistreScreen' component={FolioEnregistreScreen} options={{ headerShown: false }} />
                <Stack.Screen name='FolioNoEnregistreScreen' component={FolioNoEnregistreScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ChefEquipeDetailsFlashUploadScreen' component={ChefEquipeDetailsFlashUploadScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailValideScreen' component={DetailValideScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailIsUploadScreen' component={DetailIsUploadScreen} options={{ headerShown: false }} />
                <Stack.Screen name='DetailsIploadFlashScreen' component={DetailIsUploadScreen} options={{ headerShown: false }} />
               
                
            </Stack.Navigator>

        </NavigationContainer>
    )
}