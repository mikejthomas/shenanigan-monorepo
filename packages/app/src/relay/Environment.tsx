import { installRelayDevTools } from 'relay-devtools';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import {setupSubscription} from './setupSubscription';

import cacheHandler from './cacheHandler';

const __DEV__ = process.env.NODE_ENV === 'development';
if (__DEV__) {
    installRelayDevTools();
}

const network = Network.create(cacheHandler, setupSubscription);

const source = new RecordSource();
const store = new Store(source);

// export const inspector = new RecordSourceInspector(source);

const env = new Environment({
    network,
    store
});

export default env;
