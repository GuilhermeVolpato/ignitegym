import React, { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { Center, ScrollView, Text, VStack, Skeleton, Heading, useToast } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS785biEGWYfQ3kCbvts_QRuNPn7IJpvovN4A&usqp=CAU");

  const toast = useToast();

  async function handleUserPhotoSelect(){
    setPhotoIsLoading(true);

    try{

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if(photoSelected.canceled){
        return;
      }
      if(photoSelected.assets[0].uri){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
        
        if(photoInfo.size && (photoInfo.size/ 1024 / 1024) > 5){
          return toast.show({
            title: "Imagem maior que o permitido",
            description: 'Envie uma imagem igual ou menor que 5MB',
            placement: 'top',
            bgColor: 'red.500',
          })
          
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }

    
    }catch(error){
      console.log(error);
    }finally{
      setPhotoIsLoading(false);
    }
  }


  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{
                uri: userPhoto,
              }}
              alt="imagem do usuário"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize='md' mt={2} mb={8} >
              Alterar foto
            </Text>
          </TouchableOpacity>
          
          <Input
            placeholder="Nome"
            bg='gray.600'
          />
          <Input
            placeholder="E-mail"
            bg='gray.600'
            isDisabled
          />

        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color='gray.200' fontSize='md' mb={2} fontFamily="heading">
            Alterar senha 
          </Heading>

          <Input
            placeholder="Senha antiga"
            bg='gray.600'
            secureTextEntry
          />
          <Input
            placeholder="Nova senha"
            bg='gray.600'
            secureTextEntry
          />
          <Input
            placeholder="Confirme nova senha"
            bg='gray.600'
            secureTextEntry
          />

          <Button
            title="Atualizar"
            mt={4}
          />
        </VStack>

      </ScrollView>
    </VStack>
  );
}
