/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';

export default class AboutPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>About</title>
          <meta name="description" content="About this App" />
        </Helmet>
        <H1>
          Pagina feita para a matéria de IA :)
        </H1>

        <p>Tiago David da Costa, aka Aiev</p>
      </div>
    );
  }
}
