import { colors } from '@carbon/colors';
import styled from 'styled-components';

type Props = {
  margin: number;
};

const Divider = styled.hr<Props>`
  border: 0;
  border-top: 1px solid ${colors.gray[10]};
  margin-top: ${(props) => props.margin}px;
  margin-bottom: ${(props) => props.margin}px;
`;

export default Divider;
