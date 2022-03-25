import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Animated,
    ScrollView,
    Platform
} from 'react-native';
import { dummyData, SIZES, FONTS, COLORS, icons, images } from '../constants'
import TextButton from "../components/TextButton"


const COUNTRIES_ITEM_SIZE = SIZES.width / 3;
const PLACES_ITEM_SIZE = SIZES.width / 1.2
const EMPTY_ITEM_SIZE = (SIZES.width - PLACES_ITEM_SIZE) / 2

const Dashboard = ({ navigation }) => {

    const countryScrollX = useRef(new Animated.Value(0)).current;
    const placesScrollX = useRef(new Animated.Value(0)).current;
    const [countries, setCountries] = useState([{ id: -1 }, ...dummyData.countries, { id: -2 }])
    const [places, setPlaces] = useState([{ id: -1 }, ...dummyData.countries[0].places, { id: -2 }])
    const [placesScrollPosition, setPlacesScrollPosition] = useState(0)



    function renderHeader() {
        return (
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.base,
                alignItems: 'center',
                marginTop: 40
            }}>

                <TouchableOpacity style={{
                    width: 45,
                    height: 45,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                // onPress={() => console.log("SLide Drawer")}
                >
                    <Image
                        source={icons.side_drawer}
                        resizeMode='contain'
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                        ASIA
                    </Text>
                </View>

                <TouchableOpacity onPress={() => console.log("Profile")}>
                    <Image source={images.profile_pic}

                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                        }} />
                </TouchableOpacity>
            </View>
        )
    }

    function renderCountries() {
        return (
            <Animated.FlatList
                horizontal
                pagingEnabled//停在整数倍位置
                snapToAlignment='center'//在中间
                snapToInterval={COUNTRIES_ITEM_SIZE}//设定每个宽度 屏幕宽的三分之一
                showsHorizontalScrollIndicator={false}//隐藏滚动条 true显示滚动条
                scrollEventThrottle={16}//16就可以 how often the scroll event will be fired while scrolling 
                decelerationRate={0}//用户抬起手指之后，滚动视图减速停下的速度 "normal"或者"fast
                data={countries}
                keyExtractor={item => `${item.id}`}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: countryScrollX } } }],
                    { useNativeDriver: false }
                )}//触发事件  
                // contentOffset 初始的滚动坐标。默认值为{x: 0, y: 0}。
                // countryScrollX 初始化带current  useRef(new Animated.Value(0)).current;
                // 其他位置调用时不带current  const opacity = countryScrollX.interpolate
                onMomentumScrollEnd={(event) => {//滚动结束时调用
                    //to calculate current position
                    let position = (event.nativeEvent.contentOffset.x / COUNTRIES_ITEM_SIZE).toFixed(0)
                    // console.log(position);
                    //setting the place acc to the position
                    setPlaces([
                        { id: -1 },
                        ...dummyData.countries[position].places,
                        { id: -2 }
                    ])
                }}
                renderItem={({ item, index }) => {
                    // console.log((index - 1) * COUNTRIES_ITEM_SIZE);
                    const opacity = countryScrollX.interpolate({
                        inputRange: [
                            (index - 2) * COUNTRIES_ITEM_SIZE,
                            (index - 1) * COUNTRIES_ITEM_SIZE,//后一个亮 index初始0 用加减调位置
                            (index) * COUNTRIES_ITEM_SIZE,
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })

                    const mapSize = countryScrollX.interpolate({
                        inputRange: [
                            (index - 2) * COUNTRIES_ITEM_SIZE,
                            (index - 1) * COUNTRIES_ITEM_SIZE,
                            (index) * COUNTRIES_ITEM_SIZE,
                        ],
                        outputRange: [25, 70, 25],
                        extrapolate: 'clamp'
                    })

                    const fontSize = countryScrollX.interpolate({
                        inputRange: [
                            (index - 2) * COUNTRIES_ITEM_SIZE,
                            (index - 1) * COUNTRIES_ITEM_SIZE,
                            (index) * COUNTRIES_ITEM_SIZE,
                        ],
                        outputRange: [15, 20, 15],
                        extrapolate: 'clamp'
                    })

                    if (index == 0 || index == countries.length - 1) {
                        return (
                            <View style={{
                                width: COUNTRIES_ITEM_SIZE
                            }}>

                            </View>
                        )
                    }
                    else {
                        return (
                            <Animated.View
                                opacity={opacity}
                                style={{
                                    height: 130,
                                    width: COUNTRIES_ITEM_SIZE,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <Animated.Image
                                    source={item.image}
                                    resizeMode='contain'
                                    style={{
                                        width: mapSize,
                                        height: mapSize,
                                        tintColor: COLORS.white,
                                    }} />
                                <Animated.Text style={{
                                    // width: 200,
                                    marginTop: 3,
                                    color: COLORS.white,
                                    ...FONTS.h1,
                                    fontSize: fontSize
                                }}>
                                    {item.name}
                                </Animated.Text>
                            </Animated.View>
                        )
                    }
                }}
            >
            </Animated.FlatList>
        )
    }

    function exploreButtonHandler() {
        //Get places current index
        const currentIndex = parseInt(placesScrollPosition, 10) + 1

        //navigate to next
        console.log(places[currentIndex])
        navigation.navigate("Place", { selectedPlace: places[currentIndex] })
    }

    function renderPlaces() {
        return (
            <Animated.FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={places}
                keyExtractor={item => `${item.id}`}
                contentContainerStyle={{ alignItems: 'center', }}
                snapToAlignment='center'
                snapToInterval={PLACES_ITEM_SIZE}//设定每个滑动宽度
                scrollEventThrottle={16}
                decelerationRate={0}
                bounces={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: placesScrollX } } }],
                    { useNativeDriver: false })}
                onMomentumScrollEnd={(event) => {
                    //to calculate the position
                    var position = (event.nativeEvent.contentOffset.x / PLACES_ITEM_SIZE).toFixed(0)

                    //set scroll position
                    setPlacesScrollPosition(position)//滚动结束设置该国家的地点 给下面的滚动
                }}
                renderItem={({ item, index }) => {
                    const opacity = placesScrollX.interpolate({
                        inputRange: [
                            (index - 2) * PLACES_ITEM_SIZE,
                            (index - 1) * PLACES_ITEM_SIZE,
                            (index) * PLACES_ITEM_SIZE
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })

                    let activeHeight = SIZES.height / 1.7

                    // if (Platform.OS === 'ios') {
                    //     if (SIZES.height > 800) {
                    //         activeHeight = SIZES.height / 2
                    //     }
                    //     else {
                    //         activeHeight = SIZES.height / 1.65
                    //     }
                    // }
                    // else {
                    //     activeHeight = SIZES.height / 1.7
                    // }

                    const height = placesScrollX.interpolate({
                        inputRange: [
                            (index - 2) * PLACES_ITEM_SIZE,
                            (index - 1) * PLACES_ITEM_SIZE,
                            (index) * PLACES_ITEM_SIZE
                        ],
                        outputRange: [SIZES.height / 2, activeHeight, SIZES.height / 2],
                        extrapolate: 'clamp'
                    })

                    if (index == 0 || index == places.length - 1) {
                        return (
                            <View style={{
                                width: EMPTY_ITEM_SIZE
                            }}>

                            </View>
                        )
                    }

                    else {
                        return (
                            <Animated.View
                                opacity={opacity}
                                style={{
                                    width: PLACES_ITEM_SIZE,
                                    height: height,
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 10
                                }}>
                                <Image
                                    source={item.image}
                                    resizeMode='cover'
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 20
                                    }}
                                />

                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    marginHorizontal: SIZES.padding
                                }}>
                                    <Text style={{
                                        marginBottom: SIZES.radius,
                                        color: COLORS.white,
                                        ...FONTS.h1
                                    }}>
                                        {item.name}
                                    </Text>

                                    <Text style={{
                                        marginBottom: SIZES.padding * 2,
                                        textAlign: 'center',
                                        color: COLORS.white,
                                        ...FONTS.body3
                                    }}>
                                        {item.description}
                                    </Text>
                                    <TextButton
                                        label="Explore"
                                        customContainerStyle={{
                                            position: 'absolute',
                                            bottom: -20,
                                            width: 150
                                        }}
                                        onPress={() => exploreButtonHandler()}
                                    />
                                </View>
                            </Animated.View>
                        )
                    }
                }}
            />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
            {renderHeader()}
            <View contentContainerStyle={{
                flex: 1,
            }}>
                <View style={{ height: 900 }}>
                    <View>
                        {renderCountries()}
                    </View>
                    <View style={{
                        height: 500,
                    }}>
                        {renderPlaces()}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default Dashboard;