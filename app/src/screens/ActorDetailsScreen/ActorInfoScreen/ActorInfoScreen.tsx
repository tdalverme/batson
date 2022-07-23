import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';

import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { Screen } from '../../../components/Screen';
import LinearGradient from 'react-native-linear-gradient';
import { ErrorPopup, ERROR_IMAGES } from '../../../components/ErrorPopup';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';
import { ActorInfoTabContext } from '../../../context/ActorInfoTabContext';

export const ActorInfoScreen = ({ navigation, route }: any) => {
  const { actorId } = route.params;
  const { actorInfo, loading, hasError, fetchActorDetails } =
    useContext(ActorInfoTabContext);

  const [textShown, setTextShown] = useState(false);

  const { colors } = useSelector(selectColorMode);

  useEffect(() => {
    fetchActorDetails(actorId);
  }, [actorId]);

  const onPressText = () => {
    setTextShown(!textShown);
  };
  return (
    <Screen loading={loading} style={styles.container}>
      {actorInfo !== null && !actorInfo?.errorMessage && !hasError && (
        <ImageBackground
          source={{ uri: actorInfo.image }}
          style={styles.poster}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.2, 0.35, 0.8]}
            colors={
              textShown ? colors.textShownGradient : colors.textHiddenGradient
            }
            style={styles.gradientContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.firstRowContainer}>
                <Text
                  style={[
                    styles.title,
                    { color: colors.onSurfaceHighEmphasis },
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit>
                  {actorInfo.name}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.birthYear,
                    { color: colors.onSurfaceMediumEmphasis },
                  ]}>
                  {actorInfo.birthDate?.substring(0, 4)}{' '}
                  {actorInfo.deathDate &&
                    `- ${actorInfo.deathDate?.substring(0, 4)}`}
                </Text>
                <Text
                  style={[
                    styles.description,
                    { color: colors.onSurfaceMediumEmphasis },
                  ]}
                  onPress={() => onPressText()}
                  numberOfLines={textShown ? 36 : 4}>
                  {actorInfo.summary}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      ) }
      <ErrorPopup
        visible={hasError}
        title="No hay coincidencias"
        description="No encontramos ninguna coincidencia. Intenta más tarde nuevamente"
        image={ERROR_IMAGES.noResults}
        buttonDescription="VOLVER"
        onClose={(closeModal) => {
          closeModal(); 
          navigation.goBack();
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: 19,
    paddingBottom: 35,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  firstRowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.extra_large,
    flex: 0.85,
    paddingRight: 13,
  },
  birthYear: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.medium,
    marginBottom: 10,
  },
  relevantInfoContainer: {
    flex: 0.8,
  },
  starsContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  description: {
    fontFamily: FONTS.light,
    fontSize: FONT_SIZE.medium,
    lineHeight: 23,
    textAlign: 'justify',
  },
});
