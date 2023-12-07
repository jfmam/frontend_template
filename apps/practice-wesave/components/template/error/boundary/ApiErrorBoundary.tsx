import React, { PropsWithChildren } from 'react';

import { NetworkError, UnknownError } from '@/components/section';
import { isInstanceOfAPIError } from '@/common';

interface ApiErrorBoundaryProps {
  error?: unknown;
}

type AuthErrorBoundaryState = {
  hasError: boolean;
  error: unknown;
};

export default class ApiErrorBoundary extends React.Component<
  PropsWithChildren<ApiErrorBoundaryProps>,
  AuthErrorBoundaryState
> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  //   Todo:connect monitoring api
  componentDidCatch(): void {}

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (isInstanceOfAPIError(this.state.error) && this.state.error?.name === 'NetworkError') {
      return <NetworkError />;
    }

    return <UnknownError />;
  }
}
