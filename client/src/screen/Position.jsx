import React, { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import Header from '../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

import { Row, Col, Card, Container, Button, FormGroup, FormControl, Table, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Position = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const navigate = useNavigate();
  
  const [Positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [Departments, setDepartments] = useState([]);

  const LoadData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/positions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setPositions(data);
      } else {
        throw new Error('Failed to load positions');
      }
    } catch (error) {
      console.error('Error loading positions:', error);
      Swal.fire({
        icon: 'error',
        title: 'ແຈ້ງເຕືອນ',
        text: 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຕຳແໜ່ງໄດ້',
        confirmButtonText: 'ຕົກລົງ',
        didOpen: () => {
          document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
        }
      });
    }
  };

  const LoadDepartments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      Swal.fire({
        icon: 'error',
        title: 'ແຈ້ງເຕືອນ',
        text: 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະແນກໄດ້',
        confirmButtonText: 'ຕົກລົງ',
        didOpen: () => {
          document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
        }
      });
    }
  };

  const savePosition = async (positionCode, positionName, departmentID, description, isActive) => {
    try {
      const response = await fetch('http://localhost:3000/api/positions', {
        method: 'POST',
        body: JSON.stringify({
          positionCode,
          positionName,
          departmentID,
          description,
          isActive
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ຊື່ຕຳແໜ່ງນີ້ມີໃນລະບົບແລ້ວ!');
      }
      
      if (response.status === 200) {
        return true;
      }
      
      throw new Error('Failed to save position');
    } catch (error) {
      console.error('Error saving position:', error);
      throw error;
    }
  };

  const updatePosition = async (positionID, positionCode, positionName, departmentID, description, isActive) => {
    try {
      const response = await fetch(`http://localhost:3000/api/positions/${positionID}`, {
        method: 'PUT',
        body: JSON.stringify({
          positionCode,
          positionName,
          departmentID,
          description,
          isActive
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 200) {
        return true;
      }
      
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້');
      }
      
      throw new Error('Failed to update position');
    } catch (error) {
      console.error('Error updating position:', error);
      throw error;
    }
  };

  const deletePosition = async (positionID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/positions/${positionID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        return true;
      }
      
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ບໍ່ສາມາດລຶບຕຳແໜ່ງນີ້ໄດ້ ເນື່ອງຈາກມີພະນັກງານໃຊ້ຢູ່');
      }
      
      throw new Error('Failed to delete position');
    } catch (error) {
      console.error('Error deleting position:', error);
      throw error;
    }
  };

  useEffect(() => {
    LoadData();
    LoadDepartments();
  }, []);

  useEffect(() => {
    setFilteredPositions(Positions);
  }, [Positions]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!searchTerm) {
      setFilteredPositions(Positions);
      return;
    }

    const filtered = Positions.filter((position) => {
      const positionCode = position?.positionCode ? position.positionCode.toLowerCase() : '';
      const positionName = position?.positionName ? position.positionName.toLowerCase() : '';
      const departmentName = position?.Department?.departmentName ? position.Department.departmentName.toLowerCase() : '';
      const description = position?.description ? position.description.toLowerCase() : '';
      
      return (
        positionCode.includes(searchTerm) ||
        positionName.includes(searchTerm) ||
        departmentName.includes(searchTerm) ||
        description.includes(searchTerm)
      );
    });

    setFilteredPositions(filtered);
  };

  const PopUpSave = () => {
    Swal.fire({
      title: 'ເພີ່ມຕຳແໜ່ງໃໝ່',
      width: '800px',
      confirmButtonText: 'ປິດ',
      html: `
        <div class="card-body">
          <form id="positionForm">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">ລະຫັດຕຳແໜ່ງ</label>
                <input type="text" name="positionCode" class="form-control" required 
                       placeholder="ປ້ອນລະຫັດຕຳແໜ່ງ">
              </div>
              <div class="col-md-6">
                <label class="form-label">ຊື່ຕຳແໜ່ງ</label>
                <input type="text" name="positionName" class="form-control" required 
                       placeholder="ປ້ອນຊື່ຕຳແໜ່ງ">
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">ພະແນກ</label>
                <select name="departmentID" id="departmentSelect" class="form-control" required>
                  <option value="">-- ເລືອກພະແນກ --</option>
                  <option value="text">ເລືອກພະແນກ</option>
                  <option value="text">ເລືອກພະແນກ</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">ສະຖານະ</label>
                <select name="isActive" class="form-control" required>
                  <option value="true">ເປີດໃຊ້ງານ</option>
                  <option value="false">ປິດໃຊ້ງານ</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">ຄຳອະທິບາຍ</label>
              <textarea name="description" class="form-control" rows="3" 
                        placeholder="ປ້ອນຄຳອະທິບາຍຕຳແໜ່ງ"></textarea>
            </div>

            <div class="text-end">
              <button type="submit" class="btn btn-success">
                <i class="fa fa-save me-1"></i> ບັນທຶກ
              </button>
            </div>
          </form>
        </div>
      `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

        const departmentSelect = document.getElementById('departmentSelect');
        const form = document.getElementById('positionForm');

        // Fill departments dropdown
        departmentSelect.innerHTML = '<option value="">-- ເລືອກພະແນກ --</option>';
        Departments.forEach(dept => {
          const option = document.createElement('option');
          option.value = dept.departmentID;
          option.textContent = dept.departmentName;
          departmentSelect.appendChild(option);
        });

        // Add form submission handler
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);

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
            const success = await savePosition(
              formData.get('positionCode'),
              formData.get('positionName'),
              formData.get('departmentID'),
              formData.get('description'),
              formData.get('isActive') === 'true'
            );

            if (success) {
              await Swal.fire({
                icon: 'success',
                title: 'ບັນທຶກສຳເລັດ',
                text: 'ການບັນທຶກຂໍ້ມູນຕຳແໜ່ງສຳເລັດແລ້ວ',
                confirmButtonText: 'ຕົກລົງ',
                didOpen: () => {
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                }
              });
              await LoadData();
              Swal.close();
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'ຜິດພາດ',
              text: error.message,
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

  const PopUpEdit = (position) => {
    Swal.fire({
      title: 'ແກ້ໄຂຂໍ້ມູນຕຳແໜ່ງ',
      width: '800px',
      confirmButtonText: 'ປິດ',
      html: `
        <div class="card-body">
          <form id="editPositionForm">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">ລະຫັດຕຳແໜ່ງ</label>
                <input type="text" name="positionCode" class="form-control" 
                       value="${position.positionCode || ''}" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">ຊື່ຕຳແໜ່ງ</label>
                <input type="text" name="positionName" class="form-control" 
                       value="${position.positionName || ''}" required>
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label">ພະແນກ</label>
                <select name="departmentID" id="editDepartmentSelect" class="form-control" required>
                  <option value="">-- ເລືອກພະແນກ --</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">ສະຖານະ</label>
                <select name="isActive" class="form-control" required>
                  <option value="true" ${position.isActive ? 'selected' : ''}>ເປີດໃຊ້ງານ</option>
                  <option value="false" ${!position.isActive ? 'selected' : ''}>ປິດໃຊ້ງານ</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">ຄຳອະທິບາຍ</label>
              <textarea name="description" class="form-control" rows="3">${position.description || ''}</textarea>
            </div>

            <div class="text-end">
              <button type="submit" class="btn btn-success">
                <i class="fa fa-save me-1"></i> ບັນທຶກການແກ້ໄຂ
              </button>
            </div>
          </form>
        </div>
      `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

        const departmentSelect = document.getElementById('editDepartmentSelect');
        const form = document.getElementById('editPositionForm');

        // Fill departments dropdown
        departmentSelect.innerHTML = '<option value="">-- ເລືອກພະແນກ --</option>';
        Departments.forEach(dept => {
          const option = document.createElement('option');
          option.value = dept.departmentID;
          option.textContent = dept.departmentName;
          if (dept.departmentID === position.departmentID) {
            option.selected = true;
          }
          departmentSelect.appendChild(option);
        });

        // Add form submission handler
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);

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
            const success = await updatePosition(
              position.positionID,
              formData.get('positionCode'),
              formData.get('positionName'),
              formData.get('departmentID'),
              formData.get('description'),
              formData.get('isActive') === 'true'
            );

            if (success) {
              await Swal.fire({
                icon: 'success',
                title: 'ອັບເດດສຳເລັດ',
                text: 'ການແກ້ໄຂຂໍ້ມູນຕຳແໜ່ງສຳເລັດແລ້ວ',
                confirmButtonText: 'ຕົກລົງ',
                didOpen: () => {
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                }
              });
              await LoadData();
              Swal.close();
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'ຜິດພາດ',
              text: error.message,
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

  const PopUpDelete = (position) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      icon: 'question',
      html: `ທ່ານຕ້ອງການລົບຕຳແໜ່ງ <b>${position.positionName || ''}</b> ແທ້ບໍ?`,
      showCancelButton: true,
      cancelButtonText: 'ຍົກເລີກ',
      confirmButtonText: 'ຕົກລົງ',
      cancelButtonColor: 'red',
      confirmButtonColor: 'blue',
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'ກຳລັງດຳເນີນການ',
          text: 'ກະລຸນາລໍຖ້າ...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        });

        try {
          await deletePosition(position.positionID);
          
          await Swal.fire({
            icon: 'success',
            title: 'ລົບສຳເລັດ',
            text: `ລຶບຕຳແໜ່ງ ${position.positionName} ສຳເລັດແລ້ວ`,
            confirmButtonText: 'ຕົກລົງ',
            didOpen: () => {
              document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
            }
          });
          
          await LoadData();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'ຜິດພາດ',
            text: error.message,
            confirmButtonText: 'ຕົກລົງ',
            didOpen: () => {
              document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
            }
          });
        }
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
              <Card className='p-3 shadow-lg rounded-3'>
                <Card.Body>
                  <h3 className='text-center fw-bold text-danger'>ຈັດການຂໍ້ມູນຕຳແໜ່ງ</h3>
                  <FormGroup>
                    <Container>
                      <label htmlFor="searchInput">ຄົ້ນຫາຕຳແໜ່ງ</label>
                      <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fas fa-search"></i></span>
                        <FormControl
                          id='searchInput'
                          placeholder='ຄົ້ນຫາຕາມຊື່ຕຳແໜ່ງ, ລະຫັດ, ຫຼື ພະແນກ'
                          onChange={handleSearch}
                        />
                      </div>
                      <Button className='btn btn-danger m-3' onClick={PopUpSave}>
                        <i className="fas fa-plus me-2"></i> ເພີ່ມຕຳແໜ່ງໃໝ່
                      </Button>
                    </Container>
                  </FormGroup>
                </Card.Body>
              </Card>
            </Row>
            
            <Row className="mt-4">
              <Col>
                <Card className="shadow-lg">
                  <Card.Body>
                    <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                      <Table striped bordered hover>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1 }}>
                          <tr className="text-center">
                            <th>ລ/ດ</th>
                            <th>ລະຫັດຕຳແໜ່ງ</th>
                            <th>ຊື່ຕຳແໜ່ງ</th>
                            <th>ພະແນກ</th>
                            <th>ຄຳອະທິບາຍ</th>
                            <th>ສະຖານະ</th>
                            <th>ວັນທີ່ສ້າງ</th>
                            <th>ຈັດການ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPositions.length > 0 ? (
                            filteredPositions.map((position, index) => (
                              <tr key={position.positionID}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center fw-bold">{position.positionCode}</td>
                                <td>{position.positionName}</td>
                                <td>{position.Department?.departmentName || 'ບໍ່ມີພະແນກ'}</td>
                                <td>{position.description || '-'}</td>
                                <td className="text-center">
                                  <Badge bg={position.isActive ? 'success' : 'danger'}>
                                    {position.isActive ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                                  </Badge>
                                </td>
                                <td className="text-center">
                                  {position.createdAt ? new Date(position.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center">
                                    <Button 
                                      variant="warning" 
                                      size="sm" 
                                      className="me-2"
                                      onClick={() => PopUpEdit(position)}
                                      title="ແກ້ໄຂ"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Button>
                                    <Button 
                                      variant="danger" 
                                      size="sm"
                                      onClick={() => PopUpDelete(position)}
                                      title="ລຶບ"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center text-muted py-4">
                                <i className="fas fa-search fa-2x mb-2"></i>
                                <p>ບໍ່ພົບຂໍ້ມູນຕຳແໜ່ງ</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Position;