import { Row } from 'carbon-components-react';
import FlexHeading from '../components/FlexHeading';
import Grid from '../components/Grid';
import Layout from '../components/Layout';

const Index: React.FC = () => {
  return (
    <Layout title="Index">
      <Grid>
        <Row>
          <FlexHeading>
            <h1>Index</h1>
          </FlexHeading>
        </Row>
      </Grid>
    </Layout>
  );
};

export default Index;
