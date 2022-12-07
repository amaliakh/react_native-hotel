import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks/';
import {IArticle} from '../constants/types';

const Article = ({
  title,
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
  const {colors, gradients, icons, sizes} = useTheme();

  // render card for Newest & Fashion

  return (
    <TouchableWithoutFeedback onPress={onPress}>
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
    </TouchableWithoutFeedback>
  );

  // render card for Popular
};

export default Article;
