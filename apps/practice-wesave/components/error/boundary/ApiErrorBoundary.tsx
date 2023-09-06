import React, { PropsWithChildren } from 'react';

import NetworkError from '../NetworkError';
import UnknownError from '../UnknowError';

interface ApiErrorBoundaryProps {
  error?: { message: string; type?: 'network' | 'auth' | 'unknown' };
}

type AuthErrorBoundaryState = {
  hasError: boolean;
};

export default class ApiErrorBoundary extends React.Component<
  PropsWithChildren<ApiErrorBoundaryProps>,
  AuthErrorBoundaryState
> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  //   Todo:connect monitoring api
  componentDidCatch(): void {}

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.error?.type === 'network') {
      return <NetworkError />;
    }

    return <UnknownError />;
  }
}
