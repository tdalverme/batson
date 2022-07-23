import * as React from 'react';
import { Screen } from '../../components/Screen';
import { FlatList } from 'react-native';
import { QuestionCard } from './components/QuestionCard';

export const FaqScreen = () => {

  const questions = [
    {
      'question': '¿Qué es Batson?',
      'answer': 'Batson es una aplicación mobile, soportada en android y iOS, para reconocimiento de actores, películas y series.'
    },
    {
      'question': '¿Qué información brinda Batson?',
      'answer': 'A partir de un pequeño clip de película o serie que hayas subido, te recopilamos información tal como sinopsis, trailer, reparto y mucho más.'
    },
    {
      'question': '¿Batson solo funciona con video?',
      'answer': 'También aceptamos una imagen con los actores que participan en la película o serie, no necesariamente tiene que ser de una escena.'
    },
    {
      'question': '¿Reconocen películas animadas?',
      'answer': 'Batson se basa en un sistema de reconocimiento facial, por lo tanto tienen que participar actores reales.'
    },
    {
      'question': '¿Tengo que pagar por usarla?',
      'answer': 'Para nada, Batson es totalmente gratuita para cualquier usuario que la instale.'
    },
    {
      'question': 'Además de descubrir info sobre una peli o serie, ¿Puedo verla en la aplicación?',
      'answer': 'No podrás reproducir el contenido a través de nuestro servicio. Sin embargo, te acercamos los links a algunas plataformas de streaming para que puedas disfrutarlas cuando desees.'
    },
    {
      'question': 'Si estoy sin conexión a internet, ¿puedo hacer un Batson?',
      'answer': 'Lamentablemente, necesitás estar conectado a internet para iniciar un Batson. De todas formas, guardate el video o la foto en tu galería, cuando tengas conexión la vas a poder adjuntar y finalizar el Batson.'
    },
    {
      'question': '¿Existe otra forma de conocer los detalles de una película o serie?',
      'answer': 'Podés conocer más información utilizando nuestra barra de búsqueda personalizada, ya sea por nombre o palabras claves.'
    },
    {
      'question': '¿Puedo ver la info de un batson más tarde?',
      'answer': 'Los usuarios que hayan guardado los Batson que les llamaron la atención, van a poder consultar el contenido en cualquier momento que deseen a través del Historial.'
    }, 
  ];


  return (
    <Screen>
      <FlatList
        data={questions}
        renderItem={({ item, index }) => (
          <QuestionCard data={item} index={index} />
        )}
        keyExtractor={item => item.question}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};