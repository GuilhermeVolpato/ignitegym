import {
  Center,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Box,
  ScrollView,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParams = {
  exerciseId: string;
}

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true);
  const [sendingResgister, setSendingResgister] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { exerciseId } = route.params as RouteParams;

  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  const toast = useToast();

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails(){
    try{
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
      console.log("fetchExerciseDetails",response.data);
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }finally{
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryReister(){
    try{
      setSendingResgister(true);

      await api.post('/history', { exercise_id: exerciseId });
      toast.show({
        title: 'Exercício registrado com sucesso',
        placement: 'top',
        bgColor: 'green.700',
      });

      navigation.navigate('History');
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }finally{
      setSendingResgister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading color="gray.100" fontSize="lg" flexShrink={1} fontFamily="heading">
            {exercise.name}
          </Heading>

          <HStack>
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        {
          isLoading ? <Loading/> :
          <VStack p={8}>
            <Box rounded={'lg'} mb={3} overflow={'hidden'}>
              <Image
                alt={`Imagem do exercício ${exercise.name}`}
                h={80}
                w="full"
                resizeMode="cover"
                rounded="lg"
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
              />
            </Box>
            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb={6}
                mt={5}
              >
                <HStack>
                  <SeriesSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button 
                title="Marcar como realizado" 
                isLoading={sendingResgister}
                onPress={handleExerciseHistoryReister}
              />
            </Box>
          </VStack>
        }
      </ScrollView>
    </VStack>
  );
}
