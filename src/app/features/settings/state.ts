import { atomWithStorage } from 'jotai/utils';

const endpointAtom = atomWithStorage('endpoint', process.env.NEXT_PUBLIC_DEFAULT_ENDPOINT || '');
const secretStorage = atomWithStorage('secret', '');
