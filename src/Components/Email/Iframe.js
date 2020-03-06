import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';

const Iframe = props => {
  const refContainer = useRef('');
  const [position, setPosition] = useState(0);

  const updateIframe = srcDoc => {
    const iframe = refContainer.current;
    const document = iframe.contentDocument;
    document.body.innerHTML = srcDoc;
    // this is a hack to have DOM ready :facepalm: for now
    setTimeout(() => iframe.contentWindow.scrollTo(0, position), 100);
  };

  const handlePosition = pos => {
    setPosition(pos);
  };

  useEffect(() => updateIframe(props.srcDoc), [props.srcDoc]);

  useLayoutEffect(() => {
    const iframe = refContainer.current;

    iframe.contentWindow.addEventListener(
      'scroll',
      handlePosition(iframe.contentWindow.scrollY)
    );
  });

  return <iframe ref={refContainer} title={props.title} {...props} />;
};

export default Iframe;
