/* eslint-disable no-unused-vars */
import { useState } from 'react';
import classnames from 'classnames';

import { P2, ClearInput, Section, Button, CheckButton } from 'components';
import { stringToMoney } from 'common/utils';

interface AdditionalProps {
  onChangeAdditional: (additional: string) => void;
  onSaveValue: () => void;
  additional?: number;
}

export default function Additional({ onChangeAdditional, onSaveValue, additional }: AdditionalProps) {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <P2>추가수입이 있으신가요?</P2>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <P2 className={classnames({ 'font-color-40': additional })}>아니요(</P2>
        <CheckButton
          disabled={Number(additional) > 0}
          isChecked={toggle}
          onClick={() => {
            setToggle(t => !t);
          }}
        />
        <P2 className={classnames({ 'font-color-40': additional })}>)</P2>
      </div>
      <P2 className={classnames({ 'font-color-40': toggle })}>
        네,(
        <ClearInput
          disabled={toggle}
          onChange={e => onChangeAdditional(e.target.value)}
          onBlur={e => {
            e.currentTarget.value = additional ? stringToMoney(additional?.toString()) : '0';
          }}
          size={6}
          minLength={10}
          placeholder="00,000,000"
        />
        )원 더 벌어요
      </P2>
      <Section style={{ flexBasis: '20rem', alignItems: 'center', paddingTop: 'max(15.5rem, 14.3519vh)' }}>
        <Button
          disabled={!(additional || toggle)}
          onClick={() => onSaveValue()}
          label="Done"
          className={classnames(
            'bg-40',
            'font-color-0',
            { 'bg-primary-blue': additional },
            { 'bg-primary-blue': toggle },
            { 'bg-40-important': !(additional || toggle) },
          )}
          style={{ width: '25rem', height: '7rem', color: '#000' }}
        />
      </Section>
    </>
  );
}
