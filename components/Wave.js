import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import global from "../global";

export default function Wave() {
  return (
    <View style={{ width: "100%", top: 0 }}>
      <View style={{ backgroundColor: global.PRIMARY_COLOR, height: 120 }}>
        <Svg
          height="75%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{ top: 110 }}
        >
          <Path
            fill={global.PRIMARY_COLOR}
            d="M0,160L40,170.7C80,181,160,203,240,181.3C320,160,400,96,480,80C560,64,640,96,720,122.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,170.7C1280,149,1360,107,1400,85.3L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          />
        </Svg>
      </View>
    </View>
  );
}
