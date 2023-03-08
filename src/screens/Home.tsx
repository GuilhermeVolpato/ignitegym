import { useState } from 'react';
import { VStack, FlatList, HStack, Heading, Text} from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from '@components/ExerciseCard';

export function Home(){
  const [groupSelected, setGroupSelected] = useState('Costas')
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombros'])
  const [exercises, setExercises] = useState(['Puxada Frontal', 'Remada Curvada', 'Remada Unilateral', 'Levantamento Terra'])

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
      />

      <VStack flex={1} px={8} mb={5}>
        <HStack justifyContent={'space-between'}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>  
        </HStack>

        <ExerciseCard/>

        <FlatList 
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard/>
          )}
          _contentContainerStyle={{ paddingBottom: 20}}
        />
      </VStack>

    </VStack>
  );
} 