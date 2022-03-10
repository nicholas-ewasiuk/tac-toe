import React from 'react';

export const OIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ width = 72, height = 72, fill = "#ffffff"}) => {
  return (
    <svg width={width} height={height} version="1.1" viewBox="0 0 19.05 19.05" xmlns="http://www.w3.org/2000/svg">
      <path d="m9.5247 0.1496a9.3753 9.3753 0 0 0-9.3751 9.3751 9.3753 9.3753 0 0 0 9.3751 9.3757 9.3753 9.3753 0 0 0 9.3756-9.3757 9.3753 9.3753 0 0 0-9.3756-9.3751zm0 0.85524a8.5198 8.5198 0 0 1 8.5199 8.5199 8.5198 8.5198 0 0 1-8.5199 8.5199 8.5198 8.5198 0 0 1-8.5194-8.5199 8.5198 8.5198 0 0 1 8.5194-8.5199z" strokeWidth=".18679" fill={fill}/>
    </svg>
  );
};