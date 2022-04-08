import { Grid as _Grid } from 'carbon-components-react';
import styled from 'styled-components';

type Props = {
  maxWidth?: string;
};

const Grid = styled(_Grid)`
  max-width: ${(p: Props) => (p.maxWidth ? p.maxWidth : '672px')};
`;

export default Grid;
