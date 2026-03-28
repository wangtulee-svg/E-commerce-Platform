import React, { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import Header from '../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

import { Row, Col, Card, Container, Button, FormGroup, FormControl, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

const User = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const navigate = useNavigate();
  
  const [Users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [Roles, setRoles] = useState([]);
  const [Employees, setEmployees] = useState([]);

  const LoadData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const LoadRoles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const LoadEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/employees', {
        method: 'GET'
      });
      if (response.status === 200) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveUser = async (employeeID, username, password, roleID) => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({
          employeeID, username, password, roleID
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 400) {
        Swal.fire({
          title: 'ແຈ້ງເຕືອນ',
          text: 'ຊື່ຜູ້ໃຊ້ນີ້ມີໃນລະບົບແລ້ວ!',
          icon: 'warning',
          confirmButtonText: 'ຕົກລົງ',
          didOpen: () => {
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        });
        return false;
      }
      
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateUser = async (userID, username, fullName, roleID, tel, isActive) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userID}`, {
        method: 'PUT',
        body: JSON.stringify({
          username, fullName, roleID, tel, isActive
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const resetPassword = async (userID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userID}/reset-password`, {
        method: 'POST'
      });
      
      if (response.status === 200) {
        const data = await response.json();
        return data.newPassword;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    LoadData();
    LoadRoles();
    LoadEmployees();
  }, []);

  useEffect(() => {
    setFilteredUsers(Users);
  }, [Users]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!searchTerm) {
      setFilteredUsers(Users);
      return;
    }

    const filtered = Users.filter((user) => {
      const userId = user?.userID ? user.userID.toString().toLowerCase() : '';
      const username = user?.username ? user.username.toLowerCase() : '';
      const fullName = user?.fullName ? user.fullName.toLowerCase() : '';
      const tel = user?.tel ? user.tel.toString().toLowerCase() : '';
      const roleName = user?.Role?.roleName ? user.Role.roleName.toLowerCase() : '';
      
      return (
        (userId && userId.includes(searchTerm)) ||
        (username && username.includes(searchTerm)) ||
        (fullName && fullName.includes(searchTerm)) ||
        (tel && tel.includes(searchTerm)) ||
        (roleName && roleName.includes(searchTerm))
      );
    });

    setFilteredUsers(filtered);
  };

  const PopUpSave = () => {
    Swal.fire({
      title: 'ເພີ່ມຜູ້ໃຊ້ໃໝ່ - ເລືອກພະນັກງານ',
      width: '1200px',
      confirmButtonText: 'ປິດ',
      html: `
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-12">
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input type="text" id="employeeSearch" class="form-control" placeholder="ຄົ້ນຫາພະນັກງານ..." />
              </div>
            </div>
          </div>

          <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
            <table class="table table-striped table-hover">
              <thead style="position: sticky; top: 0; background: white; z-index: 1;">
                <tr class="text-center">
                  <th>ເລືອກ</th>
                  <th>ລະຫັດພະນັກງານ</th>
                  <th>ຊື່</th>
                  <th>ນາມສະກຸນ</th>
                  <th>ເບີໂທ</th>
                  <th>ຕຳແໜ່ງ</th>
                </tr>
              </thead>
              <tbody id="employeeTableBody">
              </tbody>
            </table>
          </div>

          <div class="row mt-4" id="selectedEmployeeSection" style="display: none;">
            <div class="col-12">
              <div class="card bg-light">
                <div class="card-body">
                  <h6 class="card-title">ພະນັກງານທີ່ເລືອກ</h6>
                  <p id="selectedEmployeeInfo" class="mb-0"></p>
                </div>
              </div>
            </div>
          </div>

          <form id="userForm" class="mt-3">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">ຊື່ຜູ້ໃຊ້</label>
                <input type="text" name="username" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">ລະຫັດຜ່ານ</label>
                <input type="password" name="password" class="form-control" required>
              </div>
            </div>

            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <label class="form-label">ສິດທິ</label>
                <select name="roleID" class="form-control" required>
                  <option value="">-- ເລືອກສິດທິ --</option>
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

            <input type="hidden" name="employeeID" id="selectedEmployeeID">

            <div class="text-end mt-3">
              <button type="submit" class="btn btn-success">
                <i class="fa fa-save me-1"></i> ບັນທຶກ
              </button>
            </div>
          </form>
        </div>
      `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

        const employeeTableBody = document.getElementById('employeeTableBody');
        const roleSelect = document.querySelector('select[name="roleID"]');
        const searchInput = document.getElementById('employeeSearch');
        const selectedEmployeeSection = document.getElementById('selectedEmployeeSection');
        const selectedEmployeeInfo = document.getElementById('selectedEmployeeInfo');
        const selectedEmployeeID = document.getElementById('selectedEmployeeID');

        // Fill roles dropdown
        roleSelect.innerHTML = '<option value="">-- ເລືອກສິດທິ --</option>';
        Roles.forEach(role => {
          const option = document.createElement('option');
          option.value = role.roleID;
          option.textContent = role.roleName;
          roleSelect.appendChild(option);
        });

        // Populate employee table
        const populateEmployeeTable = (employees) => {
          employeeTableBody.innerHTML = '';
          employees.forEach(employee => {
            const row = document.createElement('tr');
            row.className = 'text-center';
            row.innerHTML = `
              <td>
                <input type="radio" name="selectedEmployee" value="${employee.employeeID}" 
                       class="form-check-input employee-radio">
              </td>
              <td>${employee.employeeCode || '-'}</td>
              <td>${employee.firstName || '-'}</td>
              <td>${employee.lastName || '-'}</td>
              <td>${employee.tel || '-'}</td>
              <td>${employee.position || '-'}</td>
            `;
            employeeTableBody.appendChild(row);
          });

          // Add event listeners to radio buttons
          document.querySelectorAll('.employee-radio').forEach(radio => {
            radio.addEventListener('change', (e) => {
              if (e.target.checked) {
                const employeeId = e.target.value;
                const employee = Employees.find(emp => emp.employeeID == employeeId);
                
                if (employee) {
                  selectedEmployeeID.value = employeeId;
                  selectedEmployeeInfo.textContent = 
                    `${employee.employeeCode} - ${employee.firstName} ${employee.lastName} (${employee.tel || 'ບໍ່ມີເບີໂທ'})`;
                  selectedEmployeeSection.style.display = 'block';
                  
                  // Auto-generate username
                  const usernameInput = document.querySelector('input[name="username"]');
                  usernameInput.value = employee.employeeCode?.toLowerCase() || 
                                       `${employee.firstName?.toLowerCase()}.${employee.lastName?.toLowerCase()}`;
                }
              }
            });
          });
        };

        // Initial population
        populateEmployeeTable(Employees);

        // Search functionality
        searchInput.addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          const filtered = Employees.filter(employee => {
            return (
              (employee.employeeCode && employee.employeeCode.toLowerCase().includes(searchTerm)) ||
              (employee.firstName && employee.firstName.toLowerCase().includes(searchTerm)) ||
              (employee.lastName && employee.lastName.toLowerCase().includes(searchTerm)) ||
              (employee.tel && employee.tel.toLowerCase().includes(searchTerm)) ||
              (employee.position && employee.position.toLowerCase().includes(searchTerm))
            );
          });
          populateEmployeeTable(filtered);
        });

        // Add form submission handler
        const form = document.getElementById('userForm');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);

          if (!selectedEmployeeID.value) {
            Swal.fire({
              icon: 'warning',
              title: 'ແຈ້ງເຕືອນ',
              text: 'ກະລຸນາເລືອກພະນັກງານກ່ອນ',
              confirmButtonText: 'ຕົກລົງ',
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
            return;
          }

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
            const success = await saveUser(
              selectedEmployeeID.value,
              formData.get('username'),
              formData.get('password'),
              formData.get('roleID')
            );

            if (success) {
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

  const PopUpEdit = (user) => {
    Swal.fire({
      title: 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້',
      width: '800px',
      confirmButtonText: 'ປິດ',
      html: `
        <div class="card-body">
          <form id="editUserForm">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">ຊື່ຜູ້ໃຊ້</label>
                <input type="text" name="username" class="form-control" value="${user?.username || ''}" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">ຊື່ເຕັມ</label>
                <input type="text" name="fullName" class="form-control" value="${user?.fullName || ''}" required>
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">ເບີໂທ</label>
                <input type="text" name="tel" class="form-control" value="${user?.tel || ''}" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">ສິດທິ</label>
                <select name="roleID" id="editRoleSelect" class="form-control" required>
                  <option value="">-- ເລືອກສິດທິ --</option>
                </select>
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">ສະຖານະ</label>
                <select name="isActive" class="form-control" required>
                  <option value="true" ${user?.isActive ? 'selected' : ''}>ເປີດໃຊ້ງານ</option>
                  <option value="false" ${!user?.isActive ? 'selected' : ''}>ປິດໃຊ້ງານ</option>
                </select>
              </div>
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

        const roleSelect = document.getElementById('editRoleSelect');
        
        // Fill roles dropdown
        roleSelect.innerHTML = '<option value="">-- ເລືອກສິດທິ --</option>';
        Roles.forEach(role => {
          const option = document.createElement('option');
          option.value = role.roleID;
          option.textContent = role.roleName;
          if (role.roleID === user?.roleID) {
            option.selected = true;
          }
          roleSelect.appendChild(option);
        });

        // Add form submission handler
        const form = document.getElementById('editUserForm');
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
            const success = await updateUser(
              user.userID,
              formData.get('username'),
              formData.get('fullName'),
              formData.get('roleID'),
              formData.get('tel'),
              formData.get('isActive') === 'true'
            );

            if (success) {
              await Swal.fire({
                icon: 'success',
                title: 'ອັບເດດສຳເລັດ',
                text: 'ການແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ',
                confirmButtonText: 'ຕົກລົງ',
                didOpen: () => {
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                }
              });
              await LoadData();
              Swal.close();
            } else {
              throw new Error('ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້');
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

  const PopUpResetPassword = (user) => {
    Swal.fire({
      title: 'ຣີເຊັດລະຫັດຜ່ານ',
      html: `ທ່ານຕ້ອງການຣີເຊັດລະຫັດຜ່ານສຳລັບຜູ້ໃຊ້ <b>${user?.username || ''}</b> ແທ້ບໍ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ຕົກລົງ',
      cancelButtonText: 'ຍົກເລີກ',
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
          const newPassword = await resetPassword(user.userID);
          
          if (newPassword) {
            Swal.fire({
              title: 'ຣີເຊັດລະຫັດຜ່ານສຳເລັດ',
              html: `ລະຫັດຜ່ານໃໝ່ຂອງຜູ້ໃຊ້ <b>${user.username}</b> ແມ່ນ: <code>${newPassword}</code><br><br>ກະລຸນາບອກຜູ້ໃຊ້ໃຫ້ປ່ຽນລະຫັດຜ່ານໃໝ່ທັນທີ.`,
              icon: 'success',
              confirmButtonText: 'ຕົກລົງ',
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
          } else {
            throw new Error('ບໍ່ສາມາດຣີເຊັດລະຫັດຜ່ານໄດ້');
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
      }
    });
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'ລົບສຳເລັດ',
          text: `ລຶບຂໍ້ມູນຜູ້ໃຊ້ລະຫັດ ${id} ສຳເລັດແລ້ວ`,
          confirmButtonText: 'ຕົກລົງ',
          didOpen: () => {
            document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
          }
        });
        await LoadData();
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

  const PopUpDelete = (id, username) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      icon: 'question',
      html: `ທ່ານຕ້ອງການລົບຜູ້ໃຊ້ <b>${username || ''}</b> ແທ້ບໍ?`,
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
        deleteUser(id);
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
                  <h3 className='text-center fw-bold text-danger'>ຈັດການຂໍ້ມູນຜູ້ໃຊ້</h3>
                  <FormGroup>
                    <Container>
                      <label htmlFor="searchInput">ຄົ້ນຫາຜູ້ໃຊ້</label>
                      <div className="input-group mb-3">
                        <span className="input-group-text"><i className="fas fa-search"></i></span>
                        <FormControl
                          id='searchInput'
                          placeholder='ຄົ້ນຫາຕາມຊື່ຜູ້ໃຊ້, ຊື່ເຕັມ, ຫຼື ເບີໂທ'
                          onChange={handleSearch}
                        />
                      </div>
                      <Button className='btn btn-danger m-3' onClick={PopUpSave}>
                        <i className="fas fa-user-plus me-2"></i> ເພີ່ມຜູ້ໃຊ້ໃໝ່
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
                            <th>#</th>
                            <th>ລະຫັດຜູ້ໃຊ້</th>
                            <th>ຊື່ຜູ້ໃຊ້</th>
                            <th>ຊື່ເຕັມ</th>
                            <th>ເບີໂທ</th>
                            <th>ສິດທິ</th>
                            <th>ສະຖານະ</th>
                            <th>ວັນທີ່ສ້າງ</th>
                            <th>ຈັດການ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                              <tr key={user.userID}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{user.userID}</td>
                                <td>{user.username}</td>
                                <td>{user.fullName}</td>
                                <td>{user.tel || '-'}</td>
                                <td>{user.Role?.roleName || 'No Role'}</td>
                                <td className="text-center">
                                  <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                                    {user.isActive ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                                  </span>
                                </td>
                                <td className="text-center">
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center">
                                    <Button 
                                      variant="warning" 
                                      size="sm" 
                                      className="me-2"
                                      onClick={() => PopUpEdit(user)}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Button>
                                    <Button 
                                      variant="info" 
                                      size="sm" 
                                      className="me-2"
                                      onClick={() => PopUpResetPassword(user)}
                                    >
                                      <i className="fas fa-key"></i>
                                    </Button>
                                    <Button 
                                      variant="danger" 
                                      size="sm"
                                      onClick={() => PopUpDelete(user.userID, user.username)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" className="text-center text-muted py-4">
                                <i className="fas fa-search fa-2x mb-2"></i>
                                <p>ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້</p>
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

export default User;