import React from 'react';
import * as RadixIcons from '@radix-ui/react-icons';

const Icon = ({ name, ...props }) => {

  console.log(RadixIcons)

  const IconComponent = RadixIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent {...props} />;
};

export default Icon;