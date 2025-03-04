import styled from 'styled-components'
import Bodybgimage from 'assets/images/headerbg.png'
import themes from "constants/theme.json";

const getThemeStyle = (theme) => `
  background: ${`${
    themes[theme].bg
  } url(${require(`../../../assets/images/${themes[theme].bgImg}`)})`};
`;

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`
export const Section = styled.div`
  width: 100%;
  display: flex;
`

export const MainSection = styled.div`
${(props) => getThemeStyle(props.theme || "light")}
// background-image:url(${Bodybgimage});
background-size: 100%;
    background-repeat: no-repeat;
    .ant-layout {
        background: transparent;
    }
`
export const Container = styled.div`
  max-width: 1220px;
  padding: 0px 20px;
  margin: 0 auto;
  ol.contentlist {
    li {
      font-weight: 600;
    }
  }
 .mt-negative {
    margin-top: -100px; 
  }

  &.mt-positive {
    margin-top: 20px; 
  }
  &.pb {
    padding-bottom: 20px;
  }
  .ta {
    text-align: right;
  }
  .gp{
    gap:30px 0px;
  }
`;

