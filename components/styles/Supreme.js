import styled from 'styled-components';

const Supreme = styled.h3`
  background: ${props => props.theme.pink};
  color: ${props => props.theme.darkblue};
  display: inline-block;
  padding: 4px 5px;
  transform: skew(-3deg);
  margin: 0;
  font-size: 4rem;
`;

export default Supreme;
