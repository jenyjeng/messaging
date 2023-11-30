import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import React from "react";


const ToolbarButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Text style= {style.button}>{title}</Text>
    </TouchableOpacity>
);
ToolbarButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default class Toolbar extends React.Component {
    static propTypes = {
        isFocused: PropTypes.bool.isRequired,
        onChangeFocus: PropTypes.func,
        onSubmit: PropTypes.func,
        onPressCamera: PropTypes.func,
        onPressLocation:PropTypes.func,
    };
    static deffaultProps = {
        onChangeFocus: () =>{},
        onSubmit: () =>{},
        onPressCamera: () =>{},
        onPressLocation: () =>{},
    };
    state = {
        text: "",
    };
    setInputRef = (ref) => {
        this.input = ref;
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused){
            if (this.props.isFocused) {
                this.setInputRef.focus();
            } else {
                this.setInputRef.blur();
            }
        }
        
    }
    handleFocus = () => {
        const { onChangeFocus } = this.props;
        onChangeFocus(true);
    };
    handleBlur = () => {
        const { onChangeFocus } = this.props;
        onChangeFocus(false);
    };

    handleChangeText = (text) => {
        this.setState({ text });
    };
    handleSubmitEditing = () => {
        const { onSubmit } = this.props;
        const { text } = this.state;
        if(!text) return;
        onSubmit(text);
        this.setState({ text: "" });
    };
    render() {
        const { onPressCamera, onPressLocation } = this.props;
        const { text } = this.state;
        return (
            <View style={StyleSheet.toolbar}>
                <ToolbarButton title={"📷"} onPress={onPressCamera} />
                <ToolbarButton title={"📍"} onPress={onPressLocation} />
                <View style={style.inputContainer}>
                    <TextInput
                        style={StyleSheet.input}
                        underlineColorAndroid={"transparent"}
                        placeholder={"Type something..."}
                        blurOnSubmit={false}
                        value={text}
                        onChangeText={this.handleChangeText}
                        onSubmitEditing={this.handleSubmitEditing}
                        
                    />
                </View>
            </View>
        );
    }

}

const style = StyleSheet.create ({
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        paddingLeft: 16,
        backgroundColor: "white",
        borderTopColor: "rgba(0,0,0,0.04)",
    },

    button: {
        top: -2,
        marginRight: 12,
        fontSize: 20,
        color: "black",
    },

});
