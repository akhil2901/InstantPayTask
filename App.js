import React from 'react';
import type {Node} from 'react';
import {SafeAreaView} from 'react-native';
import Images from './src/screens/Images';

const App: () => Node = () => {
  return (
    <SafeAreaView>
      <Images />
    </SafeAreaView>
  );
};

export default App;
