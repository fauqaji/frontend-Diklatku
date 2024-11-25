import React from "react";
import { Container, Row, Col, Carousel, CarouselItem } from "reactstrap";
import "../css/carousel.css";  // Pastikan file CSS diimport

const items = [
  {
    src: require("../../assets/img/lapangan.jpg"),
    
  },
  {
    src: require("../../assets/img/ruang-komputer.jpg"),
    
  },
  {
    src: require("../../assets/img/ruang-rapat.jpg"),
    
  }
];

const itemsO = [
  {
    src: require("../../assets/img/kamar.jpg"),
    
  },
  {
    src: require("../../assets/img/ruang-rapat-besar.jpg"),
    
  },
  {
    src: require("../../assets/img/ruang-rapat-kecil.jpg"),
    
  }
];

function CarouselSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  const onExiting = () => setAnimating(true);
  const onExited = () => setAnimating(false);

  const next = (itemsLength) => {
    if (animating) return;
    const nextIndex = activeIndex === itemsLength - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = (itemsLength) => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? itemsLength - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const renderCarousel = (items) => (
    <Carousel
      activeIndex={activeIndex}
      next={() => next(items.length)}
      previous={() => previous(items.length)}
      interval={3000}
      slide={true}
    >
      {items.map((item, index) => (
        <CarouselItem
          onExiting={onExiting}
          onExited={onExited}
          key={index}
        >
          <img src={item.src} alt={item.altText} />
          <div className="carousel-caption d-none d-md-block custom-caption">
            <h5>{item.altText}</h5>
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  );

  return (
    <div className="section" id="carousel">
      <Container>
        <Row className="justify-content-center">
          <Col lg="5" md="12">
            {renderCarousel(items)}
          </Col>
          <Col lg="5" md="12">
            {renderCarousel(itemsO)}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CarouselSection;
