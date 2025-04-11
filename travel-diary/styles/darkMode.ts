import { StyleSheet } from 'react-native';

const darkModeStyles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    top: 55, // adjust if needed
    right: 20,
    zIndex: 999,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
});

export default darkModeStyles;
