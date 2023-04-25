import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig";

export async function storageAuthTokenSave(token: string){ //salvar token do usuário
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, token);
}

export async function storageAuthTokenGet(){ //buscar token do usuário
  const token = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

  return token;
}

export async function storageAuthTokenRemove(){ //remover token do usuário
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}