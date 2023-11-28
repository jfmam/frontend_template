import { atomsWithQuery } from 'jotai-tanstack-query';

const [userAtom] = atomsWithQuery(() => ({
  queryKey: ['users'],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    return res.json();
  },
}));

export { userAtom };
