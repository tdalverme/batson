import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type TMovieCard = {
  title: string;
  plot?: string;
  plotLocal?: string;
  image?: string;
  coincidence?: number;
  index: number;
  correct?: boolean;
};

export const MovieCard = ({
  title,
  plot,
  plotLocal,
  image: poster_url,
  coincidence,
  index,
  correct = false,
}: TMovieCard) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View
      style={[
        styles.candidatesItemWrapper,
        correct
          ? { backgroundColor: colors.primary }
          : { backgroundColor: colors.surface_dp1 },
      ]}>
      <View style={[styles.rankingCircle, { backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.rankingNumber,
            { color: colors.onPrimaryHighEmphasis },
          ]}>
          {index + 1}
        </Text>
      </View>
      <Image source={{ uri: poster_url }} style={styles.candidateImage} />
      <View style={styles.candidateInfo}>
        <View style={styles.candidateTopInfo}>
          <View style={styles.viewTitle}>
            <Text
              style={[
                styles.candidateTitle,
                correct
                  ? { color: colors.onPrimaryHighEmphasis }
                  : { color: colors.onSurfaceHighEmphasis },
              ]}
              numberOfLines={1}>
              {title}
            </Text>
          </View>
          {coincidence !== undefined && (
            <View style={styles.percentage}>
              <Text
                style={[
                  styles.candidateCoincidenceText,
                  correct
                    ? { color: colors.onPrimaryHighEmphasis }
                    : { color: colors.primary },
                ]}>
                {coincidence.toFixed(0)}%
              </Text>
            </View>
          )}
        </View>
        {!!plot && (
          <View style={styles.viewDescription}>
            <Text
              style={[
                styles.candidateDescription,
                correct
                  ? { color: colors.onPrimaryMediumEmphasis }
                  : { color: colors.onSurfaceMediumEmphasis },
              ]}
              numberOfLines={4}>
              {plotLocal ? plotLocal : plot}
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
  candidatesItemWrapper: {
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
  candidateImage: {
    width: 120,
    height: 120,
  },
  candidateInfo: {
    flex: 1,
    padding: 12,
    flexDirection: 'column',
  },
  candidateTopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidateTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  candidateCoincidenceText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 11,
  },
  percentage: {
    flex: 0.15,
    paddingLeft: 5,
    alignItems: 'flex-end',
  },
  viewDescription: {
    flexDirection: 'row',
  },
  candidateDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'justify',
  },
  rankingCircle: {
    width: 20,
    height: 20,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    elevation: 4,
  },
  rankingNumber: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    marginBottom: -21,
  },
});
