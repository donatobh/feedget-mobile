import { Camera, Trash } from 'phosphor-react-native';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../theme';

import { styles } from './styles';

interface Props {
  screenshot: string | null;
  onTakeScreenshot: () => void;
  onDeleteScreenshot: () => void;
}

export function Screenshot({ screenshot, onTakeScreenshot, onDeleteScreenshot }: Props) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={screenshot ? onDeleteScreenshot : onTakeScreenshot}
    >
      {
        screenshot
        ?
        <View>
          <Image 
            style={styles.image}
            source={{uri: screenshot}}          
          />
          <Trash 
            size={22}
            color={theme.colors.text_secondary}
            weight="fill"
            style={styles.removeIcon}
          />
        </View>
        :
        <Camera 
          size={24}
          color={theme.colors.text_primary}
          weight="bold"
          style={styles.cameraIcon}
        />
      }
    </TouchableOpacity>
  );
}