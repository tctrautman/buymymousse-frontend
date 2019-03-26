import styled from 'styled-components';

const PriceTag = styled.span`
  background: ${props => props.theme.pink};
  transform: rotate(3deg);
  color: ${props => props.theme.darkblue};
  font-weight: 600;
  padding: 5px;
  line-height: 1;
  font-size: 3rem;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default PriceTag;
