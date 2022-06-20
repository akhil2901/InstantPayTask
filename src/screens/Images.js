import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Aes from 'react-native-aes-crypto';
import base64 from 'react-native-base64';
import {
  text,
  key,
  iv,
  getTokenEndpoint,
  uploadImage,
} from '../constants/constant';
import ImageContainer from '../components/Images/ImageContainer';
const Images = () => {
  const [token, setToken] = useState('');
  const [gallery, setGallery] = useState([]);
  const encryptData = (text, key) => {
    return Aes.randomKey(16).then(iv => {
      return Aes.encrypt(text, key, iv, 'aes-128-cbc').then(cipher => ({
        cipher,
        iv,
      }));
    });
  };
  const getToken = async () => {
    let cipherText;
    await encryptData(text, key)
      .then(({cipher, iv}) => {
        cipherText = cipher;
      })
      .catch(error => {
        console.log(error);
      });
    let finalText = base64.encode(iv + cipherText);
    console.log('Base 64:', finalText);
    fetch(getTokenEndpoint, {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ciphertext: finalText,
      }),
    })
      .then(response => {
        console.log('Get Token Response', response);
        setToken(response.token);
      })
      .catch(error => console.log('Get Token Error', error));
  };
  useEffect(() => {
    getToken();
  }, []);

  const postImage = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(image => {
      let formData = new FormData();
      formData.append('image', {uri: image.path, type: image.mime});
      console.log(image, formData);
      fetch(uploadImage, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => {
          console.log('Upload Image Response', response);
          let newGallery = [...gallery];
          newGallery.push(response.link);
          setGallery(newGallery);
        })
        .catch(error => console.log('Upload Image Error', error));
    });
  };

  return (
    <View style={{height: '100%', width: '100%'}}>
      <Text style={styles.title}>Upload Image</Text>
      <TouchableOpacity onPress={() => postImage()} style={styles.btnContainer}>
        <Text style={styles.btnText}>Upload</Text>
      </TouchableOpacity>
      <ImageContainer gallery={gallery} />
    </View>
  );
};

export default Images;

const styles = StyleSheet.create({
  title: {
    padding: '5%',
    fontSize: 20,
  },
  btnContainer: {
    borderRadius: 5,
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    marginLeft: '5%',
    width: '30%',
    backgroundColor: '#808080',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
