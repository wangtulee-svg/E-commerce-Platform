import React, { useEffect, useState } from 'react';
import Sidebar from './component/Sidebar';
import Header from './component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Card, Row, Col } from 'react-bootstrap';
import { ReactTyped } from 'react-typed';

const Dashbord = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [Products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [ownerCount, setOwnerCount] = useState(0);
  const [Expenses,setExpenses] = useState(0);
  const [Income,setIncome] =  useState(0);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const [AllIncome, setAllIncome] = useState(0);
  const [SumIncome, setSumIncome] = useState(0);

  // ດຶງຈຳນວນສິນຄ້າ
  const getProductCount = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products/product-count');
      if (res.ok) {
        const data = await res.json();
        setProductCount(data.count);
      }
    } catch (err) {
      console.error(err);
    }
  };



  // ດຶງຂໍ້ມູນສິນຄ້າ
  const getProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products/product-count');
    if(res.ok){
      const data = await res.json();
      setProducts(data.count);
    }
    } catch (err) {
      console.error(err);
    }
  };
  const getOwnerCount = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/owners/getowner-count');
    const data = await res.json();
    console.log("Owner API response:", data);  // ✅ ກວດສອບ JSON
    if (res.ok) {
      setOwnerCount(data.count);
    }
  } catch (err) {
    console.error(err);
  }
};


  const getOwner_Count = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/owners/getowner_count');
    const data = await res.json();
    console.log("Owner API response:", data);  // ✅ ກວດສອບ JSON
    if (res.ok) {
      setOwnerCount(data.count);
    }
  } catch (err) {
    console.error(err);
  }
};
const getExpenses = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/owners/Expenses');
    const data = await res.json();
    console.log("Expenses API response:", data); // ✅ ກວດສອບ JSON
    if (res.ok) {
      setExpenses(data.count);
    }
  } catch (err) {
    console.error(err);
  }
};

const getIncome = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/owners/Income');
    const data = await res.json();
    console.log("Income API response:", data); // ✅ ກວດສອບ JSON
    if (res.ok) {
      setIncome(data.count);
    }
  } catch (err) {
    console.error(err);
  }
};

const getAllIncome = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/owners/Allincome');
    const data = await res.json();
    console.log("AllIncome API response:", data); // ✅ ກວດສອບ JSON
    if (res.ok) {
      setAllIncome(data.count);
    }
  } catch (err) {
    console.error(err);
  }
};

const getSumIncome = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/owners/sum-income');
    const data = await res.json();
    console.log("AllIncome API response:", data); // ✅ ກວດສອບ JSON
    if (res.ok) {
      setSumIncome(data.count);
    }
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    getProductCount();
    getOwnerCount();
    getProducts();
    getExpenses();
    getIncome();
    getOwner_Count();
    getAllIncome();
    getSumIncome();
  }, []);

  return (
    <div className="d-flex" style={{ fontFamily: 'Noto Sans Lao' }}>
      <Sidebar show={showSidebar} handleClose={closeSidebar} />
      <div className="flex-grow-1 w-100">
        <Header toggleSidebar={toggleSidebar} />

        <div className="p-3">
          <Card className="shadow-lg">
            <Card.Header className="bg-danger fw-bold text-center text-white">
              <h4 className="mt-2">
                <ReactTyped
                  strings={[
                    'ຍິນດີຕ້ອນຮັບເຂົ້າສູ່',
                    'ລະບົບຈັດການ Star Home',
                  ]}
                  typeSpeed={60}
                  backSpeed={30}
                  loop
                />
              </h4>
            </Card.Header>

            <Card.Body>
              <Row className="mt-3 mb-3">
                <Col md={3}>
                  <Card className="shadow-lg bg-primary" style={{ cursor: 'pointer' }}>
                    <div className="mt-4 mb-4">
                      <h4 className="text-center text-white fw-bold">
                        ຊັບສິນທັງໝົດ<br />
                        <br />
                        {productCount}
                      </h4>
                    </div>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="shadow-lg bg-success" style={{ cursor: 'pointer' }}>
                    <div className="mt-4 mb-4">
                      <h4 className="text-center text-white fw-bold">
                        ເຈົ້າຂອງຊັບສິນ<br />
                        <br />
                        {ownerCount}
                      </h4>
                    </div>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="shadow-lg bg-danger" style={{ cursor: 'pointer' }}>
                    <div className="mt-4 mb-4">
                      <h4 className="text-center text-white fw-bold">
                        ລາຍຈ່າຍ<br />
                        <br />
                        {Expenses}
                      </h4>
                    </div>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card
                    className="shadow-lg"
                    style={{ backgroundColor: '#8f2c8dff', cursor: 'pointer' }}
                  >
                    <div className="mt-4 mb-4">
                      <h4 className="text-center text-white fw-bold">
                        ລາຍຮັບ<br />
                        <br />
                        {Income}
                      </h4>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* ຕາຕະລາງສິນຄ້າ */}
              
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashbord;