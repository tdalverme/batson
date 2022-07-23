import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../assets/fonts/fonts';
import { selectColorMode } from '../redux/reducers/colorModeReducer';

type TOnBoardingSlide = {
  image: any;
  title: string;
  description: string;
};

const { width } = Dimensions.get('window');

export const OnBoardingSlide = ({
  image,
  title,
  description,
}: TOnBoardingSlide) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={image} style={styles.image} resizeMode={'contain'} />
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.onSurfaceHighEmphasis }]}>
            {title}
          </Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.description,
              { color: colors.onSurfaceMediumEmphasis },
            ]}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    justifyContent: 'center',
  },
  image: {
    height: 250,
    flex: 0.5,
    alignSelf: 'center',
  },
  infoContainer: {
    flex: 0.3,
    marginHorizontal: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.semi_large,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.large,
    textAlign: 'center',
    lineHeight: 25,
  },
});
