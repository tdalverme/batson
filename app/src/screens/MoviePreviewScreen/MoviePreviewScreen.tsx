import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { ProgressBarAnimated } from '../../components/ProgressBarAnimated';
import { Screen } from '../../components/Screen';
import { BatsonVideoPlayer } from './components/VideoPlayer';
import { ErrorPopup, ERROR_IMAGES } from '../../components/ErrorPopup';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../redux/reducers/colorModeReducer';
import { selectMovieBatson } from '../../redux/reducers/movieBatsonSlice';
import useFetchMovieCandidates from './hooks/useFetchMovieCandidates';

export const MoviePreviewScreen = ({ navigation }: any) => {
  const { file, candidates } = useSelector(selectMovieBatson);

  const _isMountedRef = useRef<boolean>(true);
  useEffect(() => {
    _isMountedRef.current = true;
    return () => {
      _isMountedRef.current = false;
    };
  }, []);

  const { hasError, progress, fetchMovieCandidates } =
    useFetchMovieCandidates();

  const withoutResults = candidates !== null && candidates.length === 0;

  return (
    <>
      <Screen style={[styles.screen, { backgroundColor: COLORS.DARK.black }]}>
        <View style={styles.container}>
          <View style={styles.adBannerContainer}>
            <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.FULL_BANNER} />
          </View>
          <View style={styles.videoPlayerContainer}>
            <BatsonVideoPlayer path={file.path} navigation={navigation} />
          </View>

          <View style={styles.footer}>
            {progress.step > 0 || candidates !== null ? (
              <ProgressBarAnimated
                step={progress.step}
                steps={10}
                height={15}
                duration={progress.duration}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  fetchMovieCandidates();
                }}
                style={[
                  styles.fabWrapper,
                  {
                    backgroundColor: COLORS.DARK.primary,
                    borderColor: COLORS.DARK.primary,
                  },
                ]}>
                <View style={styles.fabContent}>
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={COLORS.DARK.onPrimaryMediumEmphasis}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      { color: COLORS.DARK.onPrimaryMediumEmphasis },
                    ]}>
                    CONFIRMAR
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Screen>

      <ErrorPopup
        visible={hasError}
        title="Conexión fallida"
        description="Por favor, revisa tu conexión a internet e intenta nuevamente."
        image={ERROR_IMAGES.noConnection}
        buttonDescription="VOLVER"
        onClose={(closeModal) =>{
          closeModal();
          navigation.goBack();
        }}
      />

      <ErrorPopup
        visible={withoutResults}
        title="No hay coincidencias"
        description="No encontramos ninguna coincidencia. Intenta nuevamente con un video o imagen diferente"
        image={ERROR_IMAGES.noResults}
        buttonDescription="VOLVER"
        onClose={(closeModal) =>{
          closeModal();
          navigation.goBack();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adBannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerContainer: {
    flex: 0.8,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    height: '100%',
    paddingTop: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: '0%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fabWrapper: {
    marginBottom: 25,
    borderRadius: 43,
    borderWidth: 1.5,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    elevation: 8,
  },
  fabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  buttonText: {
    marginLeft: 12,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    letterSpacing: 2,
  },
});
