import React, { useCallback, useEffect, useState } from "react";
import { Platform, Linking, FlatList, NativeModules } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import { ArticleProfile, Block, Button, Image, Text } from "../components/";
import {useData, useTheme, useTranslation} from '../hooks/';
import { IArticle, ICategory } from "../constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "@react-native-async-storage/async-storage";
// import RNRestart from "react-native-restart";
import {Restart} from 'fiction-expo-restart';
const isAndroid = Platform.OS === 'android';

const Profile = () => {

  const data = useData();

  const selected = {id: 2, name:'Populer'};
  const [articles, setArticles] = useState<IArticle[]>([]);
  // init articles
  useEffect(() => {
    setArticles(data?.articles);
    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === selected?.id,
    );
    setArticles(newArticles)
  }, []);



  const {user} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, sizes} = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  const handleSocialLink = useCallback(
    (type: 'twitter' | 'dribbble') => {
      const url =
        type === 'twitter'
          ? `https://twitter.com/${user?.social?.twitter}`
          : `https://dribbble.com/${user?.social?.dribbble}`;

      try {
        Linking.openURL(url);
      } catch (error) {
        alert(`Cannot open URL: ${url}`);
      }
    },
    [user],
  );


  const getLog = async () => {
    try {
      const value = await AsyncStorage.getItem('log')
      if(value !== null) {
        return value
      }
    } catch(e) {
      console.log(e)
    }
  }

  const [userLog, setUserLog] = useState({});
  useEffect(() => {
    getLog().then((res)=>{
      setUserLog(JSON.parse(res));
    })
  }, []);


  const HandleSignOut = useCallback(() => {
    getLog().then((log)=>{
      AsyncStorage.removeItem('log');
      NativeModules.DevSettings.reload();
      // navigation.navigate("Home")
      alert("Mohon tunggu proses anda keluar")
      // RNRestart.Restart()
      Restart()
    })
    },[]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block

        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>

            <Block flex={0} align="center">
              <Image
                width={64}
                height={64}
                marginBottom={sizes.sm}
                source={{uri: user?.avatar}}
              />
              <Text h5 center white>
                {/*{user?.name}*/}
                {userLog.name}
              </Text>
              <Text h6 center white>
                {/*{user?.name}*/}
                {userLog.email}
              </Text>
              <Text p center white>
                {/*{user?.department}*/}
                {userLog.description}
              </Text>
            </Block>
          </Image>

          {/* profile: stats */}


          {/* profile: about me */}
          <Block paddingHorizontal={sizes.sm}>
            <Text h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
              {t('profile.aboutMe')}
            </Text>
            <Text p lineHeight={26}>
              {user?.about}
            </Text>
          </Block>

          {/* profile: photo album */}
          <Block paddingHorizontal={sizes.sm} marginBottom={20} >
            <Block row align="center" justify="space-between">
              {/*<Text h5 semibold>*/}
              {/*  /!*{t('common.album')}*!/*/}
              {/*  Pernah Dibooking*/}
              {/*</Text>*/}
              <Button marginTop={35}>
                <Text p primary semibold>
                  {/*{t('common.viewall')}*/}
                  Wishlist Hotel
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>

        <Block marginTop={20}>
          <FlatList
            data={articles}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item?.id}`}
            style={{paddingHorizontal: sizes.padding}}
            contentContainerStyle={{paddingBottom: sizes.l}}
            renderItem={({item}) => <ArticleProfile {...item} />}
          />
        </Block>

      </Block>

      <Button
        primary
        outlined
        shadow={!isAndroid}
        marginVertical={sizes.s}
        marginHorizontal={sizes.sm}
        onPress={HandleSignOut}>
        <Text bold primary transform="uppercase">
          {/*{t('common.signin')}*/}
          SIGN OUT
        </Text>
      </Button>


    </Block>
  );
};

export default Profile;
