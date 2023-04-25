import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { AppError } from "../../utils/AppError";
import { useToast } from "native-base";
import {
  Form,
  Input,
  Footer,
  Container,
  Touchable,
  TextInput,
  InputLabel,
  SafeAreaView,
  TouchableLabel,
} from "./styles";

import { Colors } from "../../visuals/colors";

import {
  storageApiUrlSaver,
  storageApiUrlRemove,
} from "../../storage/storageApiUrl";

import axios from "axios";
import { api } from "../../services/api";

export default function Access({ navigation }) {
  const [form, setForm] = useState({
    url: "",
    port: "",
  });
  const [baseUrl, setBaseUrl] = useState<string>("");
  const toast = useToast();

  async function getBaseUrl(url: string, port: string) {
    await storageApiUrlRemove();
    const testUrl = `${form.url}:${form.port}`;
    setBaseUrl(testUrl);
    const resposta = await axios
      .get(testUrl)
      .then((response) => {
        storageApiUrlSaver(testUrl);
        toast.show({
          title: "Conexão estabelecida com sucesso!",
          placement: "top",
          bgColor: "green.500",
          duration: 500,
          id: 2,
        });
      })
      .catch((error) => {
        console.log("Erro ao estabelecer conexão!", error);
        const isAppError = error instanceof AppError;
        const title = isAppError
          ? error.message
          : "Erro ao estabelecer conexão!";
        toast.show({
          title,
          placement: "top",
          bgColor: "red.500",
          duration: 2000,
          id: 1,
        });
        return;
      });

    // if(resposta.status === 200){
    //   console.log("Conexão estabelecida com sucesso!", baseUrl)
    //   await storageApiUrlSaver(testUrl);
    // }
  }

  async function handleGoBack() {
    await getBaseUrl(form.url, form.port);
    navigation.navigate("Sair");
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <Container>
        <ScrollView>
          <Form>
            <Input>
              <InputLabel>Endereço</InputLabel>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(url) => setForm({ ...form, url })}
                placeholder="Exemplo: http://portal.ema.net.br"
                placeholderTextColor={Colors.lightGray}
                style={{ backgroundColor: Colors.lightBackground }}
                value={form.url}
              />
            </Input>
            <Input>
              <InputLabel>Porta</InputLabel>
              <TextInput
                autoCorrect={false}
                keyboardType="numeric"
                textContentType="telephoneNumber"
                onChangeText={(port) => setForm({ ...form, port })}
                placeholder="Exemplo: 80"
                maxLength={5}
                placeholderTextColor={Colors.lightGray}
                style={{ backgroundColor: Colors.lightBackground }}
                value={form.port}
              />
            </Input>
            <Touchable
              onPress={() => {
                navigation.navigate("Sair");
              }}
              style={{
                backgroundColor: Colors.primary,
                alignSelf: "flex-end",
                width: "44%",
                height: "18%",
              }}
            >
              <TouchableLabel
                style={{ color: Colors.background, fontSize: 10 }}
                onPress={() => {
                  getBaseUrl(form.url, form.port);
                }}
              >
                {"Testar conexão"}
              </TouchableLabel>
            </Touchable>
          </Form>
        </ScrollView>
      </Container>
      <Footer>
        <Touchable
          onPress={() => {
            handleGoBack();
          }}
          style={{ backgroundColor: Colors.primary }}
        >
          <TouchableLabel style={{ color: Colors.background }}>
            {"Salvar"}
          </TouchableLabel>
        </Touchable>
      </Footer>
    </SafeAreaView>
  );
}
