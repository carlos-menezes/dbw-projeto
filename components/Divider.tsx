import { colors } from '@carbon/colors';
import styled from 'styled-components';

type Props = {
  margin: string;
  border?: boolean;
};

const Divider = styled.hr<Props>`
  border: 0;
  border-top: ${(props: Props) =>
    props.border ? `1px solid ${colors.gray[10]}` : '0'};
  margin-top: ${(props: Props) => props.margin}px;
  margin-bottom: ${(props: Props) => props.margin}px;
`;

export default Divider;
