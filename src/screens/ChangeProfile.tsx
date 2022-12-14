import React, { useCallback, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { useData, useTheme, useTranslation } from "../hooks/";
import * as regex from "../constants/regex";
import { Block, Button, Input, Image, Text, Checkbox } from "../components/";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isAndroid = Platform.OS === "android";

interface IRegistration {
  name: string;
  email: string;
  password: string;
  description: string;
}

interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
}

const ChangeProfile = () => {
  const { isDark } = useData();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    description: true
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: "",
    email: "",
    password: "",
    description: "",
  });
  const { assets, colors, gradients, sizes } = useTheme();

  const [data, setData] = useState<IRegistration>(null);

  useEffect(() => {
    AsyncStorage.getItem('log').then((res)=>{
      setRegistration(JSON.parse(res))
    })
  },[]);


  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({ ...state, ...value }));
    },
    [setRegistration]
  );

  const handleSignUp = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
      const regisJson = JSON.stringify(registration)
      AsyncStorage.setItem(registration.email, regisJson);
      AsyncStorage.setItem('log', regisJson);
      alert("Profile berhasil diubah");
      navigation.navigate("Home")
    // console.log(data.name)
    }
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{ zIndex: 0 }}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{ rotate: "180deg" }]}
              />
              <Text p white marginLeft={sizes.s}>
                {t("common.goBack")}
              </Text>
            </Button>

            <Text h4 center white marginBottom={sizes.md}>
              {/*{t("register.title")}*/}
              Ubah Profile
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? "padding" : "height"}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
           >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>

             <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>

                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  value={registration.name}
                  // label={t('common.name')}
                  // placeholder={t('common.namePlaceholder')}
                  label={"Nama"}
                  // placeholder={"Masukkan nama lengkap anda"}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({ name: value })}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  disabled={true}
                  value={registration.email}
                  label={t("common.email")}
                  keyboardType="email-address"
                  // placeholder={t('common.emailPlaceholder')}
                  placeholder={"Masukkan email"}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({ email: value })}
                />
                <Input
                  // secureTextEntry
                  value={registration.password}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t("common.password")}
                  // placeholder={t('common.passwordPlaceholder')}
                  placeholder={"Buat password"}
                  onChangeText={(value) => handleChange({ password: value })}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
                <Input
                  autoCapitalize="none"
                  value={registration.description}
                  marginBottom={sizes.m}
                  // label={t('common.name')}
                  // placeholder={t('common.namePlaceholder')}
                  label={"Deskripsi"}
                  placeholder={"Deskripsikan diri anda"}
                  success={Boolean(registration.description && isValid.description)}
                  danger={Boolean(registration.description && !isValid.description)}
                  onChangeText={(value) => handleChange({ description: value })}
                />
              </Block>

              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  {/*{t("common.signup")}*/}
                  Ubah Profile
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ChangeProfile;
