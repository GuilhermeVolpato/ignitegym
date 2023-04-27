import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "@services/api";

import {
  storageUserSaver,
  storageUserGet,
  storageUserRemove,
} from "@storage/storageUser";

import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "@storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function userAndTokenUptade(userData: UserDTO, token: string) { // para poder usar a logica em mais de um lugar e
    try {                                                               //passar o token nas requisições (ATUALIZA O TOKEN e usuário)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`; //Token de autenticação anexado nas requisições
      setUser(userData);
      console.log("userData  DA userAndTokenUptade" , userData);
    } catch (error) {
      throw error;
    }
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string){
    try{
      setIsLoadingUserStorageData(true);
      await storageUserSaver(userData);
      await storageAuthTokenSave(token);
    }catch(error){
      throw error;
    }finally{
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token) {
        console.log("user da função signIn ==>", data.user,)
        console.log("token da função signIn ==>", data.token,)
        await storageUserAndTokenSave(data.user, data.token)

        userAndTokenUptade(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      console.log("user da função signOUT ==>", user);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUser() {
    try {
      setIsLoadingUserStorageData(true);
      const userLogged = await storageUserGet(); // busca o usuario no storage, se tiver dado, o usuario ta logado
      const token = await storageAuthTokenGet(); // busca o token no storage, se tiver dado, o usuario ta logado

      if (token && userLogged) {
        userAndTokenUptade(userLogged, token);
        console.log("user da função loadUser ==>", token, userLogged);
      }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, isLoadingUserStorageData, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
