import React, {useState} from 'react'
import { VStack, Image, Text, Center, Heading, ScrollView} from 'native-base'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

import { useNavigation} from '@react-navigation/native'

export function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const navigation = useNavigation();

  function handleGoBack(){
    navigation.goBack()
  }

  function handleSignUp(){
    console.log(name, email, password, passwordConfirmation)
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>

      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSvg />
          <Text color='gray.100' fontSize='sm'>
            Treine sua mente e o seu corpo  
          </Text>
        </Center>

        <Center>
          <Heading color='gray.100' fontSize='xl' mb='6' fontFamily='heading'>
            Crie sua conta
          </Heading>

          <Input
            placeholder='Nome'
            onChangeText={setName}
          />

          <Input
            placeholder='E-mail'
            keyboardType='email-address'
            autoCapitalize='none'
            onChangeText={setEmail}
          />

          <Input
            placeholder='Senha'
            secureTextEntry
            onChangeText={setPassword}
          />

          <Input
            placeholder='Confirmar a senha'
            secureTextEntry
            onChangeText={setPasswordConfirmation}
          />

          <Button
            title='Criar e acessar'
            onPress={handleSignUp}
          />

        </Center>


          <Button
            mt={24}
            title='Voltar para o login'
            variant={'outline'}
            onPress={handleGoBack}
          />


      </VStack>

    </ScrollView>
  );
}