import React from 'react'
import { Text as ReactNativeText } from 'react-native'

const Text = (props) => {
  return (
    <ReactNativeText maxFontSizeMultiplier={1.4} style={props.style} numberOfLines={props.numberOfLines}>
        {props.children}
    </ReactNativeText>
  )
}

export default Text