import { useState, useEffect, useCallback, } from 'react';
import { VStack, FlatList, HStack, Heading, Text, useToast} from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

export function Home(){
  const [groupSelected, setGroupSelected] = useState('Costas')
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])

  const toast = useToast();
  const navigation= useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(){
    navigation.navigate('Exercise');
  }

  async function fetchGroups(){
    try{
      const response = await api.get('/groups');
      setGroups(response.data);
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function fetchExercisesByGroup(){
    try{
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(useCallback(()=> {
    fetchExercisesByGroup();
  },[groupSelected]))

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
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExerciseCard
              onPress={handleOpenExerciseDetails}
              data={item}
            />
          )}
          _contentContainerStyle={{ paddingBottom: 20}}
        />
      </VStack>

    </VStack>
  );
} 