import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native'

import { StatusBar } from 'expo-status-bar';
import { Client, Databases, Query, ID } from "react-native-appwrite";

export default function App() {
  const navigation = useNavigation();
  const [isButtonPlusEnabled, setIsButtonPlusEnabled] = useState(true);
  const [isButtonMinusEnabled, setIsButtonMinusEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [contador, setContador] = useState(0);
  const [countList, setCountList] = useState([]);
  const [userName, setUserName] = useState('');
  const [maquina, setMaquina] = useState('');

  const appWriteURL = process.env.EXPO_PUBLIC_APPWRITE_URL;
  const appWriteProjectID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
  const appWriteDatabaseID = process.env.EXPO_PUBLIC_DATABASE_ID;
  const appWriteCollectionID = process.env.EXPO_PUBLIC_COLLECTION_CONTADOR_ID;

  const client = new Client()
    .setEndpoint(appWriteURL)
    .setProject(appWriteProjectID);
  const databases = new Databases(client);

  const fetchData = async () => {
    try {
      let user = await AsyncStorage.getItem('userName');
      let machine = await AsyncStorage.getItem('maquina');
      fetchCounter();
      if (user !== null && machine !== null) {
        setUserName(user)
        setMaquina(machine)
      }
    } catch (e) {
      console.error('Erro ao buscar Informacoes]');
      throw new Error('Falha ao buscar Informacoes.');
    } 

  }

  async function fetchCounter() {
    try {
      const response = await databases.listDocuments(
        appWriteDatabaseID,
        appWriteCollectionID,
        [
          Query.equal('Usuario', [userName]),
          Query.equal("Maquina", [maquina]),
          Query.equal("Ativo", [true]),

        ]
      );

      const listaContador = response.documents.map(function (resp) {
        return {
          $id: resp.$id,
          Data: resp.Data,
          Usuario: resp.Usuario,
          Maquina: resp.Maquina,
          Contador: resp.Contador,
          Ativo: resp.Ativo
        };
      });

      if (response.total > 0) {
        setContador(response.documents[0].Contador)
        setCountList(listaContador[0]);
      } else {
        setContador(0);
      }
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
      throw new Error('Falha ao buscar contadores ');
    } 
  }

  async function add(novoContador: number) {
    setIsButtonPlusEnabled(false);
    setTimeout(() => {
      setIsButtonPlusEnabled(true);
    }, 1000);
    if (novoContador > 1) {
      try {
        const response = await databases.updateDocument(
          appWriteDatabaseID,
          appWriteCollectionID,
          countList.$id,
          {
            "Contador": novoContador
          }
        );
        setContador(novoContador);
        fetchCounter();

      } catch (error) {
        console.error('Erro ao salvar' + error);
        throw new Error('Falha ao salvar.');
      }
    } else {
      try {
        const response = await databases.createDocument(
          appWriteDatabaseID,
          appWriteCollectionID,
          ID.unique(),
          {
            "Data": new Date(),
            "Usuario": userName,
            "Maquina": maquina,
            "Contador": novoContador
          }
        );
        setContador(novoContador);
        setCountList(response)


      } catch (error) {
        console.error('Erro ao salvar' + error);
        throw new Error('Falha ao salvar.' + error);
      }
    }
  }
  async function subtrai(novoContador: number) {
    setIsButtonMinusEnabled(false);
    setTimeout(() => {
      setIsButtonMinusEnabled(true);
    }, 1000);
    if (novoContador < 1) {
      alert("Para Resetar o contador Finalize a atividade atual")
    } else {
      try {
        const response = await databases.updateDocument(
          appWriteDatabaseID,
          appWriteCollectionID,
          countList.$id,
          {
            "Contador": novoContador
          }
        );
        setContador(novoContador);
        fetchCounter();

      } catch (error) {
        console.error('Erro ao salvar' + error);
        throw new Error('Falha ao salvar.');
      }
      setContador(novoContador);
    }

  }

  async function finalizar(novoContador: number) {
    if (novoContador < 1) {
      alert("Não é possîvel finalizar")
    } else {
      try {
        const response = await databases.updateDocument(
          appWriteDatabaseID,
          appWriteCollectionID,
          countList.$id,
          {
            "Ativo": false
          }
        );
        setContador(0);
        fetchCounter();
      } catch (error) {
        console.error('Erro ao salvar' + error);
        throw new Error('Falha ao salvar.');
      } 
    }
  }

  const sair = () => {
    if (contador > 0) {
      Alert.alert(
        'Alerta',
        'Você não Finalizou seu Trabalho, Deseja continuar?',
        [
          {
            text: 'Não',
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: () => navigation.navigate('Welcome'),
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.navigate('Welcome')
    }


  };

  React.useEffect(() => {
    setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    fetchData();
  }, [userName, maquina, contador]);


  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor='transparent' />
      <View style={styles.fieldContainer}>
        <Text style={styles.user}>Nome: {userName}</Text>
        <Text style={styles.user}>Perfil: {maquina}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00a0db" style={styles.loader} />
      ) : (
        <View>
          {contador ? 
          <View style={styles.textContainer}>
            <Text style={styles.text}>{contador}</Text>
          </View> 
          : 
          <View style={styles.textContainer}>
            <Text style={styles.text}>{contador}</Text>
          </View> 
          }
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={!isButtonMinusEnabled}
          onPress={() => subtrai(contador - 1)}
          style={[styles.button, styles.decreaseButton]}>
          <Text style={styles.decreaseText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isButtonPlusEnabled}
          onPress={() => add(contador + 1)}
          style={[styles.button, styles.increaseButton]}>
          <Text style={styles.increaseText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => finalizar(contador)} style={[styles.button, styles.resetButton]}>
        <Text style={styles.resetText}>Finalizar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => sair()}>
        <Text style={styles.text}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#e2e1e6',
    justifyContent: 'center',
    padding: 35
  },
  loader: {
    margin: 35,
  },
  fieldContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  user: {
    color: "#00a0db",
    fontSize: 24,
    fontWeight: 'bold',
  },
  textContainer: {
    alignSelf: 'center',
    marginBottom: 50,
    borderBottomColor: '#00a0db',
    borderBottomWidth: 2,
  },
  text: {
    textAlign: 'center',
    padding: 20,
    fontSize: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#00a0db',
    borderWidth: 2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  decreaseButton: {
    backgroundColor: '#fefefe',
  },
  decreaseText: {
    fontSize: 40,
  },
  increaseButton: {
    backgroundColor: '#00a0db',
    paddingHorizontal: 25,
    borderColor: '#fefefe',
  },
  increaseText: {
    fontSize: 40,
    color: '#fefefe'
  },
  resetButton: {
    backgroundColor: '#e2e1e6',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  resetText: {
    fontSize: 40,
    textAlign: 'center',
  }
});