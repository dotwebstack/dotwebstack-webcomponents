import React from 'react';
import { createComponent, renderComponent } from '..';
import GraphContext from '../components/GraphContext';
import Vocabulary from '../components/Vocabulary';

type Props = {};

class JsConfig extends React.Component<Props> {
  wrapperRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    const wrapperDom = this.wrapperRef.current;

    if (!wrapperDom) {
      return;
    }

    renderComponent(
      wrapperDom,
      GraphContext,
      {
        src: 'https://bag.basisregistraties.overheid.nl/def/bag',
        children: (store: any) => createComponent(Vocabulary, { store }),
      },
    );

  }

  render() {
    return (
      <div>
        <h1>Config (without React)</h1>
        <div id="wrapper" ref={this.wrapperRef}></div>
      </div>
    );
  }
}

export default JsConfig;
