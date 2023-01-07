import React, { useState, useEffect, useCallback } from "react";
import dayjs from 'dayjs';
import { NativeModules, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import Text from './Text';
import Block from './Block';
import Image from './Image';
import Button from './Button';
import {useTheme, useTranslation} from '../hooks/';
import {IArticle} from '../constants/types';
// import { SocialIcon } from "react-native-elements";
// import { BottomSheet } from "react-native-btr";

//import basic react native components
import { BottomSheet } from 'react-native-btr';

//import to show social icons
import { SocialIcon } from 'react-native-elements';
import { ScreenHeight } from "react-native-elements/dist/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";

const Article = ({
  description,
  image,
  category,
  rating,
  location,
  timestamp,
  user,
  onPress,
}: IArticle) => {
  const {t} = useTranslation();
  const navigation = useNavigation()
  const {colors, gradients, icons, sizes} = useTheme();

  const [loggedIn, setLoggedIn] = useState({ });
  const [visible, setVisible] = useState(false);
  const [listed, setListed] = useState(false)
  useEffect(() => {
    AsyncStorage.getItem('log').then((res)=>{
      if(res) {
        setLoggedIn(JSON.parse(res))
      }else setLoggedIn(null);
    })

    AsyncStorage.getItem(`${loggedIn.email}${image}`).then((res)=>{
      if(res === 'yes') {
        setListed(true)
        console.log(`${loggedIn.email}${image} ${res}`)
      }else setListed(false);
    })
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('log').then((res)=>{
      if(res) {
        setLoggedIn(JSON.parse(res))
      }else setLoggedIn(null);
    })

    AsyncStorage.getItem(`${loggedIn.email}${image}`).then((res)=>{
      if(res === 'yes') {
        setListed(true)
      }else {
        setListed(false);
      }
    })
  }, [visible]);

  const HandleWish = useCallback(() => {
    if(loggedIn){
      if(listed){
        AsyncStorage.removeItem(`${loggedIn.email}${image}`)
        setListed(false)
        setVisible(false)
        alert("Wishlist berhasil dihapus")
      }else{
        AsyncStorage.setItem(`${loggedIn.email}${image}`, 'yes')
        setListed(true)
        setVisible(false)
        alert("Wishlist berhasil ditambahkan")
      }
    }else{
      navigation.navigate('Login');
    }
  },[listed]);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };

  // render card for Newest & Fashion

  return (
    <TouchableWithoutFeedback onPress={toggleBottomNavigationView}>
      <Block>
        <Block card padding={sizes.sm} marginTop={sizes.sm}>
          <Image height={170} resizeMode="cover" source={{uri: image}} />
          {/* article category */}
          {category?.name && (
            <Text
              h5
              bold
              size={13}
              marginTop={sizes.s}
              transform="uppercase"
              marginLeft={sizes.xs}
              gradient={gradients.primary}>
              {category?.name}
            </Text>
          )}

          {/* article description */}
          {description && (
            <Text
              p
              marginTop={sizes.s}
              marginLeft={sizes.xs}
              marginBottom={sizes.sm}>
              {description}
            </Text>
          )}

          {/* user details */}
          {user?.name && (
            <Block row marginLeft={sizes.xs} marginBottom={sizes.xs}>
              <Image
                radius={sizes.s}
                width={sizes.xl}
                height={sizes.xl}
                source={{uri: user?.avatar}}
                style={{backgroundColor: colors.white}}
              />
              <Block justify="center" marginLeft={sizes.s}>
                <Text p semibold>
                  {user?.name}
                </Text>
                <Text p gray>
                  {t('common.posted', {
                    date: dayjs(timestamp).format('DD MMMM') || '-',
                  })}
                </Text>
              </Block>
            </Block>
          )}

          {/* location & rating */}
          {(Boolean(location) || Boolean(rating)) && (
            <Block row align="center">
              <Image source={icons.location} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {location?.city}, {location?.country}
              </Text>
              <Text p bold marginHorizontal={sizes.s}>
                •
              </Text>
              <Image source={icons.star} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {rating}/5
              </Text>
            </Block>
          )}
        </Block>

        <BottomSheet
          visible={visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={toggleBottomNavigationView}
          //Toggling the visibility state on the click of the back botton
          onBackdropPress={toggleBottomNavigationView}
          //Toggling the visibility state on the clicking out side of the sheet
        >
          {/*Bottom Sheet inner View*/}
          <Block style={styles.bottomNavigationView} card marginTop={(ScreenHeight/4)*1.3} paddingHorizontal={20} >

            <Image style={{height: 200, width: 330}} marginTop={15} resizeMode="cover" source={{uri: image}} />

            <Block row align="center" marginTop={6}>
              <Image source={icons.location} marginRight={sizes.s}/>
              <Text p size={12} semibold  >
                {location?.city}, {location?.country}
              </Text>
              <Text p bold marginHorizontal={sizes.s}>
                •
              </Text>
              <Image source={icons.star} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {rating}/5
              </Text>
            </Block>

            <Text
              marginTop={0}
              marginLeft={sizes.xs}
              marginBottom={0}
            >
              {description}
            </Text>

            <Block paddingVertical={80}  width={ScreenHeight/2}>
              <Button
                onPress={HandleWish}
                // marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                  {loggedIn ? (listed ?"Hapus dari wishlist" :"Tambahkan ke wishlist"): "Login"}
                </Text>
              </Button>
            </Block>

          </Block>
        </BottomSheet>
      </Block>

    </TouchableWithoutFeedback>
  );

  // render card for Popular
};

export default Article;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: ScreenHeight/2,
    // justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
