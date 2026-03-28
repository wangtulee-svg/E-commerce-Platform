import React from 'react'
import { useEffect } from 'react';
import { Navbar, Container, Nav} from 'react-bootstrap';
import AOS from "aos";
import "aos/dist/aos.css";
export default function MyNavbar() {
  useEffect(()=>{
         AOS.init({
            duration: 2000,
            once: true
         })
  },[])
  return (
    <div>
      <Navbar data-aos ="zoom-out" bg="light" variant="dark" expand="lg" sticky="top" className="shadow-lg py-3">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold text-danger">Free Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
            <span className="toggler-bar"></span>
            <span className="toggler-bar"></span>
            <span className="toggler-bar"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link  href="#home" className="active text-danger">ໜ້າຫຼັກ</Nav.Link>
              <Nav.Link className="text-danger" href="#MyProductSection">ຊັບສິນຫຼ້າສຸດ</Nav.Link>
                            <Nav.Link className="text-danger" href="#sectionService">ບໍລິການ</Nav.Link>
              <Nav.Link className="text-danger" href="#MyAbout">ລາຍລະອຽດ</Nav.Link>
              <Nav.Link className="text-danger" href="#sectionPolicy">ນະໂຍບາຍ</Nav.Link>
              {/* <Button variant="success" className="ms-3 fw-bold px-4">174-394-9560</Button> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}
