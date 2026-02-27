import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function RootToDocs() {
  const history = useHistory();
  useEffect(() => {
    history.replace('/docs/');
  }, [history]);
  return null;
}
