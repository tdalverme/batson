import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../../redux/reducers/colorModeReducer';

type TFilmographyCard = {
  title: string;
  year: number;
  role: string;
};

export const FilmographyCard = ({ title, role, year }: TFilmographyCard) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View
      style={[styles.filmItemWrapper, { backgroundColor: colors.surface_dp1 }]}>
      <View style={styles.movieTitleContainer}>
        <Text
          style={[styles.movieTitle, { color: colors.onSurfaceHighEmphasis }]}
          numberOfLines={2}>
          {title}
        </Text>
        {!!role && (
          <View style={styles.roleContainer}>
            <Text
              style={[
                styles.roleText,
                { color: colors.onSurfaceMediumEmphasis },
              ]}>
              {year ? year : '-'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewTitle: {
    flex: 0.85,
  },
  filmItemWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  },
  movieTitleContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'column',
  },
  movieTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.large,
  },
  roleContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  roleText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    marginTop: 4,
    lineHeight: 15,
    flex: 1,
    flexWrap: 'wrap',
  },
});
