import React from 'react';

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ width = 65, height = 65, fill = "#ffffff" }) => {
  return (
    <svg width={width} height={height} version="1.1" viewBox="0 0 17.198 17.198" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-45.096 -25.935)">
        <path d="m45.43 26.268c-0.24425 0.24425 0.06139 0.61754 0.06139 0.61754l15.852 15.852s0.37327 0.30567 0.61754 0.06139c0.24426-0.24426-0.06139-0.61754-0.06139-0.61754l-15.852-15.852s-0.37326-0.30566-0.61754-0.06139z" fill={fill}/>
        <path d="m61.961 26.268c0.24425 0.24425-0.06139 0.61754-0.06139 0.61754l-15.852 15.852s-0.37327 0.30567-0.61754 0.06139c-0.24426-0.24426 0.06139-0.61754 0.06139-0.61754l15.852-15.852s0.37326-0.30566 0.61754-0.06139z" fill={fill}/>
      </g>
    </svg>
  );
};