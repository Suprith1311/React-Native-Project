import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, Text, VirtualizedList, TouchableOpacity } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = (props) => {
  const searchTitle = "Type a company name or stock symbol:\n";
  const searchPlaceholder = "Enter Stock Name";
  return (
    <View style={styles.searchContainer}>
      <Text style={{ color: 'white' }}>{searchTitle}</Text>
      <View style={ styles.searchBox }>
      <Ionicons name="md-search" size={30} style={{ flex: 1, color: 'white' }}></Ionicons>
      <TextInput
        key="searchbox"
        onChangeText={text => props.txt(text)}
        style={{ flex: 8 }}
        placeholder={searchPlaceholder}
      />
      </View>
    </View>
  );
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);

  const [searchTxt, onChangeSearchTxt] = useState('');

  const [output, setOutput] = useState([]);

  let idGenerator = 0;

  useEffect(() => {
    fetch(ServerURL + '/all')
      .then(response => response.json())
      .then(resData => {
        setState(resData);
        setOutput(resData);
      });
  }, []);

  useEffect(()=>{
    setOutput(state.filter((item)=>(item.symbol).includes(searchTxt)));
  },[searchTxt]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SearchBar txt={onChangeSearchTxt}/>
        <VirtualizedList
          data={output}
          key="searchList"
          renderItem={(obj) => {
            idGenerator++;
            return (
              <View>
                <TouchableOpacity key={'search_'+idGenerator.toString()} style={styles.searchRow} onPress={() => addToWatchlist(obj.item.symbol_) && navigation.navigate({ name: 'Stocks' })}>
                  <Text style={{ fontSize: scaleSize(18), color: 'white' }}>{obj.item.symbol_}</Text>
                  <Text style={{ fontSize: scaleSize(15), color: 'white' }}>{obj.item.company_}</Text>
                </TouchableOpacity>
              </View>
            )
          }}
          keyExtractor={obj => obj.id}
          getItemCount={()=>output.length}
          getItem={(data, index) => {
            return {
              symbol_: `${data[index].symbol}`,
              company_: `${data[index].name}`,
            }
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({

  searchRow:
  {
    padding: scaleSize(15),
    borderBottomColor: '#2d2d2d',
    borderBottomWidth: scaleSize(1),
  },

  searchContainer:
  {
    alignItems: 'center',
  },

  searchBox: {
    width: '80%',
    height: scaleSize(50),
    backgroundColor: '#353535', 
    borderRadius: scaleSize(30), 
    paddingLeft: scaleSize(10), 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },

});