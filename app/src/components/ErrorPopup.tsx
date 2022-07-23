import React, {  useRef, useState } from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../assets/fonts/fonts';
import { selectColorMode } from '../redux/reducers/colorModeReducer';

export enum ERROR_IMAGES {
  noConnection = require('../../assets/images/lost-connection.png'),
  noResults = require('../../assets/images/no-results.png'),
}

type TypeErrorPopup = {
  image: ERROR_IMAGES;
  title: string;
  description: string;
  buttonDescription: string;
  onClose: (closeModal: ()=> void) => void;
  visible: boolean;
};

export const ErrorPopup = ({
  image,
  title,
  description,
  buttonDescription,
  onClose,
  visible
}: TypeErrorPopup) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useSelector(selectColorMode);
  const [_visible, _setVisible] = useState(true);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal style={styles.modal} transparent visible={visible && _visible}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.onSurfaceDisabled,
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.1, 1],
                }),
              },
            ],
          },
        ]}>
        {fadeIn()}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
            },
          ]}>
          <View>
            <Image source={image} style={styles.errorImage} />

            <View style={styles.errorDescriptionContainer}>
              <Text
                style={[
                  styles.errorTitle,
                  { color: colors.onSurfaceHighEmphasis },
                ]}>
                {title}
              </Text>
              <Text
                style={[
                  styles.errorDescription,
                  { color: colors.onSurfaceMediumEmphasis },
                ]}>
                {description}
              </Text>

              <TouchableOpacity
                style={[
                  styles.errorButtonContainer,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => {
                  onClose(
                    ()=>{
                      _setVisible(false);
                    }
                  );
                }}>
                <Text
                  style={[
                    styles.errorButtonText,
                    { color: colors.onPrimaryHighEmphasis },
                  ]}>
                  {buttonDescription}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    zIndex: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    zIndex: 1,
    flexDirection: 'column',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  errorDescriptionContainer: {
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.semi_large,
    textAlign: 'center',
  },
  errorDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    textAlign: 'center',
    marginTop: 10,
  },
  errorButtonContainer: {
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 20,
  },
  errorButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.medium,
    textAlign: 'center',
    paddingVertical: 12,
    letterSpacing: 4,
  },
  errorImage: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});
