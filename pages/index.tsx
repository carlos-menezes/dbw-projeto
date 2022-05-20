import { Column, Row } from 'carbon-components-react';
import Image from 'next/image';
import Divider from '../components/Divider';
import FlexHeading from '../components/FlexHeading';
import FlexRow from '../components/FlexRow';
import Grid from '../components/Grid';
import JustifiedParagraph from '../components/JustifiedParagraph';
import Layout from '../components/Layout';

const Index: React.FC = () => {
  return (
    <Layout title="Index">
      <Grid>
        <FlexRow style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Column>
            <h1>ProtonX</h1>
            <Divider margin={5} />
            <JustifiedParagraph>
              A ProtonX foi fundada em março de 2022 por Carlos Menezes, João
              Correia e Rúben Vieira, com sede na Rua X, nº 42, Porto Santo,
              Portugal. A ProtonX é uma exchange que intermedia trocas de
              Bitcoin, Bitcoin Cash, Ethereum, Ethereum Classic, Litecoin,
              Tezos, Cardano, Algorand e outras criptomoedas.
            </JustifiedParagraph>
          </Column>
          <Column>
            <img src="/btc.png" width={'300px'} height={'auto'} />
          </Column>
        </FlexRow>
      </Grid>
    </Layout>
  );
};

export default Index;
