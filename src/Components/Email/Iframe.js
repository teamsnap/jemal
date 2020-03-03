import React, { useRef, useEffect } from 'react';

const Iframe = props => {
  const refContainer = useRef('');
  const updateIframe = srcDoc => {
    const iframe = refContainer.current;
    const document = iframe.contentDocument;
    document.body.innerHTML = srcDoc;
  };

  useEffect(() => {
    console.log('firing');
    updateIframe(props.srcDoc);
  }, [props.srcDoc]);

  return <iframe ref={refContainer} title={props.title} {...props} />;
};

export default Iframe;
