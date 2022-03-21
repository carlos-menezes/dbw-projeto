import { Column, Grid, Link, Row } from 'carbon-components-react';

const Footer: React.FC = () => {
  return (
    <Grid>
      <Row>
        <Column>
          <p>ProtonX &copy; 2022</p>
        </Column>
        <Column>
          <p>Carlos Menezes, João Correia &amp; Rúben Vieira</p>
        </Column>
      </Row>
    </Grid>
  );
};

export default Footer;
