/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { XIcon } from './images/XIcon';
import { OIcon } from './images/OIcon';

type Props = {
  element: string;
  value: number;
}

export const Square = ({ element, value }: Props) => {
  const [ square, setSquare ] = useState<EmotionJSX.Element | null>(null);
  
  const checkElement = (el: string) => {
    if (el === "x") {
      return <XIcon />
    } else if (el === "o") {
      return <OIcon />
    }
    return <></>;
  }

  useEffect(() => {
    const child = checkElement(element);
    setSquare(child);
  }, [element])


  return (
    <li
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        width: 150px;
        height: 150px;
        list-style-type: none;
        &:hover {
          background: radial-gradient( #cccbcb 1%, transparent 50%);
        }
      `}
      value={value}
    >
      {square}
    </li>
  )
}
