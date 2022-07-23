import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { RecordingButton } from '../../../components/RecordingButton';
import { COLORS } from '../../../redux/reducers/colorModeReducer';
import { preventDoubleClick } from '../../../utils/preventDoubleClick';
import { EnumRecordStatus } from '../CameraScreen';

type TUseRecordButton = {
  recordState: EnumRecordStatus;
  onEndRecord: () => void;
  onReadyToRecord: () => void;
  onPress: () => void;
};

export const useRecordButton = ({
  recordState,
  onEndRecord,
  onReadyToRecord,
  onPress,
}: TUseRecordButton): JSX.Element | null => {
  const RecordingButtonWithMemo = useCallback(
    () => (
      <RecordingButton
        buttonStyle={styles.buttonStop}
        onPress={onEndRecord}
        onReady={onReadyToRecord}
        onEnd={onEndRecord}
      />
    ),
    [onEndRecord, onReadyToRecord],
  );

  const RecordButtonByStatus = {
    [EnumRecordStatus.WAITING]: (
      <TouchableOpacity
        onPress={() => preventDoubleClick(onPress)}
        style={[
          styles.buttonWaitingContainer,
          {
            backgroundColor: COLORS.DARK.error,
            borderColor: COLORS.DARK.onSurfaceHighEmphasis,
          },
        ]}>
        <View
          style={[styles.buttonStop, { backgroundColor: COLORS.DARK.error }]}
        />
      </TouchableOpacity>
    ),
    [EnumRecordStatus.STARTED]: <RecordingButtonWithMemo />,
    [EnumRecordStatus.READY_FOR_FINISHED]: <RecordingButtonWithMemo />,
    [EnumRecordStatus.FINISHED]: null,
  };

  return RecordButtonByStatus[recordState];
};

const styles = StyleSheet.create({
  buttonStop: {
    width: 34,
    height: 34,
    borderRadius: 3,
  },
  buttonWaitingContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
  },
});
