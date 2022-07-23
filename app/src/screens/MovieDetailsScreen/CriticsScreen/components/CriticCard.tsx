/* eslint-disable no-lone-blocks */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../../redux/reducers/colorModeReducer';
import { StarRating } from '../../MovieInfoScreen/components/StarRating';

type TCriticsCard = {
  data: {
    title: string;
    content: string;
    rate: number;
    reviewLink: string;
  };
  index: number;
};

export const CriticCard = ({ data, index }: TCriticsCard) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={[styles.resultItemWrapper, index === 0 && { marginTop: 20 }]}>
      <View style={styles.infoContainer}>
        <Text
          style={[styles.titleText, { color: colors.onSurfaceHighEmphasis }]}
          numberOfLines={1}>
          {data.title}
        </Text>
        {data.content.length !== 0 && (
          <Text
            style={[
              styles.contentText,
              { color: colors.onSurfaceMediumEmphasis },
            ]}
            numberOfLines={3}>
            {data.content}
          </Text>
        )}
        <StarRating rating={data.rate / 2} size={'small'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultItemWrapper: {
    flex: 1,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  titleText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.medium,
    marginBottom: 5,
  },
  contentText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    marginBottom: 10,
    lineHeight: 24,
  },
});
