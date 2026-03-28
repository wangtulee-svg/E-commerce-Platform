import React, { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import Header from '../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

import { Row, Col, Card, Container, Button, FormGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
const Product = () => {

  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const Navigate = useNavigate();
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [Districts, setDistricts] = useState([]);
  const [Provinces, setProvicnces] = useState([]);
  const [ProductTypes, setProductTypes] = useState([]);

  const LoadData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const LoadOwnerId = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/owners/ownerID', {
        method: 'GET',
      });
      if (response.status === 200) {
        const responseData = await response.json();
        document.getElementById('ownerID').value = responseData;
      }
    } catch (error) {
      alert(error)
    }
  }

  const LoadProvince = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/provinces', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        setProvicnces(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const LoadDistrict = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/districts',
        { method: 'GET' }
      );
      if (response.status === 200) {
        const data = await response.json();
        setDistricts(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const LoadProductType = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/producttypes', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        setProductTypes(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

 const saveOwner = async (ownerName, ownerGender, ownerTel) => {
    try {
      const response = await fetch('http://localhost:3000/api/owners', {
        method: 'POST',
        body: JSON.stringify({
          ownerName, ownerGender, ownerTel
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if(response.status === 400){
     Swal.fire({
  title: 'ແຈ້ງເຕືອນ',
  text: 'ເບີໂທນີ້ມີໃນລະບົບແລ້ວ!',
  icon: 'warning',
  confirmButtonText: 'ຕົກລົງ'
});

        
      }
      if (response.status === 200) {
        console.log('Save owner success');
      }
    } catch (error) {
      alert(error);
    }
  }
  const ProductAutoId = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products/autoid", {
        method: 'GET'
      });
      if (response.status === 200) {
        const responseData = await response.json();
        document.getElementById('AutoId').value = responseData.newId;
      }
    } catch (error) {
      alert(error);
    }
  }

  const AddImageToProduct = async (productID) => {
    Swal.fire({
      title: 'ເລືອກຮູບພາບ',
      html: <input class="form-control" id="addImage" type="file" accept="image/*"/>,
      showCancelButton: true,
      confirmButtonText: 'ອັບໂຫຼດ',
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      }

    }).then(async (result) => {
      if (result.isConfirmed) {
        const fileInput = document.getElementById("addImage");
        if (!fileInput.files.length) {
          Swal.fire({
            icon: "warning",
            text: "ກະລຸນາເລືອກຮູບ",
            didOpen: () => {
              document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
            }
          });
          return;
        }
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);
        try {
          const response = await fetch(`http://localhost:3000/api/products/${productID}/add-image`, {
            method: "POST",
            body: formData
          });
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: "ເພີ່ມສຳເລັດ",
              text: 'ເພີ່ມຮູບພາບສຳເລັດແລ້ວ',
              confirmButtonText: 'ຕົກລົງ',
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            }).then(() => {
              LoadData();
            });
          } else {
            Swal.fire({
              icon: "error", text: "ບໍ່ສາມາດອັບໂຫຼດຮູບໄດ້", didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
          }
        } catch (error) {
          alert.error(error);
          Swal.fire({ icon: "error", text: "ເກີດຂໍ້ຜິດພາດ" });
        }
      }
    });
  };
  const AddVideoToProduct = async (productID) => {
    Swal.fire({
      title: 'ເລືອກວີດີໂອ',
      html: <input class="form-control" id="addVideo" type="file" accept="video/*"/>,
      showCancelButton: true,
      confirmButtonText: 'ອັບໂຫຼດ',
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      }

    }).then(async (result) => {
      if (result.isConfirmed) {
        const fileInput = document.getElementById("addVideo");
        if (!fileInput.files.length) {
          Swal.fire({
            icon: "warning",
            text: "ກະລຸນາເລືອກວີດີໂອ",
            didOpen: () => {
              document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
            }
          });
          return;
        }
        const formData = new FormData();
        formData.append("video", fileInput.files[0]);
        try {
          const response = await fetch(`http://localhost:3000/api/products/${productID}/add-video`, {
            method: "POST",
            body: formData
          });
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: "ເພີ່ມສຳເລັດ",
              text: 'ເພີ່ມວີດີໂອສຳເລັດແລ້ວ',
              confirmButtonText: 'ຕົກລົງ',
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            }).then(() => {
              LoadData();
            });
          } else {
            Swal.fire({
              icon: "error", text: "ບໍ່ສາມາດອັບໂຫຼດວີດີໂອໄດ້", didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
          }
        } catch (error) {
          alert.error(error);
          Swal.fire({ icon: "error", text: "ເກີດຂໍ້ຜິດພາດ" });
        }
      }
    });
  };

  const saveProduct = async (productID, productName, ownerID, productTypeID, village, districtID, status, size, price, images, videos, tel, description) => {
    try {
      if (!productID || !productName || !ownerID || !productTypeID || !districtID || !status || !price) {
        throw new Error('ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ');
      }
      const formData = new FormData();
      formData.append('productID', productID);
      formData.append('productName', productName);
      formData.append('ownerID', ownerID);
      formData.append('productTypeID', productTypeID);
      formData.append('village', village || '');
      formData.append('districtID', districtID);
      formData.append('status', status);
      formData.append('size', size || '');
      formData.append('price', price);
      formData.append('tel', tel || '');
      formData.append('description', description || '');

      // Handle multiple images
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append('image', images[i]);
        }
      }

      // Handle multiple videos
      if (videos && videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          formData.append('video', videos[i]);
        }
      }

      // ກວດສອບຂໍ້ມູນທີ່ຈະສົ່ງໄປຫາ server
      console.log('Sending product data:', {
        productID,
        productName,
        ownerID,
        productTypeID,
        village,
        districtID,
        status,
        size,
        price,
        tel,
        description,
        imageCount: images ? images.length : 0,
        videoCount: videos ? videos.length : 0
      });

      const response = await fetch("http://localhost:3000/api/products/upload", {
        method: 'POST',
        body: formData,
      });

      // ກວດສອບ response ຈາກ server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ການບັນທຶກຂໍ້ມູນລົ້ມເຫລວ: ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Server response:', responseData);
    } catch (error) {
      console.error('Error in saveProduct:', error);
      throw error;
    }
  }
  useEffect(() => {
    LoadData();
    LoadDistrict();
    LoadProvince();
    LoadProductType();
    LoadOwnerId();
    ProductAutoId();
  }, []);

  useEffect(() => {
    setFilteredProducts(Products);
  }, [Products]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filtered = Products.filter((product) => {
      if (product.productID.toString().toLowerCase() === searchTerm) {
        return true;
      }

      // Check partial matches for other fields
      return (
        product.productID.toString().toLowerCase().includes(searchTerm) ||
        product.village?.toLowerCase().includes(searchTerm) ||
        product.District?.districtName?.toLowerCase().includes(searchTerm) ||
        product.District?.Province?.provinceName?.toLowerCase().includes(searchTerm) ||
        product.productName?.toLowerCase().includes(searchTerm) ||
        product.status?.toLowerCase().includes(searchTerm) ||
        product.price?.toString().includes(searchTerm)
      );
    });

    setFilteredProducts(filtered);
  };
  const PopUpSave = () => {
    Swal.fire({
      title: 'ຟອມເພີ່ມຂໍ້ມູນ',
      width: '100%',
      confirmButtonText: 'ປິດ',
      html: `
        <div class="card-body">
          <form id="productForm" enctype="multipart/form-data">
            <h5 class="text-danger">ຂໍ້ມູນເຈົ້າຂອງ (Owner)</h5>
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <label class="form-label">ຊື່ເຈົ້າຂອງ</label>
                <input type="text" name="ownerName" class="form-control" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">ເພດ</label>
                <select name="ownerGender" class="form-control" required>
                  <option value="">-- ເລືອກ --</option>
                  <option value="ຊາຍ">ຊາຍ</option>
                  <option value="ຍິງ">ຍິງ</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">ເບີໂທ</label>
                <input type="text" name="ownerTel" class="form-control" required>
              </div>
            </div>

            <h5 class="text-danger">ຂໍ້ມູນຊັບສິນ (Product)</h5>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">ຊື່ຊັບສິນ</label>
                <input type="text" name="productName" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">ປະເພດຊັບສິນ</label>
                <select name="productTypeID" id="productTypeSelect" class="form-control" required>
                  <option value="">-- ເລືອກປະເພດ --</option>
                </select>
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label">ແຂວງ</label>
                <select id="provinceSelect" class="form-control" required></select>
              </div>
              <div class="col-md-4">
                <label class="form-label">ເມືອງ</label>
                <select id="districtSelect" name="districtID" class="form-control" required></select>
              </div>
              <div class="col-md-4">
                <label class="form-label">ບ້ານ</label>
                <input type="text" name="village" class="form-control">
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label">ສະຖານະ</label>
                <select name="status" class="form-control" required>
                  <option value="">-- ເລືອກ --</option>
                  <option value="ເຊົ່າ">ເຊົ່າ</option>
                  <option value="ຂາຍ">ຂາຍ</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">ຂະໜາດ (m²)</label>
                <input type="text" name="size" class="form-control">
              </div>
              <div class="col-md-4">
                <label class="form-label">ລາຄາ (ກີບ)</label>
                <input type="number" name="price" class="form-control" required>
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">ຮູບພາບ</label>
                <input type="file" name="image" class="form-control" accept="image/*" multiple>
              </div>
              <div class="col-md-6">
                <label class="form-label">ວີດີໂອ</label>
                <input type="file" name="video" class="form-control" accept="video/*" multiple>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">ລາຍລະອຽດ</label>
              <textarea name="description" class="form-control" rows="3"></textarea>
            </div>

            <div class="text-end">
              <button class="btn btn-success">
                <i class="fa fa-save me-1"></i> ບັນທຶກ
              </button>
            </div>
          </form>
        </div>
      `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

        const provinceSelect = document.getElementById('provinceSelect');
        const districtSelect = document.getElementById('districtSelect');
        const productTypeSelect = document.getElementById('productTypeSelect');

        // ເລືອກ province
        provinceSelect.innerHTML = '<option value="">-- ເລືອກແຂວງ --</option>';
        Provinces.forEach(p => {
          const option = document.createElement('option');
          option.value = p.provinceID;
          option.textContent = p.provinceName;
          provinceSelect.appendChild(option);
        });

        // ເລືອກ district ທັ້ງໝົດ
        districtSelect.innerHTML = '<option value="">-- ເລືອກເມືອງ --</option>';
        Districts.forEach(d => {
          const option = document.createElement('option');
          option.value = d.districtID;
          option.textContent = d.districtName;
          districtSelect.appendChild(option);
        });

        ProductTypes.forEach(p => {
          const option = document.createElement('option');
          option.value = p.productTypeID;
          option.textContent = p.productTypeName;
          productTypeSelect.appendChild(option);
        })


        // ເພີ່ມ event listener ສໍາລັບ auto filter district ຕາມ province
        provinceSelect.addEventListener('change', () => {
          const selectedProvinceID = provinceSelect.value;
          const filteredDistricts = Districts.filter(d => d.provinceID == selectedProvinceID);

          districtSelect.innerHTML = '<option value="">-- ເລືອກເມືອງ --</option>';
          filteredDistricts.forEach(d => {
            const option = document.createElement('option');
            option.value = d.districtID;
            option.textContent = d.districtName;
            districtSelect.appendChild(option);
          });
        });

        // ເພີ່ມ event listener ສໍາລັບ auto select province ຕາມ district
        districtSelect.addEventListener('change', () => {
          const districtID = districtSelect.value;
          const district = Districts.find(d => d.districtID == districtID);
          if (district) provinceSelect.value = district.provinceID;
        });

        // Add form submission handler
        const form = document.getElementById('productForm');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);

          // ດຶງຂໍ້ມູນຈາກ Form
          const ownerData = {
            ownerName: formData.get('ownerName'),
            ownerGender: formData.get('ownerGender'),
            ownerTel: formData.get('ownerTel')
          };

          // ດຶງ ID ທີ່ຈຳເປັນ
          const product = document.getElementById('AutoId').value;
          const ownerID = document.getElementById('ownerID').value;

          // ກວດສອບຂໍ້ມູນກ່ອນບັນທຶກ
          console.log('Product Data to save:', {
            productID: product,
            productName: formData.get('productName'),
            ownerID: ownerID,
            productTypeID: formData.get('productTypeID'),
            village: formData.get('village'),
            districtID: formData.get('districtID'),
            status: formData.get('status'),
            size: formData.get('size'),
            price: formData.get('price'),
            image: formData.get('image'),
            video: formData.get('video'),
            tel: ownerData.ownerTel,
            description: formData.get('description')
          });

          // Show loading Swal
          Swal.fire({
            title: 'ກຳລັງບັນທຶກ',
            text: 'ກະລຸນາລໍຖ້າ...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
            }
          });

          try {
            // Validate owner data
            if (!ownerData.ownerName || !ownerData.ownerGender || !ownerData.ownerTel) {
              throw new Error('ກະລຸນາປ້ອນຂໍ້ມູນເຈົ້າຂອງໃຫ້ຄົບຖ້ວນ');
            }

            // Save owner first
            const SaveOwner = await saveOwner(ownerData.ownerName, ownerData.ownerGender, ownerData.ownerTel);
            if(!SaveOwner){
              return
            }

            // Get the files
            const imageFiles = form.querySelector('input[name="image"]').files;
            const videoFiles = form.querySelector('input[name="video"]').files;

            // ກວດສອບວ່າມີການເລືອກຮູບພາບ ແລະ ວິດີໂອຫຼືບໍ່
            if (!imageFiles || imageFiles.length === 0) {
              throw new Error('ກະລຸນາເລືອກຮູບພາບຢ່າງໜ້ອຍ 1 ຮູບ');
            }
            if (!videoFiles || videoFiles.length === 0) {
              throw new Error('ກະລຸນາເລືອກວິດີໂອຢ່າງໜ້ອຍ 1 ໄຟລ໌');
            }

            // Reload owner ID after saving owner
            await LoadOwnerId();
            const currentOwnerID = document.getElementById('ownerID').value;

            if (!currentOwnerID) {
              throw new Error('ບໍ່ສາມາດດຶງລະຫັດເຈົ້າຂອງໄດ້');
            }
            // Save product with current owner ID
            await saveProduct(
              product,
              formData.get('productName'),
              currentOwnerID,
              formData.get('productTypeID'),
              formData.get('village'),
              formData.get('districtID'),
              formData.get('status'),
              formData.get('size'),
              formData.get('price'),
              imageFiles,
              videoFiles,
              ownerData.ownerTel,
              formData.get('description')
            );
            await Swal.fire({
              icon: 'success',
              title: 'ບັນທຶກສຳເລັດ',
              text: 'ການບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ',
              confirmButtonText: 'ຕົກລົງ',
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
            await LoadData();
            Swal.close();
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'ຜິດພາດ',
              text: error,
              confirmButtonText: 'ຕົກລົງ',
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
          }
        });
      }
    });
  };
  const deleteProduct = async (id) => {
    try {

      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'ລົບສຳເລັດ',
          text:`ລຶບຂໍ້ມູນລະຫັດ ${id} ສຳເລັດແລ້ວ`,
          confirmButtonText: 'ຕົກລົງ',
          didOpen: () => {
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        });
        await LoadData(); // refresh product list
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ຜິດພາດ',
          text: 'ບໍ່ສາມາດລຶບໄດ້',
          confirmButtonText: 'ຕົກລົງ',
          didOpen: () => {
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'ຜິດພາດ',
        text: 'ມີບັນຫາເວລາລົບ',
        confirmButtonText: 'ຕົກລົງ',
        didOpen: () => {
          document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
        }
      });
    }
  };
  const PopUpEdit = (product) => {
    Swal.fire({
      title: 'ຟອມແກ້ໄຂຂໍ້ມູນ',
      width: '100%',
      confirmButtonText: 'ປິດຟອມ',
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      },
      html: `
      <div class="card-body">
        <form id="editProductForm" enctype="multipart/form-data">
          <h5 class="text-danger">ຂໍ້ມູນຊັບສິນ (Product)</h5>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">ຊື່ຊັບສິນ</label>
              <input type="text" name="productName" class="form-control" value="${product.productName}" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">ປະເພດຊັບສິນ</label>
              <select name="productTypeID" id="editProductTypeSelect" class="form-control" required>
                <option value="">-- ເລືອກປະເພດ --</option>
              </select>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">ແຂວງ</label>
              <select id="editProvinceSelect" class="form-control" required></select>
            </div>
            <div class="col-md-4">
              <label class="form-label">ເມືອງ</label>
              <select id="editDistrictSelect" name="districtID" class="form-control" required></select>
            </div>
            <div class="col-md-4">
              <label class="form-label">ບ້ານ</label>
              <input type="text" name="village" class="form-control" value="${product.village || ''}">
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">ສະຖານະ</label>
              <select name="status" class="form-control" required>
                <option value="">-- ເລືອກ --</option>
                <option value="ເຊົ່າ" ${product.status === 'ເຊົ່າ' ? 'selected' : ''}>ເຊົ່າ</option>
                <option value="ຂາຍ" ${product.status === 'ຂາຍ' ? 'selected' : ''}>ຂາຍ</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">ຂະໜາດ (m²)</label>
              <input type="text" name="size" class="form-control" value="${product.size || ''}">
            </div>
            <div class="col-md-4">
              <label class="form-label">ລາຄາ (ກີບ)</label>
              <input type="number" name="price" class="form-control" value="${product.price}" required>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">ລາຍລະອຽດ</label>
            <textarea name="description" class="form-control" rows="3">${product.description || ''}</textarea>
          </div>

          <div class="text-end">
            <button type="submit" class="btn btn-warning">
              <i class="fa fa-save me-1"></i> ບັນທຶກການແກ້ໄຂ
            </button>
          </div>
        </form>
      </div>
    `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

        const provinceSelect = document.getElementById('editProvinceSelect');
        const districtSelect = document.getElementById('editDistrictSelect');
        const productTypeSelect = document.getElementById('editProductTypeSelect');

        // Fill province dropdown
        provinceSelect.innerHTML = '<option value="">-- ເລືອກແຂວງ --</option>';
        Provinces.forEach(p => {
          const option = document.createElement('option');
          option.value = p.provinceID;
          option.textContent = p.provinceName;
          if (product.District && p.provinceID === product.District.provinceID) {
            option.selected = true;
          }
          provinceSelect.appendChild(option);
        });

        // Fill district dropdown
        const updateDistrictOptions = (selectedProvinceID) => {
          districtSelect.innerHTML = '<option value="">-- ເລືອກເມືອງ --</option>';
          const filteredDistricts = selectedProvinceID ?
            Districts.filter(d => d.provinceID == selectedProvinceID) :
            Districts;

          filteredDistricts.forEach(d => {
            const option = document.createElement('option');
            option.value = d.districtID;
            option.textContent = d.districtName;
            if (d.districtID === product.districtID) {
              option.selected = true;
            }
            districtSelect.appendChild(option);
          });
        };

        // Initial district load
        updateDistrictOptions(product.District?.provinceID);

        // Fill product type dropdown
        ProductTypes.forEach(p => {
          const option = document.createElement('option');
          option.value = p.productTypeID;
          option.textContent = p.productTypeName;
          if (p.productTypeID === product.productTypeID) {
            option.selected = true;
          }
          productTypeSelect.appendChild(option);
        });

        // Province change handler
        provinceSelect.addEventListener('change', () => {
          updateDistrictOptions(provinceSelect.value);
        });

        // District change handler
        districtSelect.addEventListener('change', () => {
          const districtID = districtSelect.value;
          const district = Districts.find(d => d.districtID == districtID);
          if (district) provinceSelect.value = district.provinceID;
        });

        // Form submission handler
        const form = document.getElementById('editProductForm');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);

          Swal.fire({
            title: 'ກຳລັງບັນທຶກ',
            text: 'ກະລຸນາລໍຖ້າ...',
            allowOutsideClick: false,
            didOpen: () => {
              // ປ່ຽນ font
              document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              // ໂຊວ໌ loading
              Swal.showLoading();
            }
          });
          try {
            const updateData = new FormData();
            updateData.append('productName', formData.get('productName'));
            updateData.append('productTypeID', formData.get('productTypeID'));
            updateData.append('village', formData.get('village'));
            updateData.append('districtID', formData.get('districtID'));
            updateData.append('status', formData.get('status'));
            updateData.append('size', formData.get('size'));
            updateData.append('price', formData.get('price'));
            updateData.append('description', formData.get('description'));
            const response = await fetch(`http://localhost:3000/api/products/upload/${product.productID}`, {
              method: 'PUT',
              body: updateData
            });
            if (response.status === 400) {
              const errorData = await response.json();
              alert(errorData.error);
              return;
            }

            await Swal.fire({
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              },
              icon: 'success',
              title: 'ອັບເດດສຳເລັດ',
              text: 'ການແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ',
              confirmButtonText: 'ຕົກລົງ'
            });

            await LoadData();
            Swal.close();
          } catch (error) {
            Swal.fire({
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              },
              icon: 'error',
              title: 'ຜິດພາດ',
              text: error.message,
              confirmButtonText: 'ຕົກລົງ'
            });
          }
        });

      }
    });
  };

  const PopUpDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      icon: 'question',
      html:`ຕ້ອງການລົບລະຫັດນີ້ແທ້ ຫຼື ບໍ?<br>ລະຫັດ: <b>${id}</b>`,
      showCancelButton: true,
      cancelButtonText: 'ຍົກເລີກ',
      confirmButtonText: 'ຕົກລົງ',
      cancelButtonColor: 'red',
      confirmButtonColor: 'blue',
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id);
      }
    });
  };
  const removeVideo = async (productID, index) => {
    try {
      const response = await fetch("http://localhost:3000/api/products/remove-video", {
        method: 'DELETE',
        body: JSON.stringify({
          productID,
          mediaType: "video",
          index
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ລົບສຳເລັດ",
          text: 'ລົບວີດີໂອສຳເລັດ',
          confirmButtonText: 'ຕົກລົງ',
          didOpen: () => {
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        }).then(() => {
          LoadData();
        });
      }
    } catch (error) {
      alert(error);
    }
  }
  const removeImage = async (productID, imageIndex) => {
    try {
      const response = await fetch("http://localhost:3000/api/products/remove-image", {
        method: 'DELETE',
        body: JSON.stringify({ productID, imageIndex }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ລົບສຳເລັດ",
          text: 'ລົບຮູບພາບສຳເລັດ',
          confirmButtonText: 'ຕົກລົງ',
          didOpen: () => {
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        }).then(() => {
          LoadData();
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "ຜິດພາດ", text: "ລຶບຮູບພາບບໍ່ສຳເລັດ" });
    }
  };

  const showDetail = (product) => {
    // Images HTML
    let imagesHtml = '';
    if (Array.isArray(product.image)) {
      imagesHtml = product.image.map((img, index) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="media-item card">
          <div class="position-relative">
            <span style="position:absolute; top:5px; left:5px; background:rgba(0,0,0,0.6); color:#fff; padding:2px 6px; border-radius:4px;">#${index + 1}</span>
            <img src="http://localhost:3000/${img.replace(/\\/g, '/')}" class="card-img-top media-preview" alt="Product Image" />
          </div>
          <div class="card-body p-2 text-end">
            <button class="btn btn-danger btn-sm btn-delete-image" data-index="${index}">
              <i class="fas fa-trash-alt"></i> ລຶບ
            </button>
          </div>
        </div>
      </div>
    `).join('');
    }

    // Videos HTML
    let videosHtml = '';
    if (Array.isArray(product.video)) {
      videosHtml = product.video.map((vid, index) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="media-item card">
          <div class="position-relative">
            <span style="position:absolute; top:5px; left:5px; background:rgba(0,0,0,0.6); color:#fff; padding:2px 6px; border-radius:4px;">#${index + 1}</span>
            <video controls class="card-img-top media-preview">
              <source src="http://localhost:3000/${vid.replace(/\\/g, '/')}" type="video/mp4">
            </video>
          </div>
          <div class="card-body p-2 text-end">
            <button class="btn btn-danger btn-sm btn-delete-video" data-index="${index}">
              <i class="fas fa-trash-alt"></i> ລຶບ
            </button>
          </div>
        </div>
      </div>
    `).join('');
    }

    const htmlContent = `
    <style>
      .swal2-container-custom { font-family: 'Noto Sans Lao Looped', sans-serif; }
      .swal2-popup-custom { border-radius:12px !important; box-shadow:0 10px 20px rgba(0,0,0,0.1) !important; }
      .media-item { border:1px solid #ddd; border-radius:8px; overflow:hidden; transition: transform 0.3s, box-shadow 0.3s; }
      .media-item:hover { transform:translateY(-5px); box-shadow:0 8px 16px rgba(0,0,0,0.2); }
      .media-preview { width:100%; height:150px; object-fit:cover; display:block; }
      .media-item .card-body { background-color:#f8f9fa; border-top:1px solid #eee; }
      .card-title { border-bottom:2px solid #007bff; padding-bottom:5px; font-weight:600; color:#333; }
    </style>

    <div class="container-fluid product-detail-modal-single">
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card shadow-sm p-4">
            <h4 class="card-title text-center mb-3"><strong>ຂໍ້ມູນສິນຄ້າ</strong></h4>
            <div class="row">
              <div class="col-md-6">
                <p><strong>ລະຫັດ:</strong> ${product.productID}</p>
                <p><strong>ບ້ານ:</strong> ${product.village}</p>
                <p><strong>ເມືອງ:</strong> ${product.District?.districtName}</p>
              </div>
              <div class="col-md-6">
                <p><strong>ແຂວງ:</strong> ${product.District?.Province?.provinceName}</p>
                <p><strong>ລາຄາ:</strong> ${Number(product.price).toLocaleString()} ກີບ</p>
                <p><strong>ສະຖານະ:</strong> ${product.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mb-4">
          <div class="card shadow-sm p-4">
            <h5 class="card-title">ຮູບພາບ</h5>
            <div class="row g-3">
              ${imagesHtml}
              <div class="col-12">
                <button class="btn btn-primary btn-lg mt-2 btn-add-image"><i class="fas fa-plus"></i> ເພີ່ມຮູບໃໝ່</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card shadow-sm p-4">
            <h5 class="card-title">ວີດີໂອ</h5>
            <div class="row g-3">
              ${videosHtml}
              <div class="col-12">
                <button class="btn btn-primary btn-lg mt-2 btn-add-video"><i class="fas fa-plus"></i> ເພີ່ມວີດີໂອໃໝ່</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    Swal.fire({
      title: <strong>${product.productName}</strong>,
      html: htmlContent,
      width: '90%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { container: 'swal2-container-custom', popup: 'swal2-popup-custom' },
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
        document.querySelectorAll('.btn-delete-image').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            removeImage(product.productID, index);
          });
        });
        document.querySelectorAll('.btn-delete-video').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            removeVideo(product.productID, index);
            console.log("Remove video index", index);
          });
        });
        document.querySelectorAll(".btn-add-image").forEach(btn => {
          btn.addEventListener('click', () => {
            AddImageToProduct(product.productID);
          })
        });
        document.querySelectorAll(".btn-add-video").forEach(btn => {
          btn.addEventListener('click', () => {
            AddVideoToProduct(product.productID);
          })
        })
      }
    });
  };

  return (
    <div>
      <div className="d-flex" style={{ fontFamily: 'Noto Sans Lao' }}>
        <Sidebar show={showSidebar} handleClose={closeSidebar} />
        <div className="flex-grow-1 w-100">
          <Header toggleSidebar={toggleSidebar} />
          <div className="p-3">
            <Row className='mb-3'>
              <Card className='p-3 shadow-lg rounted-3'>
                <Card.Body>
                  <h3 className='text-center fw-bold text-danger'>ຈັດການຂໍ້ມູນຊັບສິນ</h3>
                  <FormGroup>
                    <Container>
                      <label htmlFor="">ຄົ້ນຫາຊັບສິນ</label>
                      <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fas fa-search"></i></span>
                        <FormControl
                          id='searchInput'
                          placeholder='ຄົ້ນຫາ'
                          onChange={handleSearch}
                        />
                      </div>
                      <FormControl id='ownerID' type='hidden'></FormControl>
                      <FormControl id='AutoId' type='hidden'></FormControl>
                      <Button className='btn btn-danger m-3' onClick={PopUpSave}>
                        ເພີ່ມລາຍການຊັບສິນໃໝ່
                      </Button>
                      <Button className='btn btn-danger m-3' onClick={()=>Navigate('/owner')}>
                        ເພີ່ມຂໍ້ມູນເຈົ້າຂອງ
                      </Button>
                    </Container>
                  </FormGroup>
                </Card.Body>
              </Card>
            </Row>
            <Row className="g-3 mt-2" style={{
              maxHeight: "67vh",
              overflowY: "auto",
              paddingRight: "5px",
            }}>
              {filteredProducts.map((product) => (
                <Col
                  key={product.productID}
                  xs={12}
                  sm={6}
                  md={3}
                >
                  <Card className="h-100 shadow-lg border-0 text-center" style={{ cursor: 'pointer' }}>
                    <Container className='mt-2'>
                      <Card.Img
                        variant="top"
                        src={
                          Array.isArray(product.image)
                            ? `http://localhost:3000/${product.image[0]?.replace(/\\/g, '/') || ''}`
                            : product.image
                              ? `http://localhost:3000/${product.image.replace(/\\/g, '/')}`
                              : ''
                        }
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    </Container>
                    <Card.Header>
                      <h5 className="fw-bold text-primary">
                        ລະຫັດ: <span className="text-danger">{product.productID}</span>
                      </h5>
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
                      <span className="fw-bold text-danger">
                        ລາຄາ: {Number(product.price).toLocaleString()} ກີບ
                      </span>
                      <span className="fw-bold text-success">{product.status}</span>
                    </Card.Footer>
                    <Container className="mb-2">
                      <div className="d-flex gap-2">
                        <Button variant="danger" className='flex-grow-1' size="sm" onClick={() => showDetail(product)}>
                          <i className="fas fa-info-circle me-1"></i> ລາຍລະອຽດ
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => PopUpEdit(product)}>
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => PopUpDelete(product.productID)}>
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </Container>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;