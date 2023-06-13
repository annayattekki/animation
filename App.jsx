import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Sound from "react-native-sound";

const itemData = [
  {
    title: "Start Training",
    id: 1,
    icon: require("./Images/gun.png"),
  },
  {
    title: "X-Gun",
    id: 2,
    icon: require("./Images/bt.png"),
  },
  {
    title: "Body Cam Replay",
    id: 3,
    icon: require("./Images/video.png"),
  },
  {
    title: "After Action Review",
    id: 4,
    icon: require("./Images/chat.png"),
  },
];

export const pixel = (pixel, type) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const data =
    type === 1
      ? ((pixel / 100) * height).toFixed(0)
      : ((pixel / 100) * width)?.toFixed(0);

  return Number(data);
};

const ListItemAnimation = () => {
  const translateYValue = useRef(new Animated.Value(pixel(0, 1))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const items = [...itemData];
  const animatedValues = useRef(items.map(() => new Animated.Value(0))).current;
  const animatedColorValue = new Animated.Value(0);
  const animatedTintValue = useRef(new Animated.Value(0)).current;
  const [logo, setLogo] = React.useState(false);
  const [gradientColors, setGradientColors] = React.useState([
    "#01172D",
    "#000000",
  ]);

  const animateItems = () => {
    play();
    items.forEach((item, index) => {
      Animated.sequence([
        Animated.delay(index * 500),
        Animated.spring(animatedValues[index], {
          toValue: 1,
          useNativeDriver: true,
          friction: 2,
        }),
        Animated.delay(1000),
      ]).start(() => {});
    });
  };

  useEffect(() => {
    translateYValue.addListener(({ value }) => {
      if (value >= 60) {
        Animated.timing(animatedColorValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    });

    return () => {
      translateYValue.removeAllListeners();
    };
  }, [translateYValue, animatedColorValue]);

  useEffect(() => {
    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 0.4,
      duration: 3000,
      useNativeDriver: true,
    });
    setTimeout(() => {
      setLogo(require("./Images/logoMain.png"));
    }, 2500);

    const moveAnimation = Animated.timing(translateYValue, {
      toValue: pixel(56, 1),
      duration: 1000,
      useNativeDriver: true,
    });
    Animated.sequence([fadeInAnimation, moveAnimation]).start(() => {
      animateItems();
    });
  }, [fadeAnim, translateYValue]);

  useEffect(() => {
    translateYValue.addListener(({ value }) => {
      if (value >= 60) {
        Animated.timing(animatedColorValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();

        Animated.timing(animatedTintValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
    });

    return () => {
      translateYValue.removeAllListeners();
    };
  }, [translateYValue, animatedTintValue]);

  const play = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        const sound = new Sound("gun.mp3", Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log("Error loading sound:", error);
            return;
          }
          sound.play((success) => {
            if (success) {
              setTimeout(() => {
                sound.stop();
                sound.release();
              }, 500);
            }
          });
        });
      }, index * 500);
    });
  };

  const renderItem = (item, index) => {
    const animationStyle = {
      opacity: animatedValues[index],
      transform: [
        {
          translateY: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
        {
          scale: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        },
      ],
    };
    return (
      <Animated.View style={[animationStyle]} key={index}>
        {SelectModeScreen(item, index)}
      </Animated.View>
    );
  };

  function SelectModeScreen(item, index) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => console.log("btn pressed")}>
          <View style={[styles.buttonParent]}>
            <LinearGradient
              colors={["#072E89", "#072E89"]}
              style={[
                styles.buttonGrad,
                {
                  opacity: 0.8,
                },
              ]}
            >
              <Image
                source={item.icon}
                style={[styles.icon, { marginLeft: 10 }]}
                resizeMode={"contain"}
              />
              <Text
                style={[
                  styles.buttonTitle,
                  {
                    lineHeight: 30,
                    textAlign: "center",
                  },
                ]}
              >
                {item?.title}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          marginTop: pixel(4, 1),
        }}
      >
        {items.map((item, index) => renderItem(item, index))}
      </View>
      <Animated.View
        style={[
          {
            transform: [{ translateY: translateYValue }],
          },
          {
            alignItems: "center",
          },
        ]}
      >
        <Animated.Image
          source={
            logo
              ? require("./Images/logoMain1.png")
              : require("./Images/logoMain1.png")
          }
          style={[
            {
              opacity: fadeAnim,
            },
            {
              height: pixel(30, 1),
              width: pixel(30, 1),
            },
          ]}
          resizeMode={"contain"}
        />
      </Animated.View>
    </LinearGradient>
  );
};

export default ListItemAnimation;

const styles = StyleSheet.create({
  icon: {
    height: pixel(4, 1),
    width: pixel(4, 1),
    marginRight: pixel(2, 2),
  },
  buttonTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  item: {
    height: pixel(10, 1),
    width: pixel(90, 2),
    backgroundColor: "rgba(38, 122, 199, 0.25)",
    borderWidth: 2,
    borderColor: "rgba(161, 210, 255, 90)",
    alignSelf: "center",
    marginVertical: pixel(1.3, 1),
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: pixel(4, 2),
    shadowColor: "#0085FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: pixel(1, 1),
    borderTopWidth: 10,
    borderTopColor: "#E0E0E0",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  buttonGrad: {
    height: pixel(10, 1),
    width: pixel(90, 2),
    backgroundColor: "#A1D2FF",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: pixel(4, 2),
  },
  buttonParent: {
    height: pixel(10, 1),
    width: pixel(90, 2),
    backgroundColor: "#A1D2FF",
  },
});
