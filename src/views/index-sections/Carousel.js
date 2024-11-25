import React from "react";
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle } from "reactstrap";
// import "../css/carousel.css"; 

const items = [
  {
    src: require("../../assets/img/lapangan.jpg"),
    altText: "Lapangan",
  },
  {
    src: require("../../assets/img/ruang-komputer.jpg"),
    altText: "Ruang Komputer",
  },
  {
    src: require("../../assets/img/ruang-rapat.jpg"),
    altText: "Ruang Rapat",
  },
  {
    src: require("../../assets/img/kamar.jpg"),
    altText: "Kamar",
  },
  {
    src: require("../../assets/img/ruang-rapat-besar.jpg"),
    altText: "Ruang Rapat Besar",
  },
  {
    src: require("../../assets/img/ruang-rapat-kecil.jpg"),
    altText: "Ruang Rapat Kecil",
  },
];

function ImageCards() {
  return (
    <div className="section" id="cards">
      <Container>
        <Row className="justify-content-center">
          {/* Menampilkan 6 Card pada 2 baris */}
          {items.map((item, index) => (
            <Col lg="3" md="6" sm="6" key={index}>
              <Card className="card-warning text-dark">
                <CardImg top width="100%"  alt={item.altText} />
                <CardBody className="text-center">
                  <CardTitle tag="h5" className="small-title">{item.altText}</CardTitle>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default ImageCards;
