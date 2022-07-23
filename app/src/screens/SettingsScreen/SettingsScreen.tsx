import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Screen } from '../../components/Screen';
import {
  selectColorMode,
  setColorMode,
} from '../../redux/reducers/colorModeReducer';
import { SettingsButton } from './components/SettingsButton';
import { SettingsSection } from './components/SettingsSection';

export const SettingsScreen = ({ navigation }: any) => {
  const { mode } = useSelector(selectColorMode);
  const dispatch = useDispatch();

  const getMailTo =
    'mailto:batsonmovieapp@gmail.com?&subject=Soporte Tecnico Batson';

  const abrirInstagram = () => {
    Linking.openURL('instagram://user?username=batsonApp').catch(() => {
      Linking.openURL('https://www.instagram.com/batsonApp');
    });
  };

  const abrirTwitter = () => {
    Linking.openURL('twitter://user?screen_name=BatsonApp').catch(() => {
      Linking.openURL('https://www.twitter.com/BatsonApp');
    });
  };

  const abrirFacebook = () => {
    Linking.openURL('https://www.facebook.com/Batson-102252175551936').catch(
      () => {
        Linking.openURL('https://www.facebook.com/BatsonApp');
      },
    );
  };

  const abrirEmail = async () => {
    Linking.openURL(getMailTo);
  };

  const irAFaqScreen = async () => {
    navigation.navigate('Faq');
  };

  const changeTheme = async () => {
    await AsyncStorage.setItem('theme', mode === 'DARK' ? 'LIGHT' : 'DARK');
    dispatch(setColorMode(mode === 'DARK' ? 'LIGHT' : 'DARK'));
  };

  return (
    <Screen>
      <SettingsSection text={'Ajustes generales'}>
        <SettingsButton
          iconName={'brightness-4'}
          onPress={changeTheme}
          text={'Modo oscuro'}
          toggle
          toggleDefault={mode === 'DARK'}
        />
      </SettingsSection>
      <SettingsSection text={'Contacto'}>
        <SettingsButton
          iconName={'instagram'}
          onPress={abrirInstagram}
          text={'Instagram'}
        />
        <SettingsButton
          iconName={'twitter'}
          onPress={abrirTwitter}
          text={'Twitter'}
        />
        <SettingsButton
          iconName={'facebook'}
          onPress={abrirFacebook}
          text={'Facebook'}
        />
      </SettingsSection>

      <SettingsSection text={'Ayuda'}>
        <SettingsButton
          iconName={'email'}
          onPress={abrirEmail}
          text={'Soporte Técnico'}
        />
        <SettingsButton
          iconName={'comment-question-outline'}
          onPress={irAFaqScreen}
          text={'FAQ'}
        />
      </SettingsSection>
    </Screen>
  );
};
