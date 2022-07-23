import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { COLORS } from '../../../redux/reducers/colorModeReducer';

export const CameraHelp = () => {
  return (
    <View
      style={[
        styles.helpContainer,
        { backgroundColor: COLORS.DARK.onPrimaryMediumEmphasis },
      ]}>
      <View style={styles.helpDescriptionContainer}>
        <View style={styles.row}>
          <Text
            style={[
              styles.title,
              { color: COLORS.DARK.onSurfaceHighEmphasis },
            ]}>
            Para que podamos reconocer la película más precisamente te
            recomendamos:
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="face-recognition"
            size={28}
            style={[styles.icon, { color: COLORS.DARK.onSurfaceHighEmphasis }]}
          />
          <Text
            style={[
              styles.description,
              { color: COLORS.DARK.onSurfaceHighEmphasis },
            ]}>
            Grabar una escena donde se vean las caras de los actores claramente
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="star-face"
            size={28}
            style={[styles.icon, { color: COLORS.DARK.onSurfaceHighEmphasis }]}
          />
          <Text
            style={[
              styles.description,
              { color: COLORS.DARK.onSurfaceHighEmphasis },
            ]}>
            Si los actores grabados son los protagonistas... Mejor!
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="flash-off"
            size={28}
            style={[styles.icon, { color: COLORS.DARK.onSurfaceHighEmphasis }]}
          />
          <Text
            style={[
              styles.description,
              { color: COLORS.DARK.onSurfaceHighEmphasis },
            ]}>
            No utilizar flash
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="ruler"
            size={28}
            style={[styles.icon, { color: COLORS.DARK.onSurfaceHighEmphasis }]}
          />
          <Text
            style={[
              styles.description,
              { color: COLORS.DARK.onSurfaceHighEmphasis },
            ]}>
            Grabar la película a una distancia no mayor a 1 metro
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="speaker-wireless"
            size={28}
            style={[styles.icon, { color: COLORS.DARK.onSurfaceHighEmphasis }]}
          />
          <Text
            style={[
              styles.description,
              { color: COLORS.DARK.onSurfaceHighEmphasis },
            ]}>
            Evitar ambientes ruidosos
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  helpContainer: {
    flex: 1,
    position: 'absolute',
    width: '85%',
    top: '20%',
    borderRadius: 20,
  },
  helpDescriptionContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.large,
  },
  description: {
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
  },
  icon: {
    marginRight: 20,
  },
});
