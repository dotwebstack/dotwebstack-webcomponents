import { mount } from 'enzyme';
import React from 'react';
import GraphContext from '../../components/GraphContext';
import i18next from '../../i18n';

describe('<GraphContext />', () => {

  it('shows loading indicator', () => {
    const wrapper = mount(<GraphContext src={''}>
    {store => (
          <React.Component store={store} />
        )}
    </GraphContext>);
    wrapper.setState({ loading: true });
    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });
});
