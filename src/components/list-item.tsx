import React from 'react';
import {RealmItemPlain} from '../models/realm-item';
import {PressableFrame, Tittle} from './styled';

type Props = {
  item: RealmItemPlain;
  onPress: () => void;
};

export const ListItem: React.FC<Props> = ({item, onPress}) => (
  <PressableFrame onPress={onPress}>
    <Tittle>{item._id}</Tittle>
  </PressableFrame>
);
