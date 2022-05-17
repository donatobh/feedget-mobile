import React, { useState } from 'react';
import { 
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { captureScreen} from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system'
import { ArrowLeft } from 'phosphor-react-native';

import { FeedbackType } from '../Widget';
import { feedbackTypes } from '../../utils/feedbackTypes';

import { styles } from './styles';
import { theme } from '../../theme';
import { Screenshot } from '../Screenshot';
import { Button } from '../Button' 
import { api } from '../../libs/api';

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({ feedbackType, onFeedbackCanceled, onFeedbackSent }: Props) {
  const [ screenshot, setScreenshot ] = useState<string | null>(null);

  const feedbackTypeInfo = feedbackTypes[feedbackType];
  const [isSending, setIsSending] = useState(false);
  const [comment, setComment] = useState('');

  function handleScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    })
      .then(uri => setScreenshot(uri))
      .catch(error => console.log (error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSending) {
      return;
    }

    setIsSending(true);

    const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' });
    
    try {

      await api.post('/feedbacks', {
        type: feedbackType,
        comment,
        screenshot: `data:image/png;base64,${screenshotBase64}`,
      })

      onFeedbackSent();

    } catch(error) {

      console.log(error);
      setIsSending(false);

    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image} 
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput 
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Para que possamos corrigir, conte-nos os detalhes do que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <Screenshot 
          onTakeScreenshot={handleScreenshot}
          onDeleteScreenshot={handleScreenshotRemove}
          screenshot={screenshot}
        />

        <Button 
          onPress={handleSendFeedback}
          isLoading={isSending}
        />
      </View>

    </View>
  );
}