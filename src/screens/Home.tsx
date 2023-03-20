import { useState } from 'react';
import { VStack, FlatList, HStack, Heading, Text} from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function Home(){
  const [groupSelected, setGroupSelected] = useState('Costas')
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombros'])
  const [exercises, setExercises] = useState(['Puxada Frontal', 'Remada Curvada', 'Remada Unilateral', 'Levantamento Terra'])

  const navigation= useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(){
    navigation.navigate('Exercise');
  }

  return (
    <VStack flex={1}>
      <HomeHeader/>

      <FlatList
        data={groups}
        keyExtractor={item => item}
        horizontal
        renderItem={({ item }) => (
          <Group 
            name = { item }
            isActive={ String(groupSelected).toLocaleUpperCase() === String(item).toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        _contentContainerStyle={{ px: 8}}
        my={5}
        maxH={10}
        minH={10}
      />

      <VStack flex={1} px={8} mb={5}>
        <HStack justifyContent={'space-between'} mb={5}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>  
        </HStack>

        <FlatList 
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard
              onPress={handleOpenExerciseDetails}
            />
          )}
          _contentContainerStyle={{ paddingBottom: 20}}
        />
      </VStack>

    </VStack>
  );
} 