import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  async function addToWatchlist(newSymbol) {
    var symbolsStr = JSON.stringify(state);
    var symbolsArray = JSON.parse(symbolsStr);
    if(symbolsArray === null){
      symbolsArray = [];
    }
    if(!(symbolsArray).includes(newSymbol)){
      symbolsArray.push(newSymbol);
    }
    setState(symbolsArray);
    await AsyncStorage.setItem('watchlist',JSON.stringify(symbolsArray));
  }

  useEffect(() => {
    AsyncStorage.getItem('watchlist')
      .then(response => JSON.parse(response))
      .then(symbolList => {
        setState(symbolList);
      });
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
