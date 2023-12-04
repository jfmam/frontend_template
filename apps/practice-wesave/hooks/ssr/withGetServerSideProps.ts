import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { isInstanceOfAPIError } from '@/common/error';

export default function withGetServerSideProps(getServerSideProps: GetServerSideProps): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    try {
      const result = await getServerSideProps(context);

      return result;
    } catch (error) {
      if (isInstanceOfAPIError(error)) {
        const { redirectUrl, notFound } = error;

        if (notFound) {
          return {
            notFound: true,
          };
        }

        return {
          redirect: {
            destination: redirectUrl,
            permanent: false,
          },
        };
      }

      // handle on the client
      return {
        props: {
          error: {
            message: '알수 없는 에러가 발생하였습니다',
            type: 'unknown',
          },
        },
      };
    }
  };
}
