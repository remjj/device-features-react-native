import { StyleSheet } from 'react-native';

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  preview: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 0.5,          
    borderColor: 'black',
  },
  galleryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addPhotoBox: {
    width: 60,
    height: 60,
    backgroundColor: '#6B4E71',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6B4E71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    width: 250,
    marginTop: 10,
    textAlignVertical: 'top',
    color: '#000',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },  
});

export default cameraStyles;
