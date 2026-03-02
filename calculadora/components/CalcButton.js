import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CalcButton({ theme, label, onPress, variant="num", wide=false}) {
  const isOp = variant == "op";
  const bg = isOp ? theme.op : theme.key;
  const fg = isOp ? theme.opText : theme.keyText;

  return (
    <View style={[styles.outer, wide && { flex: 2 }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: bg,
            borderColor: theme.stroke,
            transform: [{ translateY: pressed ? 1.5 : 0}],
          },
          neumorph(theme, pressed),
        ]}
      >
        <Text style={[styles.text, { color: fg}]}>{label}</Text>
      </Pressable>
    </View>
  )
}

function neumorph(theme, pressed) {
  const lift = pressed ? 6 : 10;
  const darkOpacity = pressed ? 0.18 : 0.28;

  return {
    shadowColor: theme.shadowDark,
    shadowOPacity: darkOpacity,
    shadowRadius: lift,
    shadowOffset: { width: 0, heigth: lift * 0.7},
    elevation: pressed ? 3 : 6,
  }
}

const styles = StyleSheet.create({
  outer: {flex: 1},
  btn: {
    heigth: 74,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 22, fontWeight: '700'}
})