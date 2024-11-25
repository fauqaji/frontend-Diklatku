import styled from "styled-components";

const Tooltip = styled.div`
  position: absolute;
  background-color: #bf252b;
  color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  z-index: 1050;
  opacity: ${(props) => (props.active ? "1" : "0")};
  visibility: ${(props) => (props.active ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  top: 91%;
  left: 110%; /* Sesuaikan dengan jarak tooltip */
  transform: translateX(10%); /* Ubah transform untuk lebih halus */
  white-space: nowrap;
  pointer-events: none;
`;

export default Tooltip;
