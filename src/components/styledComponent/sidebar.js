import styled, { keyframes, css } from "styled-components";
const slideIn = keyframes`
  from {
    transform: translateX(-20%);
  }
  to {
    transform: translateX(0);
  }
`;
export const Container = styled.div`
  position: fixed;
  height: 100vh;
  z-index: 3;
`;

export const Button = styled.button`
  background-color: var(--white);
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.06);

  &::before,
  &::after {
    content: "";
    background-color: var(--black);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    top: ${(props) => (props.clicked ? "1.5" : "1rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }

  &::after {
    top: ${(props) => (props.clicked ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0 3.1rem;
  flex-direction: column;
`;

export const Logo = styled.div`
  width: 2rem;
  margin-bottom: 0.1rem;

  img {
    width: 100%;
    height: auto;
  }
`;

export const LogoText = styled.div`
  color: var(--black);
  font-size: 0.8rem;
  text-align: center;
  opacity: ${(props) => (props.clicked ? "1" : "0")};
  visibility: ${(props) => (props.clicked ? "visible" : "hidden")};
  transform: ${(props) =>
    props.clicked ? "translateX(0)" : "translateX(-20%)"};
  transition: opacity 0.2s ease, visibility 2s ease, transform 1s ease;
  max-height: 13px;
  width: 190px;

  h1 {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
  }

  h2 {
    margin: 0;
    font-size: 15px;
  }
`;

export const SlickBar = styled.ul`
  color: var(--black);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background);
  padding: 1rem 0;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);

  width: ${(props) => (props.clicked ? "15rem" : "3.5rem")};
  transition: all 0.4s ease;
  border-radius: 0 30px 30px 0;

  box-shadow: 5px 4px 0px rgba(0, 0, 0, 0.3);
`;

export const Item = styled.button`
  text-decoration: none;
  border: none;
  color: ${(props) => (props.isActive ? "var(--white)" : "var(--black)")};
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  background-color: ${(props) => (props.isActive ? "#BF252B" : "transparent")};
  border-right: ${(props) =>
    props.isActive ? "2px solid var(--red)" : "none"};
  position: relative;
  margin-left: 5px;
  &:hover {
    background-color: #bf252b; /* Background berubah jadi merah */
    border-right: 2px solid var(--red);

    i,
    span {
      color: var(--white); /* Ubah teks jadi putih */
    }

    img {
      filter: invert(1); /* Ubah gambar jadi putih */
    }
  }

  i,
  span {
    color: ${(props) => (props.isActive ? "var(--white)" : "var(--black)")};
  }

  img {
    filter: ${(props) => (props.isActive ? "invert(1)" : "none")};
  }

  i {
    color: ${(props) => (props.isActive ? "var(--white)" : "var(--black)")};
    width: 20px;
    height: 20px;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Img = styled.img`
  transform: ${(props) => (props.isActive ? "scale(1)" : "scale(.9)")};
  max-width: 15px;
  min-width: 15px;
  margin-right: 1rem;
  transition: filter 0.3s ease; /* Transisi smooth untuk filter */
  filter: ${(props) => (props.isActive ? "invert(1)" : "none")};
`;

export const Text = styled.span`
  font-size: 0.89rem;
  text-align: center;
  opacity: ${(props) => (props.clicked ? "1" : "0")};
  visibility: ${(props) => (props.clicked ? "visible" : "hidden")};
  animation: ${(props) =>
    props.clicked
      ? css`
          ${slideIn} 0.5s ease-out
        `
      : "none"};
  transition: opacity 0.2s ease, visibility 0.8s ease;
  max-height: 17px;
  white-space: nowrap;
  text-decoration: none;
`;

export const Logout = styled.button`
  border: none;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  margin-top: 5rem;

  i {
    font-size: 1.2rem;
    color: var(--black);
    transition: all 0.3s ease;
    transform: scaleX(-1);

    &:hover {
      opacity: 0.5;
    }
  }
`;
