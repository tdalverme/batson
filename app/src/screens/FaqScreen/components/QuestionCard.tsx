/* eslint-disable no-lone-blocks */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS, FONT_SIZE } from '../../../../assets/fonts/fonts';
import { selectColorMode } from '../../../redux/reducers/colorModeReducer';

type TQuestionCard = {
  data: {
    question: string;
    answer: string;
  };
  index: number;
};

export const QuestionCard = ({ data, index }: TQuestionCard) => {
  const { colors } = useSelector(selectColorMode);

  return (
    <View style={[styles.resultItemWrapper, index === 0 && { marginTop: 20 }]}>
      <View style={styles.infoContainer}>
        <Text
          style={[styles.questionText, { color: colors.onSurfaceHighEmphasis }]}
          numberOfLines={2}>
          {data.question}
        </Text>
        <Text
          style={[
            styles.answerText,
            { color: colors.onSurfaceMediumEmphasis },
          ]}>
          {data.answer}
        </Text>
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
  questionText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.medium,
    marginBottom: 5,
  },
  answerText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.medium,
    marginBottom: 10,
    lineHeight: 24,
  },
});
