import * as React from 'react';
import { memo, Suspense, useState } from 'react';
import { CacheProvider, useCache } from './Cache';
import QueryablePromise from './QueryablePromise';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  console.log('inside error fallback');
  return <div>asdfadsf</div>;
}

function useQuery() {
  const cache = useCache();
  const [promise] = useState<QueryablePromise<string[]>>(() => {
    const key = 'loadingState';
    if (cache.has(key)) {
      return cache.get(key) as QueryablePromise<string[]>;
    } else {
      const promise = new QueryablePromise<string[]>((resolve, reject) => {
        setTimeout(() => {
          resolve(['yek', 'do', 'se', 'chehaar']);
        }, 5000);
      });
      cache.set(key, promise);
      return promise;
    }
  });

  switch (promise.status) {
    case 'pending':
      throw promise;
    case 'rejected':
      throw promise.error;
    case 'resolved':
      return promise.value;
  }
}

function Content() {
  const listItems = useQuery();
  return (
    <ul>
      {listItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CacheProvider>
        <Suspense fallback="loading...">
          <Content />
        </Suspense>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default memo(App);
