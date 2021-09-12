import React, { useState, useEffect } from 'react';
import { StyleSheet, View, VirtualizedList, TouchableOpacity, Text, } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

const Summaries = ({ obj, selectedOrganization }) => {
  return (
    <View key={obj.id_}>
      <TouchableOpacity style={styles.summariesRow} onPress={() => { selectedOrganization(obj) }}>
        <Text style={[styles.listText]}>{obj.symbol_}</Text>
        <Text style={[styles.listText, styles.listRight]}>{obj.close_}</Text>
        <Text style={{ flex: 1 }}></Text>
        <Text style={[(obj.color_ == 'red') ? styles.redTxt : styles.grnTxt, styles.listText, styles.listRight]}>{obj.diff_}</Text>
      </TouchableOpacity>
    </View>
  );
};

const DetailedView = (({ organization }) => {
  return (
    <View>
      {organization.name_ !== undefined ?
        <View style={{ backgroundColor: '#2d2d2d' }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, padding: 20 }}>{organization.name_}</Text>
          <View style={styles.summaryItemContainer}>
            <Text style={styles.summaryItem}>{"OPEN"}</Text>
            <Text style={styles.summaryItem}>{organization.open_}</Text>
            <Text style={styles.summaryItem}>{"LOW"}</Text>
            <Text style={styles.summaryItem}>{organization.low_}</Text>
          </View>
          <View style={styles.summaryItemContainer}>
            <Text style={styles.summaryItem}>{"CLOSE"}</Text>
            <Text style={styles.summaryItem}>{organization.close_}</Text>
            <Text style={styles.summaryItem}>{"HIGH"}</Text>
            <Text style={styles.summaryItem}>{organization.high_}</Text>
          </View>
          <View style={styles.summaryItemContainer}>
            <Text style={styles.summaryItem}>{"VOLUME"}</Text>
            <Text style={styles.summaryItem}>{organization.volumes_}</Text>
            <Text style={styles.summaryItem}>{""}</Text>
            <Text style={styles.summaryItem}>{""}</Text>
          </View>
        </View>
        : null}
    </View>
  );
});

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [map, setMap] = useState(new Map());
  const [selectedOrganization, setSelectedOrganization] = useState({});

  useEffect(() => {
    var tempMap = map;
    if (watchList !== null) {
      watchList.forEach(listItem => {
        if (!tempMap.has(listItem)) {
          tempMap.set(listItem, { timestamp: 'none', symbol: listItem, name: 'none', industry: 'none', open: 0.0, high: 0.0, low: 0.0, close: 0.0, volumes: 0 });
          fetch(ServerURL + '/history?symbol=' + listItem)
            .then(response => response.json())
            .then(resData => {
              if (resData[0] !== undefined) {
                tempMap.set(listItem, resData[0]);
              }
              setMap(tempMap);
              setState(watchList);
            });
        }
      });
    }
  }, [watchList]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <VirtualizedList
          data={state}
          renderItem={({ item }) => <Summaries obj={item} selectedOrganization={setSelectedOrganization} />}
          keyExtractor={summary => summary.id}
          getItemCount={() => (state === null) ? 0 : state.length}
          getItem={(data, index) => {
            var dataObj = map.get(data[index]);
            return {
              id_: index.toString(),
              symbol_: `${dataObj.symbol}`,
              name_: `${dataObj.name}`,
              open_: `${dataObj.open}`,
              close_: `${dataObj.close}`,
              high_: `${dataObj.high}`,
              low_: `${dataObj.low}`,
              volumes_: `${dataObj.volumes}`,
              diff_: `${(dataObj.close - dataObj.open) / 100}%`,
              color_: `${((dataObj.close - dataObj.open) / 100) >= 0 ? 'green' : 'red'}`,
            }
          }}
        />
      </View>
      <View style={styles.bottom}>
        <DetailedView organization={selectedOrganization} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  grnTxt: {
    flex: 2,
    backgroundColor: 'green',
    height: '100%',
    padding: 6,
    width: '50%',
    borderRadius: 5
  },

  redTxt: {
    flex: 2,
    backgroundColor: 'red',
    height: '100%',
    padding: scaleSize(6),
    width: '50%',
    borderRadius: scaleSize(5),
  },

  listText: {
    color: 'white',
    flex: 2,
    fontSize: scaleSize(18),
  },

  listRight: {
    textAlign: 'right'
  },

  summariesRow: {
    padding: scaleSize(20),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: '#212121',
    display: 'flex',
    flexDirection: 'row',
  },

  summaryItem: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    flex: 1,
  },

  summaryItemContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    borderBottomColor: '#3d3a3a', 
    borderBottomWidth: 1, padding: 10
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  top: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  
  container: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%'
  },
});