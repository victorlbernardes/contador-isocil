import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar } from 'expo-status-bar';

export default function App() {
  const navigation = useNavigation();
  const [contador, setContador] = useState(0);
  const [username, setUsername] = useState('');
  const [maquina, setMaquina] = useState('');
  const [disabledButton, setDisableButton] = useState(true);

  const fetchData = async () => {
    try {
      let user = await AsyncStorage.getItem('username');
      let machine = await AsyncStorage.getItem('maquina');
      if (user !== null && machine !== null) {
        setUsername(user)
        setMaquina(machine)
      }
    } catch (e) {
      // error reading value
    }

  }
  
   function add(novoContador) {
    if (novoContador > 0){
      setDisableButton(false)
    }
        setContador(novoContador);
    }

function subtrai(novoContador) {
  if (novoContador < 1){
    setDisableButton(true)
  }
    setContador(novoContador);
  }

  async function finalizar(novoContador) {
    if (novoContador < 1) {
      alert("Não é possîvel finalizar")
    } else {
        setContador(0);
        
    }
  }

  React.useEffect(() => {
    fetchData();
  }, [contador]);


  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor='transparent' />
      <View style={styles.fieldContainer}>
        <Text style={styles.user}>Nome: {username}</Text>
        <Text style={styles.user}>Máquina: {maquina}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{contador}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity disabled={disabledButton} onPress={() => subtrai(contador - 1)} style={[styles.button, styles.decreaseButton]}>
          <Text style={styles.decreaseText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => add(contador + 1)} style={[styles.button, styles.increaseButton]}>
          <Text style={styles.increaseText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => finalizar(contador)} style={[styles.button, styles.resetButton]}>
        <Text style={styles.resetText}>Finalizar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}>
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

