import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CalcButton({ theme, label, onPress, variant="num", wide=false}) {
  return (
    <View>
      <Text>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})