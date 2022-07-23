/* eslint-disable no-lone-blocks */
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../../redux/reducers/colorModeReducer';

type TResultCard = {
  data: {
    id: string;
    image: string;
    name: string;
    asCharacter: string;
  };
  index: number;
};

export const CastCard = ({ data, index }: TResultCard) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={[styles.resultItemWrapper, index === 0 && { marginTop: 20 }]}>
      <View>
        <Image
          source={require('../../../../../assets/images/actor-placeholder.png')}
          style={styles.actorImagePlaceholder}
        />
        <Image source={{ uri: data.image }} style={styles.actorImage} />
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={[styles.titleText, { color: colors.onSurfaceHighEmphasis }]}
          numberOfLines={1}>
          {data.name}
        </Text>
        <Text
          style={[
            styles.characterText,
            { color: colors.onSurfaceMediumEmphasis },
          ]}
          numberOfLines={1}>
          {data.asCharacter}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultItemWrapper: {
    flex: 1,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  actorImage: {
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  actorImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 60,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  movieImage: {
    width: 90,
    height: 90,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 30,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.semi_large,
  },
  characterText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    marginTop: 5,
  },
});
