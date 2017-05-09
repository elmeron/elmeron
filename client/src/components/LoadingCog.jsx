import React from 'react';

export default function LoadingCog(props) {
  const size = props.size || '1x';

  return <i className={`fa fa-cog fa-spin fa-${size}`} />;
}
