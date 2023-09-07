import { useRouter } from 'next/router';
import cn from 'classnames/bind';
import resignStyles from '@/styles/resign.module.scss';
import { PrimaryBtn } from '@/components/atom';
import { useResignUser } from '@/hooks/quries/user/useUser';

const resignCx = cn.bind(resignStyles);

interface ResignProps {
  userId: number;
  onChangeMyPageUI: () => void;
}

export default function Resign({ onChangeMyPageUI, userId }: ResignProps) {
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
              mutate(userId, {
                onSuccess: () => router.push('/login'),
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
