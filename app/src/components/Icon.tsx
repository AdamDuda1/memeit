import { Image } from 'expo-image';

import { colors } from '@/theme';

const icons = {
  home: [require('@/assets/icons/home.svg'), require('@/assets/icons/home_filled.svg')],
  explore: [require('@/assets/icons/explore.svg'), require('@/assets/icons/explore_filled.svg')],
  challenge: [require('@/assets/icons/challenge.svg'), require('@/assets/icons/challenge_filled.svg')],
  profile: [require('@/assets/icons/profile.svg'), require('@/assets/icons/profile_filled.svg')],
  favorite: [require('@/assets/icons/favorite.svg'), require('@/assets/icons/favorite_filled.svg')],
  bookmark: [require('@/assets/icons/bookmark.svg'), require('@/assets/icons/bookmark_filled.svg')],
  more: [require('@/assets/icons/more.svg')],
  new: [require('@/assets/icons/new.svg')],
  report: [require('@/assets/icons/report.svg')],
  search: [require('@/assets/icons/search.svg')],
  settings: [require('@/assets/icons/settings.svg')],
  share: [require('@/assets/icons/share.svg')],
};

export type IconName = keyof typeof icons;

type Props = { name: IconName; size?: number; color?: string; filled?: boolean };

export function Icon({ name, size = 24, color = colors.text, filled = false }: Props) {
  const [outline, solid = outline] = icons[name];
  return <Image source={filled ? solid : outline} style={{ width: size, height: size }} tintColor={color} />;
}
