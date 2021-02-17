import PropTypes from 'prop-types';
import React from 'react';
import {
    View,
    WebView,
    Image,
    Linking,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';

export default class CustomView extends React.Component {
    renderPdf() {
        return (
            <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {

                Linking.openURL(`${this.props.currentMessage.pdf}`)

            }}>
                <Text>
                    {this.props.currentMessage.text}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.props.currentMessage.file_type == 'pdf') {
            return this.renderPdf();
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover'
    },
    webview: {
        flex: 1,
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});

CustomView.defaultProps = {
    mapViewStyle: {},
    currentMessage: {
        image: null,
        file_type: null,
        template: null,
        template_html: null,
    },
    containerStyle: {},
    imageStyle: {},
};

CustomView.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    mapViewStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    imageProps: PropTypes.object,
};
