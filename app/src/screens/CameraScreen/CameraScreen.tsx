import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { RNCamera } from 'react-native-camera';
import { Camera } from '../../components/Camera';
import { Screen } from '../../components/Screen';
import { preventDoubleClick } from '../../utils/preventDoubleClick';
import { useRecordButton } from './hooks/useRecordButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraHelp } from './components/CameraHelp';
import { Easing } from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../redux/reducers/colorModeReducer';
import { initActorBatson } from '../../redux/reducers/actorBatsonSlice';
import { initMovieBatson } from '../../redux/reducers/movieBatsonSlice';

const videoCompressOptions = {
  quality: RNCamera.Constants.VideoQuality['480p'],
  videoBitrate: 600 * 1000, // 600 Kbps
  maxFileSize: 11 * 1000 * 1000, // 11MB
};

const MAX_VIDEO_SIZE = 13 * 1000 * 1000;

const getPathBySO = async (path: string) => {
  return Platform.OS === 'ios' ? path.replace('file://', '') : path;
};

export enum EnumRecordStatus {
  WAITING = 'WAITING',
  STARTED = 'STARTED',
  READY_FOR_FINISHED = 'READY_FOR_FINISHED',
  FINISHED = 'FINISHED',
}

export const CameraScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cameraRef = useRef<RNCamera>(null);
  const _isMountedRef = useRef<boolean>(true);
  const [mode, setMode] = useState<'camera'|'video'>('video');
  useEffect(() => {
    _isMountedRef.current = true;
    return () => {
      _isMountedRef.current = false;
    };
  }, []);

  const [recordState, setRecordState] = useState<EnumRecordStatus>(
    EnumRecordStatus.WAITING,
  );
  const [isAttaching, setIsAttaching] = useState(false);
  const [fileToSend, setFileToSend] = useState<null | {
    path: string;
    mime: string;
  }>(null);
  const animValue = useRef(new Animated.Value(0)).current;
  const [showHelpModal, setShowHelpModal] = useState(false);
  const onPressHelpShow = () => {
    setShowHelpModal(true);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const onPressHelpHide = () => {
    setShowHelpModal(false);
    Animated.timing(animValue, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const resetScreen = () => {
    setRecordState(EnumRecordStatus.WAITING);
    setIsAttaching(false);
    setFileToSend(null);
  };

  useEffect(() => {
    return navigation.addListener('focus', () => {
      resetScreen();
    });
  }, [navigation]);

  useEffect(() => {
    const goToPreviewScreen = async () => {
      if(!_isMountedRef.current){
        return;
      }
      if (fileToSend) {
        const path = fileToSend.path;
        if (fileToSend) {
          if (fileToSend.mime.includes('image')) {
            dispatch(
              initActorBatson({
                file: {
                  mime: fileToSend.mime,
                  path: await getPathBySO(path),
                },
              }),
            );
            navigation.navigate('ActorPreviewScreen');
          } else {
            dispatch(
              initMovieBatson({
                file: {
                  mime: fileToSend.mime,
                  path: await getPathBySO(path),
                },
              }),
            );
            navigation.navigate('MoviePreviewScreen');
          }
        }
      }
    };

    _isMountedRef.current && goToPreviewScreen();
  }, [fileToSend, navigation, dispatch]);

  const handlePressRecordButton = useCallback(async () => {
    setRecordState(EnumRecordStatus.STARTED);
    try {
      const videoResponse = await cameraRef.current?.recordAsync({
        ...videoCompressOptions,
      });
      setRecordState(EnumRecordStatus.FINISHED);
      _isMountedRef.current &&
        setFileToSend({
          path: videoResponse?.uri ?? '',
          mime: 'video/mp4',
        });
    } catch (e) {
      resetScreen();
    }
  }, []);


  const handlePressCameraButton = useCallback(async () => {
    setRecordState(EnumRecordStatus.STARTED);
    try {
      const photo = await cameraRef.current?.takePictureAsync({width:1024,quality: 1});
      _isMountedRef.current && photo?.uri &&
        setFileToSend({
          path: photo.uri,
          mime: 'image/jpg',
        });
    } catch (e) {
      resetScreen();
    }
  }, []);


  const handleReadyToRecord = useCallback(() => {
    _isMountedRef.current &&
      setRecordState(EnumRecordStatus.READY_FOR_FINISHED);
  }, []);

  const handleEndRecord = useCallback(async () => {
    preventDoubleClick(() => {
      _isMountedRef.current && setRecordState(EnumRecordStatus.FINISHED);
      cameraRef.current?.stopRecording();
    });
  }, []);

  const RecordIcon = useRecordButton({
    recordState,
    onPress: handlePressRecordButton,
    onReadyToRecord: handleReadyToRecord,
    onEndRecord: handleEndRecord,
  });

  const handleAttachVideo = async () => {
    ImagePicker.openPicker({
      mediaType: 'any',
      maxFiles: 1,
    })
      .then(async videoResponse => {
        setIsAttaching(false);
        setRecordState(EnumRecordStatus.FINISHED);
        if (videoResponse.size < MAX_VIDEO_SIZE) {
          const path = videoResponse.path;
          setFileToSend({
            path,
            mime: videoResponse.mime,
          });
        } else {
          console.warn('Peso máximo superado');
          resetScreen();
        }
      })
      .catch(e => {
        console.log(e.code);
        if (e.code === 'E_NO_LIBRARY_PERMISSION') {
          console.log(e.code);
          Linking.openURL('app-settings:');
          resetScreen();
        }
        setIsAttaching(false);
      });
  };

  return (
    <Screen
      style={[
        styles.screen,
        { backgroundColor: COLORS.DARK.onPrimaryHighEmphasis },
      ]}>
      <Camera ref={cameraRef} style={styles.camera}>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              onPressHelpShow();
            }}>
            {recordState === EnumRecordStatus.WAITING && (
              <MaterialCommunityIcons
                name="information-outline"
                size={38}
                style={[
                  styles.icon,
                  { color: COLORS.DARK.onSurfaceHighEmphasis },
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
        <Modal style={styles.modal} transparent visible={showHelpModal}>
          <TouchableOpacity style={styles.modalContainer} onPress={onPressHelpHide}>
            <CameraHelp />
          </TouchableOpacity>
        </Modal>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleAttachVideo}
            disabled={isAttaching}>
            {recordState === EnumRecordStatus.WAITING && (
              <MaterialCommunityIcons
                name="image-filter-hdr"
                size={38}
                style={[
                  styles.icon,
                  { color: COLORS.DARK.onSurfaceHighEmphasis },
                ]}
              />
            )}
          </TouchableOpacity>

          <View style={styles.recordButtonContainer}>
            {mode === 'camera' ?(
              (
                <TouchableOpacity
                  onPress={() => preventDoubleClick(handlePressCameraButton)}
                  style={[
                    styles.buttonWaitingContainer,
                    {
                      backgroundColor: 'transparent',
                      borderColor: 'white',
                    },
                  ]}>
                </TouchableOpacity>
              )
            ):RecordIcon}
            
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              if(mode === 'camera'){
                navigation.setOptions({title:'Reconoce películas'});
                setMode('video');
              }else{
                setMode('camera');
                navigation.setOptions({title:'Reconoce actores'});
              }
            }}>
            {recordState === EnumRecordStatus.WAITING && (
              <MaterialCommunityIcons
                name={mode === 'camera'? 'movie-open' : 'account-multiple'}
                size={38}
                style={[
                  styles.icon,
                  { color: COLORS.DARK.onSurfaceHighEmphasis },
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      
      </Camera>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:'red'
  },
  modalContainer: {
    display:'flex',
    flex:1,
    backgroundColor: COLORS.DARK.onSurfaceDisabled,
    justifyContent:'center',
    alignItems:'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContainer: {
  },
  infoContainer: {
    paddingTop: 20,
    marginRight:30,
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  buttonWaitingContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
  },
  screenContainer: {
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    justifyContent:'space-between',
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    paddingBottom: 15,
  },
  icon: {
    paddingTop: 5,
    paddingRight: 1
  },
  buttonContainer: {
    alignItems:'center',
    justifyContent:'center'
  },
  recordButtonContainer: {
    paddingVertical: 20,
  },
});
