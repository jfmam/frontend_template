import { useRouter } from 'next/router';
import cn from 'classnames/bind';
import resignStyles from '@/styles/resign.module.scss';
import { PrimaryBtn } from '@/components/atom';
import { useResignUser } from '@/hooks/quries/user/useUser';
import { removeAccessToken } from '@/utils';

const resignCx = cn.bind(resignStyles);

interface ResignProps {
  onChangeMyPageUI: () => void;
}

export default function Resign({ onChangeMyPageUI }: ResignProps) {
  const { mutate } = useResignUser();
  const router = useRouter();
  return (
    <div className={resignCx('resign')}>
      <div className={resignCx('resign-message')}>
        <div>WESAVE</div>
        <div>회원탈퇴 하시겠습니까?</div>
      </div>
      <div className={resignCx('button-container')}>
        <div>
          <PrimaryBtn className={resignCx('button')} onClick={() => onChangeMyPageUI()}>
            취소
          </PrimaryBtn>
        </div>
        <div>
          <PrimaryBtn
            className={resignCx('button', 'button-cancel')}
            onClick={() => {
              mutate(undefined, {
                onSuccess: () => {
                  removeAccessToken();
                  router.push('/login');
                },
              });
            }}
          >
            탈퇴
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
