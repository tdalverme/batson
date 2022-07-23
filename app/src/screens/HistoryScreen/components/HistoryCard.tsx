import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type THistoryCard = {
  title: string;
  image?: string;
  genreList: { key: string; value: string }[];
  runtimeMins: number;
  cardStyle: StyleProp<ViewStyle>;
  onPress: () => void;
  onLongPress: () => void;
  isLongPressed: boolean;
  onRemove: () => void;
  subtitle?: string;
};

export const HistoryCard = ({
  title,
  image,
  subtitle,
  cardStyle,
  onPress,
  onLongPress,
  isLongPressed,
  onRemove,
}: THistoryCard) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <TouchableOpacity
      style={
        isLongPressed
          ? [
            styles.cardDeleteState,
            { backgroundColor: colors.surface_dp3 },
            cardStyle,
          ]
          : [
            styles.cardNormalState,
            { backgroundColor: colors.surface_dp1 },
            cardStyle,
          ]
      }
      delayPressIn={30}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View>
        {isLongPressed && (
          <MaterialCommunityIcons
            name="minus-circle"
            size={28}
            color={colors.primary}
            style={styles.optionsIcon}
            onPress={onRemove}
          />
        )}
        <Image
          source={{ uri: image }}
          style={
            isLongPressed
              ? styles.candidateImageDeleteState
              : styles.candidateImageNormalState
          }
          resizeMode="cover"
        />
      </View>
      <View
        style={
          isLongPressed
            ? styles.historyInfoDeleteState
            : styles.historyInfoNormalState
        }>
        <Text
          style={[styles.movieTitle, { color: colors.onSurfaceHighEmphasis }]}
          numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.movieInfo, { color: colors.onSurfaceMediumEmphasis }]}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardNormalState: {
    borderRadius: 10,
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardDeleteState: {
    borderRadius: 10,
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  optionsIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
    shadowColor: '#000000',
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 10,
  },
  candidateImageNormalState: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
  },
  candidateImageDeleteState: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
    opacity: 0.4,
  },
  historyInfoNormalState: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 12,
    flexDirection: 'column',
  },
  historyInfoDeleteState: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 12,
    flexDirection: 'column',
    opacity: 0.4,
  },
  movieTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.large,
    paddingBottom: 5,
  },
  movieInfo: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.small,
  },
});
