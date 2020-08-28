import { CreateSongInput } from '../../../../api';
import { CreateSong } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Song/CreateSong';
import { LookupField } from '../../index';
import {
  SongLookupItemFragment as Song,
  useSongLookupLazyQuery,
} from './SongLookup.generated';

export const SongField = LookupField.createFor<Song, CreateSongInput>({
  resource: 'Song',
  useLookup: useSongLookupLazyQuery,
  CreateDialogForm: CreateSong,
  getInitialValues: (value) => ({
    song: {
      name: value,
    },
  }),
});