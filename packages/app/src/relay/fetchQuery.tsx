import AsyncStorage from '@react-native-community/async-storage';
import { Variables, UploadableMap } from 'react-relay';

import { RequestNode } from 'relay-runtime';

import { handleData, getRequestBody, getHeaders, isMutation } from './helpers';
import fetchWithRetries from './fetchWithRetries';

import { DEV_TOKEN, GRAPHQL_URL } from 'react-native-dotenv';

// Define a function that fetches the results of a request (query/mutation/etc)
// and returns its results as a Promise:
const fetchQuery = async (
    request: RequestNode,
    variables: Variables,
    uploadables: UploadableMap
) => {
    try {
        // const token = DEV_TOKEN ? DEV_TOKEN : await AsyncStorage.getItem('token');
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWY5ODM4NzA4YWM1MDY0MzhkNDgwNTEiLCJ1c2VybmFtZSI6IlZpYyIsImVtYWlsIjoiYWJjMTIzQGEiLCJpYXQiOjE1OTM0MTA0Mzl9.f40J8eMx4W6Mx_3a9taJLWmNtSCMqwk6mcNxTW5Tdag';
        const body = getRequestBody(request, variables, uploadables);
        const headers = {
            ...getHeaders(uploadables, token)
        };

        const response = await fetchWithRetries(GRAPHQL_URL, {
            method: 'POST',
            headers,
            body,
            fetchTimeout: 20000,
            retryDelays: [1000, 3000, 5000]
        });

        console.log('response: ', response);
        const data = await handleData(response);

        if (response.status === 401) {
            throw data.errors;
        }

        if (isMutation(request) && data.errors) {
            throw data;
        }

        if (!data.data) {
            throw data.errors;
        }

        return data;
    } catch (err) {
        // eslint-disable-next-line
        console.log('err: ', err);

        const timeoutRegexp = new RegExp(/Still no successful response after/);
        const serverUnavailableRegexp = new RegExp(/Failed to fetch/);
        if (
            timeoutRegexp.test(err.message) ||
            serverUnavailableRegexp.test(err.message)
        ) {
            throw new Error('Unavailable service. Try again later.');
        }

        throw err;
    }
};

export default fetchQuery;
