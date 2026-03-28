import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from 'sweetalert2';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function MyProductSection() {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true
    })
  }, []);

  const [Products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  const LoadData = async () => {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'GET'
    });
    if (response.status === 200) {
      const responseData = await response.json();
      setProducts(responseData);
    }
  }
  useEffect(() => {
    LoadData(); 
    loaddistricts();
    loadproductTypes();
    loadProvinces();
  }, []);

  const showDetail = (product) => {
  // Make sure images is always an array
  const images = Array.isArray(product.images)
    ? product.images
    : product.image
      ? [product.image]
      : [];

  Swal.fire({
    title: product.productName,
    html: `
      <div class="text-center">

        ${images.length > 0 ? `
          <div class="swiper mySwiper mb-3">
            <div class="swiper-wrapper">
              ${images.map(
                img => `
                  <div class="swiper-slide">
                    <img src="http://localhost:3000/${img.replace(/\\/g, '/')}" 
                      class="img-fluid rounded" />
                  </div>`
              ).join('')}
            </div>
            ${images.length > 1 ? `
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            ` : ''}
          </div>
        ` : '<p>No images available</p>'}

        ${product.video ? `
          <button id="viewVideoBtn" class="btn btn-primary mb-3">
            ເບີ່ງວີດີໂອ
          </button>
        ` : ''}

        <div class="card text-start">
          <div class="card-body">
            <p><strong>ລະຫັດ:</strong> ${product.productID}</p>
            <p><strong>ບ້ານ:</strong> ${product.village} &nbsp;
               <strong>ເມືອງ:</strong> ${product.District?.districtName || ''} &nbsp;
               <strong>ແຂວງ:</strong> ${product.District?.Province?.provinceName || ''}</p>
            <p><strong>ລາຄາ:</strong> ${(product.price).toLocaleString()} ກີບ</p>
            <p><strong>ສະຖານະ:</strong> ${product.status}</p>
            <p><strong>ເບີໂທ:</strong> ${product.tel}</p>
            <p><strong>ລາຍລະອຽດ:</strong> ${product.description}</p>
            <p><strong>ຂະໜາດ:</strong> ${product.size}</p>
          </div>
        </div>
      </div>
    `,
    width: '650px',
    didOpen: () => {
      if (images.length > 0) {
        new Swiper('.mySwiper', {
          modules: [Navigation, Autoplay],
          navigation: images.length > 1 ? {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          } : false,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          loop: images.length > 1,
        });
      }

      const btn = document.getElementById('viewVideoBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          Swal.fire({
            title: 'Video',
            html: `<video class="w-100" controls>
                    <source src="http://localhost:3000/${product.video}" type="video/mp4">
                    ບຣາວເຊີບໍ່ສະຫນອງວີດີໂອນີ້
                  </video>`,
            width: '650px'
          });
        });
      }
    }
  });
};


