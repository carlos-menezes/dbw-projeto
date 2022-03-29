import { Grid } from 'carbon-components-react';
import { CSSProperties } from 'react';

import Layout from '../components/Layout';

const gridStyle: CSSProperties = {
  maxWidth: '672px'
};

const FAQ = () => {
  return (
    <Layout title="FAQ">
      <Grid style={gridStyle}></Grid>
    </Layout>
  );
};

export default FAQ;
