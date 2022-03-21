import { Column, Grid, Row } from 'carbon-components-react';
import { CSSProperties } from 'react';

const gridStyle: CSSProperties = {
  height: '3rem'
};

const Footer: React.FC = () => {
  return (
    <Grid fullWidth style={gridStyle}>
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
