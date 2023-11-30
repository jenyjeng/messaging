import  Constants  from 'expo-constants';  
import { Platform, StatusBar, StyleSheet, Text, View, Animated } from 'react-native';  
import NetInfo from "@react-native-community/netinfo";
import { useRef } from 'react';

import React from 'react';  


export default class Status extends React.Component{  
    state = {  
        isConnected: true,
        fadeAnim: new Animated.Value(0),
    };

    componentDidMount() {
        NetInfo.fetch().then((state) => {
          this.setState({ isConnected: state.isConnected,
                          type: state.type});
        });
            // Subscribe to network status changes
    this.unsubscribe = NetInfo.addEventListener((state) => {
        this.setState(
          {
            isConnected: state.isConnected,
            type: state.type,
          },
          () => {
            // Add the animation to fade in or fade out the bubble
            Animated.timing(this.state.fadeAnim, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true
            }).start(() => {
              if (!this.state.isConnected) {
                // If not connected, start a fade-out animation
                Animated.timing(this.state.fadeAnim, {
                  toValue: 0,
                  duration: 10000,
                  useNativeDriver: true
                }).start();
              }
            });
          }
        );
      });
    }
    componentWillUnmount() {
        // Unsubscribe from network status changes
        if (this.unsubscribe) {
          this.unsubscribe();
        }
    }
    render() {  
        //const {info} = this.state;
        const { isConnected, type, fadeAnim } = this.state;
        /*Change the status bar color from green to red
        Green if it is connected to wifi
        Red if it is not connected to wifi  
        */
        const backgroundColor = isConnected ? 'green' : 'red';
        const statusBar = ( 
            <StatusBar 
                backgroundColor={backgroundColor} 
                barStyle={isConnected ? 'dark-content' : 'light-content'} 
                animated={true} 
                /> 
            );
        // Displays some text and the message bubble
        const messageContainer = (
            <View style={styles.messageContainer}>
            {statusBar}
                <View style={styles.myName}>
                    <Text style={styles.text}> Abelardo from 1900 </Text>
                </View>
                {isConnected && type ? (
                    <Animated.View style={{ 
                        ...styles.networkUpBubble, 
                        opacity: fadeAnim }}>
                        <Text style={styles.text}>Type: {type} </Text>
                        <Text style={styles.text}>There is a {type} network connection</Text>
                    </Animated.View>
                ) : (
                    <Animated.View style={{ 
                        ...styles.networkDownbubble, 
                        opacity: fadeAnim }}>
                        <Text style={styles.text}>Type: {type} </Text>
                        <Text style={styles.text}>No {type} network connection</Text>
                    </Animated.View>
                )}
            </View>
        );
        if(Platform.OS === "ios"){
            return (
            <View style={[styles.status, {backgroundColor}]}>
                {messageContainer}
            </View>
            );
        }
        return messageContainer;
    }
}
const statusHeight = (Platform.OS === "ios" ? Constants.statusBarHeight : 0)

const styles = StyleSheet.create({  
    status: {  
        zIndex: 1,
        height: statusHeight
    },
    messageContainer: {
        zIndex: 1, 
        position: 'absolute',
        top: statusHeight + 20,
        left: 0,
        right: 0,
        height: 80,
        alignItems: 'center',
    },
    networkDownbubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red',
    },
    networkUpBubble: {
        //position: 'absolute',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'green',
        elevation: 10
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    myName: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#3875F0',
        marginBottom: 20
    },
}) 
