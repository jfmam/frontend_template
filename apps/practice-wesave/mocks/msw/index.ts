if (typeof window === 'undefined') {
  import('./server').then(({ server }) => {
    server.listen();
  });
} else {
  const {} = import('./worker').then(({ worker }) => {
    worker.start();
  });
}

export {};
