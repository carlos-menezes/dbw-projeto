import { colors } from '@carbon/colors';
import { Column, Grid, Row } from 'carbon-components-react';
import { CSSProperties } from 'react';
import { code02 } from '@carbon/type';

const gridStyle: CSSProperties = {
  minHeight: '3em',
  backgroundColor: colors.black['100'],
  color: colors.gray['30'],
  fontFamily: code02.fontFamily,
  paddingTop: '1em',
  paddingBottom: '1em'
};

const rowStyle: CSSProperties = {
  height: '100%'
};

const columnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

const authorColumnStyle: CSSProperties = {
  ...columnStyle,
  justifyContent: 'flex-end'
};

const Footer: React.FC = () => {
  return (
    <Grid fullWidth style={gridStyle}>
      <Row style={rowStyle}>
        <Column style={columnStyle}>
          <p>ProtonX &copy; 2022</p>
        </Column>
        <Column style={authorColumnStyle}>
          <p>2014718 &amp; 2104419 &amp; 2030518</p>
        </Column>
      </Row>
    </Grid>
  );
};

export default Footer;
