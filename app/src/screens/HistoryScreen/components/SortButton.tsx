import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import { Movie } from '../../../services/movies';

type TSortButton = {
  text: string;
  style: StyleProp<TextStyle>;
  selected: string;
  batsons: Movie[][];
  onPress: (batsons: Movie[][]) => void;
};

export const sortByRecent = (batsons: Movie[][]) => {
  batsons.sort((b1, b2) => {
    const dateParts1 = b1[0].date.substring(0, 10).split('/');
    const dateParts2 = b2[0].date.substring(0, 10).split('/');

    const timeParts1 = b1[0].date.substring(11).split(':');
    const timeParts2 = b2[0].date.substring(11).split(':');

    const d1 = new Date(
      +dateParts1[2],
      Number(dateParts1[1]) - 1,
      +dateParts1[0],
      Number(timeParts1[0]),
      Number(timeParts1[1]),
    );
    const d2 = new Date(
      +dateParts2[2],
      Number(dateParts2[1]) - 1,
      +dateParts2[0],
      Number(timeParts2[0]),
      Number(timeParts2[1]),
    );

    return d2.valueOf() - d1.valueOf();
  });

  return batsons;
};

export const sortByRelease = (batsons: Movie[][]) => {
  batsons.sort((b1, b2) => {
    return b1[0].year - b2[0].year;
  });

  return batsons;
};

export const sortByGenre = (batsons: Movie[][]) => {
  batsons.sort((b1, b2) => {
    return b1[0].genreList[0].value.localeCompare(b2[0].genreList[0].value);
  });

  return batsons;
};

export const sortByTitle = (batsons: Movie[][]) => {
  batsons.sort((b1, b2) => {
    return b1[0].title.localeCompare(b2[0].title || '') || 0;
  });

  return batsons;
};

export const SortButton = ({
  text,
  style,
  selected,
  batsons,
  onPress,
}: TSortButton) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <TouchableOpacity
      style={
        selected === text
          ? [
            styles.pressedContainer,
            { backgroundColor: colors.primary, borderColor: colors.primary },
            style,
          ]
          : [
            styles.container,
            {
              backgroundColor: colors.primaryTransparent,
              borderColor: colors.primaryTransparent,
            },
            style,
          ]
      }
      onPress={() => {
        onPress(batsons);
      }}>
      <Text
        style={
          selected === text
            ? [styles.textPressed, { color: colors.onPrimaryHighEmphasis }]
            : [styles.text, { color: colors.primaryDark }]
        }>
        {text.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.small,
  },
  textPressed: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.small,
  },
  pressedContainer: {
    borderWidth: 1,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
