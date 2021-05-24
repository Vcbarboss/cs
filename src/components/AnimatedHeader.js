import React from 'react';
import { Animated, Dimensions } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import {Colors} from "../helpers/Colors";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const screenWidth = Dimensions.get('window').width;
const height = screenWidth;

const AnimatedHeader = ({children, curve}) => {
    return (
        <Svg
            height={height} // essa váriavel height será a responsável por calcular a proporção do SVG
            viewBox="0 0 64 32"
        >
            <Defs>
                <LinearGradient id="gradient" x1="0" y1="0" x2="64" y2="0">
                    <Stop offset="0" stopColor={Colors.primary} />
                    <Stop offset="1" stopColor={"#DDBD80"}/>
                </LinearGradient>
            </Defs>
            <AnimatedPath fill="url(#gradient)" d={curve} />
            {children}
        </Svg>
    );
};

export default AnimatedHeader;
