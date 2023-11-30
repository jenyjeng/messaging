import React from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableHighlight, BackHandler } from 'react-native';
import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import Toolbar from './components/Toolbar';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg'),
      createTextMessage('Pug'),
      createTextMessage('Jeny'),
      createTextMessage('Zuela'),
      createLocationMessage({
        latitude: 17.568,
        longitude: 101.1235,
      }),
    ],
    isInputFocused: false,
    fullscreenImageId: null,
  };

  handlePressMessage = (message) => {
    console.log('Message pressed:', message);
    this.setState({ fullscreenImageId: message.id });
  };

  handlePressToolbarCamera = () => {
    // Implement camera handling
  };

  handlePressToolbarLocation = () => {
    // Implement location handling
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  renderMessageList() {
    return (
      <ImageBackground
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg' }}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {this.renderFullscreenImage()}
          <MessageList messages={this.state.messages} onPressMessage={this.handlePressMessage} />
        </View>
      </ImageBackground>
    );
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;

    const image = messages.find((message) => message.id === fullscreenImageId);
    if (!image) return null;

    const { uri } = image;
    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
        underlayColor="transparent"
      >
        <Image style={styles.fullscreenImage} source={{ uri }} resizeMode="contain" />
      </TouchableHighlight>
    );
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handleDeleteMessage = (id) => {
    this.setState((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    }));
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderMessageList()}
        {this.renderToolbar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  button: {
    top: 0, // Adjust the top value as needed
    marginRight: 12,
    fontSize: 20,
    color: 'black',
  },
  inputContainer: {
    flex: 1,
    
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 8,
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  messageContent: {
    flex: 1,
    backgroundColor: 'gray',
  },
  
});
