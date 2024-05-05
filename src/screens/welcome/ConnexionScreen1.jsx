import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const ConnexionScreen = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/test'); // Remplacez l'URL par celle de votre backend
      const responseData = await response.text();
      setData(responseData);
    } catch (error) {
      console.error('Erreur de communication avec le backend:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Données du backend:</Text>
      <Text>{data}</Text>
    </View>
  );
};

export default ConnexionScreen;