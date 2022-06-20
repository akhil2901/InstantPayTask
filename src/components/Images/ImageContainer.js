import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ImageContainer = ({gallery}) => {
  const renderImage = ({item}) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item,
          }}
          style={styles.image}
        />
      </View>
    );
  };
  return (
    <View style={{marginLeft: '5%', marginTop: '5%'}}>
      <Text style={{fontSize: 18}}>Uploaded Images</Text>
      <FlatList
        data={gallery}
        renderItem={renderImage}
        numColumns={3}
        style={{marginTop: '2%'}}
        contentContainerStyle={{
          width: '95%',
        }}
      />
    </View>
  );
};

export default ImageContainer;

const styles = StyleSheet.create({
  imageContainer: {height: 150, width: 110, marginRight: 10, marginTop: 10},
  image: {flex: 1},
});
