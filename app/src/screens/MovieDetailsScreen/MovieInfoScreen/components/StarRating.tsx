import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../../redux/reducers/colorModeReducer';

const SIZES = {
  small: 16,
  medium: 20,
};

type RatingParams = {
  rating: number;
  size: 'small' | 'medium';
};

export const StarRating = (params: RatingParams) => {
  const { rating, size = 'medium' } = params;
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={styles.container}>
      {Array.from({ length: Math.floor(rating) }, (_, index) => (
        <MaterialCommunityIcons
          name="star"
          key={index}
          size={SIZES[size]}
          color={colors.primary}
        />
      ))}

      {rating !== 5 &&
        (rating - Math.floor(rating) <= 0.3 ? (
          <MaterialCommunityIcons
            name="star-outline"
            size={SIZES[size]}
            color={colors.onSurfaceDisabled}
          />
        ) : rating - Math.floor(rating) < 0.75 ? (
          <MaterialCommunityIcons
            name="star-half-full"
            size={SIZES[size]}
            color={colors.primary}
          />
        ) : (
          <MaterialCommunityIcons
            name="star"
            size={SIZES[size]}
            color={colors.primary}
          />
        ))}

      {Array.from({ length: 4 - Math.floor(rating) }, (_, index) => (
        <MaterialCommunityIcons
          key={index}
          name="star-outline"
          size={SIZES[size]}
          color={colors.onSurfaceDisabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
