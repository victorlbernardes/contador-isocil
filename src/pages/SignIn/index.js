import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'

import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [machine, setMachine] = useState('');
    const [disabledButton, setDisableButton] = useState(true);
    const navigation = useNavigation();

    const usuario = ['User 1', 'User 2']
    const maquina = ['Maquina 1', 'Maquina 2']
    const handleSelect = () => {
        setDisableButton(false);
    };


    const onPress = async () => {
        if (username == '' || machine == '') {
            alert("Por favor, insira os dados")
        } else {
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('maquina', machine);
            navigation.navigate('Home');

        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View
                animation="fadeInLeft"
                delay={500}
                style={styles.containerHeader}
            >
                <Text style={styles.message}>Bem-Vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp"
                style={styles.containerForm}
            >
                <Text style={styles.tilte}>Usuário</Text>
                <SelectList
                    setSelected={(username) => setUsername(username)}
                    data={usuario}
                    save="value"
                    placeholder="Selecione o Usuário"
                    onSelect={() => handleSelect()}
                />

                <Text style={styles.tilte}>Máquina</Text>
                <SelectList
                    setSelected={(machine) => setMachine(machine)}
                    data={maquina}
                    save="value"
                    placeholder="Selecione a Maquina"
                    onSelect={() => handleSelect()}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onPress()}
                    disabled={disabledButton}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('Welcome')}
                >
                    <Text style={styles.registerText}>Não Possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00a0db',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm: {
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    tilte: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#00a0db',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center'

    },
    registerText: {
        color: '#a1a1a1'
    },

})