const handleLoadMore = () => {
  setShowAll(prev => !prev);
};
const visibleProducts = showAll ? Products.slice(0, 16) : Products.slice(0, 8);
  const loaddistricts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/districts`, {
        method: "GET",
      });
      console.log("HTTP Status:", response.status);
      if (response.status===200) {
        const responseData = await response.json();
        console.log("Districts data:", responseData);
        setDistricts(responseData);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch districts:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };
  const [districts, setDistricts] = useState([]);

const loadProvinces = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/provinces", {
        method: "GET",
      });

      console.log("HTTP Status:", response.status);

      if (response.status === 200) {
        const responseData = await response.json();
        console.log("Provinces data:", responseData);
        setProvinces(responseData); 
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch provinces:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };
  const LoadDistrictByProvince = async (provinceID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/provinces/districts/${provinceID}`, {
        method: 'GET'
      });
      if (response.status === 200) {
        const responseData = await response.json();
        if (Array.isArray(responseData) && responseData.length > 0) {
          setDistricts(responseData[0].Districts || []);
        } else {
          setDistricts([]);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  const LoadProvinceByDistrict = async (districtID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/districts/province/${districtID}`, {
        method: 'GET'
      });
      if (response.status === 200) {
        const responseData = await response.json();
        // responseData is an array of districts, find the one with matching districtID
        const district = responseData.find(d => d.districtID == districtID);
        if (district) {
          setSelectedProvince(district.provinceID.toString());
          // Now load districts for this province
          await LoadDistrictByProvince(district.provinceID);
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const [provinces, setProvinces] = useState([]);

  const loadproductTypes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/productTypes", {
        method: "GET",
      });
      console.log("HTTP Status:", response.status);
      if (response.status === 200) {
        const responseData = await response.json();
        console.log("Product Types data:", responseData);
        setProductType(responseData); // ແນ່ໃຈ
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch product types:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  const [productType, setProductType] = useState([]);

  // Filter products based on search and selects
  const filteredAllProducts = Products.filter((product) => {
    // Search by name, id, village, etc (case-insensitive, partial match)
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      product.productName?.toLowerCase().includes(searchLower) ||
      product.productID?.toString().includes(searchLower) ||
      product.village?.toLowerCase().includes(searchLower) ||
      product.District?.districtName?.toLowerCase().includes(searchLower) ||
      product.District?.Province?.provinceName?.toLowerCase().includes(searchLower);
    // Province
    const matchesProvince = !selectedProvince || product.District?.Province?.provinceID == selectedProvince;
    // District
    const matchesDistrict = !selectedDistrict || product.District?.districtID == selectedDistrict;
    // Product Type
    const matchesProductType = !selectedProductType || product.productTypeID == selectedProductType;
    // Price (less than or equal)
    const matchesPrice = !selectedPrice || Number(product.price) <= Number(selectedPrice);
    // Status
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    return matchesSearch && matchesProvince && matchesDistrict && matchesProductType && matchesPrice && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAllProducts.length / pageSize);
  const paginatedProducts = filteredAllProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="py-5 bg-light" id='MyProductSection'>
      <Container data-aos="fade-up">
        <h2 className="fw-bold mb-4 text-center text-danger">ລາຍການສັບສິນຫຼ້າສຸດ</h2>
        <Card className='mb-4 shadow-lg'>
          <Card.Header className='text-center bg-danger text-white'>
            <Card.Title>ຄົ້ນຫາຊັບສິນ</Card.Title>
          </Card.Header>
          <Card.Body>
            <FormGroup className='mb-3'>
              <InputGroup>
                <span className='input-group-text'><i className="fas fa-search"></i></span>
                <FormControl id='searchInput' placeholder='ຄົ້ນຫາຊັບສິນ'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <Row className='mb-3'>
              <Col md={4}>
                <FormGroup>
                  <label htmlFor="">ແຂວງ</label>
                  <select id="provinceSelect" className='form-control'
                    value={selectedProvince}
                    onChange={async e => {
                      const value = e.target.value;
                      setSelectedProvince(value);
                      if (value) {
                        await LoadDistrictByProvince(value);
                        setSelectedDistrict(""); // reset district
                      } else {
                        setDistricts([]); // clear districts
                        setSelectedDistrict("");
                      }
                    }}
                  >
                    <option value="">ກະລຸນາເລືອກແຂວງ</option>
                    {provinces.map((x) => (
                      <option value={x.provinceID} key={x.provinceID}>{x.provinceName}</option>))}
                  </select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <label htmlFor="">ເມືອງ</label>
                  <select id="districtSelect" className='form-control'
                    value={selectedDistrict}
                    onChange={async e => {
                      const value = e.target.value;
                      setSelectedDistrict(value);
                      if (value) {
                        await LoadProvinceByDistrict(value);
                      }
                    }}
                  >
                    <option value="">ກະລຸນາເລືອກເມືອງ</option>
                    {districts.map((x) => (
                      <option value={x.districtID} key={x.districtID}>{x.districtName}</option>
                    ))}
                  </select>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <label htmlFor="">ປະເພດຊັບສິນ</label>
                  <select id="productTypeSelect" className='form-control'
                    value={selectedProductType}
                    onChange={e => setSelectedProductType(e.target.value)}
                  >
                    <option value="">ກະລຸນາເລືອກປະເພດ</option>
                            {productType.map((x) => (
                      <option value={x.productTypeID} key={x.productTypeID}>{x.productTypeName}</option>
                    ))}
                    
                  </select>
                </FormGroup>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col md={6}>
                 <FormGroup>
                   <label htmlFor="">ງົບປະມານ</label>
                 </FormGroup>
                 <select id="priceSelect" className="form-control"
                  value={selectedPrice}
                  onChange={e => setSelectedPrice(e.target.value)}
                 >
                  <option value="">ກະລຸນາເລືອກລາຄາ</option>
                  <option value="500000">500,000 ກີບ ລົງມາ</option>
                  <option value="10000000">1,000,000 ກີບ ລົງມາ</option>
                  <option value="15000000">1,500,000 ກີບ ລົງມາ</option>
                 </select>
              </Col>
              <Col md={6}>
                 <FormGroup>
                   <label htmlFor="">ສະຖານະ</label>
                 </FormGroup>
                 <select className='form-control' id="statusSelect"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                 >
                    <option value="">ກະລຸນາເລືອກສະຖານະ</option>
                    <option value="ເຊົ່າ">ເຊົ່າ</option>
                    <option value="ຂາຍ">ຂາຍ</option>
                 </select>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
            <Button
              variant="outline-danger"
              className="me-2"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ກັບຄືນ
            </Button>
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx + 1}
                variant={currentPage === idx + 1 ? "danger" : "outline-danger"}
                className="mx-1"
                size="sm"
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              variant="outline-danger"
              className="ms-2"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ໄປຫນ້າຖັດໄປ
            </Button>
          </div>
        )}
        <Row className="g-4">
          {paginatedProducts.map((product) => (
            <Col key={product.productID} md={3} sm={6} xs={12}>
              <Card className="h-100 shadow-lg border-0 MyProductSection-card" style={{ cursor: 'pointer' }}>
                <Container className='mt-2'>
                  <Card.Img
                    variant="top"
                    src={
                      product.image && typeof product.image === 'string'
                        ? `http://localhost:3000/${product.image.replace(/\\/g, '/')}`
                        : ''
                    }
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                </Container>
                <Card.Header>
                  <h5 className="fw-bold text-primary">ລະຫັດ: <span className="text-danger">{product.productID}</span></h5>
                  <Card.Title className="fw-bold">{product.productName}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <p>
                    <span className='fw-bold'>ບ້ານ:</span> {product.village}<br />
                    <span className='fw-bold'>ເມືອງ:</span> {product.District?.districtName}<br />
                    <span className='fw-bold'>ແຂວງ:</span> {product.District?.Province?.provinceName}
                  </p>
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-danger"> ລາຄາ: {Number(product.price).toLocaleString()} ກີບ</span>
                  <span className="fw-bold text-success">{product.status}</span>
                </Card.Footer>
                <Container>
                  <Button
                    variant="danger"
                    className='btn w-100 mb-2'
                    size="sm"
                    onClick={() => showDetail(product)}
                  >
                    ລາຍລະອຽດ
                  </Button>
                </Container>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Pagination controls */}
      </Container>
    </section>
  );
}