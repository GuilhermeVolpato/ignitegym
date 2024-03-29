import React, { useState } from "react";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import { api } from '@services/api';
import { AppError } from "@utils/AppError";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o email").email("E-mail inválido"),
  password: yup.string().required("Informe a senha").min(6, "A senha deve ter pelo menos 6 digitos"),
  password_confirm: yup.string().required("Informe a confirmação da senha").oneOf([yup.ref('password')], 'As senhas não conferem')
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const {signIn} = useAuth();
  const toast = useToast();

  const { control, handleSubmit, formState:{errors} } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({name, email, password}: FormDataProps) {
    try{
      setIsLoading(true);
      await api.post('/users', { name, email, password });
      await signIn(email, password);
    }catch(error){
      setIsLoading(false);
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }

    // fetch('http://192.168.0.83:3333/users',{
    //   method: 'POST',
    //   headers:{
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, email, password })
    // })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb="6" fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Nome" 
                onChangeText={onChange} 
                value={value} 
                errorMesage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMesage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMesage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMesage={errors.password_confirm?.message}
              />
            )}
          />

          <Button 
            title="Criar e acessar" 
            onPress={handleSubmit(handleSignUp)} 
            isLoading={isLoading}
          />
        </Center>

        <Button
          mt={12}
          title="Voltar para o login"
          variant={"outline"}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
