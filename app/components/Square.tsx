/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { css } from '@emotion/react';
import { XIcon } from './images/XIcon';
import { OIcon } from './images/OIcon';
import { breakpoints } from '../App';

type Props = {
  element: string;
  value: number;
}

/**
 * Displays the corresponding "X" or "O" svg for 
 * the element passed from the "Board" component.
 */
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
        ${breakpoints.mobile} {
          width: 100px;
          height: 100px;
        }
        list-style-type: none;
        &:hover {
          background: radial-gradient( #e7ecf1 1%, transparent 50%);
        }
      `}
      value={value}
    >
      {square}
    </li>
  )
}

