import React, { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import Header from '../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
import { Row,  Col, Card, Container, Button, FormGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Employee = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const Navigate = useNavigate();

  const [Employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [Districts, setDistricts] = useState([]);
  const [Provinces, setProvicnces] = useState([]);
  const [Positions, setPositions] = useState([]); // ຕາຕະລາງຕຳແໜ່ງ (ຖ້າມີ)

  // ====== API LOADERS (ປັບ Endpoint ຕາມ backend ຂອງທ່ານ) ======
  const LoadEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const LoadProvince = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/provinces', { method: 'GET' });
      if (res.ok) setProvicnces(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const LoadDistrict = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/districts', { method: 'GET' });
      if (res.ok) setDistricts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const LoadPositions = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/positions', { method: 'GET' });
      if (res.ok) setPositions(await res.json());
    } catch (e) {
      // ຖ້າບໍ່ມີ API ຕຳແໜ່ງ ຈະປະກາດຄ່າແບບຄົງໄວ້
      setPositions([
        { positionID: 1, positionName: 'ພະນັກງານ' },
        { positionID: 2, positionName: 'ຜູ້ຈັດການ' },
      ]);
    }
  };

  const AutoEmployeeId = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees/autoid', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        document.getElementById('AutoEmpId').value = data.newId;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ====== CRUD ======
  const saveEmployee = async (payload) => {
    try {
      const res = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 400) {
        const msg = await res.json();
        Swal.fire({ icon: 'warning', title: 'ແຈ້ງເຕືອນ', text: msg?.message || 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ' });
        return false;
      }
      return res.ok;
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'ຜິດພາດ', text: e.message });
      return false;
    }
  };

  const updateEmployee = async (employeeID, payload) => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${employeeID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg?.message || 'ອັບເດດບໍ່ສຳເລັດ');
      }
      return true;
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'ຜິດພາດ', text: e.message });
      return false;
    }
  };

  const deleteEmployee = async (employeeID) => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${employeeID}`, { method: 'DELETE' });
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'ລົບສຳເລັດ',
          text: `ລົບພະນັກງານ ${employeeID} ສຳເລັດ`,
        });
        await LoadEmployees();
      } else {
        Swal.fire({ icon: 'error', title: 'ຜິດພາດ', text: 'ບໍ່ສາມາດລົບໄດ້' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'ຜິດພາດ', text: 'ເກີດບັນຫາເວລາລົບ' });
    }
  };

  // ====== POPUPS ======
// ====== POPUPS ======
const PopUpSave = () => {
  Swal.fire({
    title: 'ເພີ່ມພະນັກງານ',
    width: '100%',
    confirmButtonText: 'ປິດ',
    html: `
      <div class="card-body">
        <form id="empForm">
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">ຊື່-ນາມສະກຸນ</label>
              <input type="text" name="employeeName" class="form-control" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">ເພດ</label>
              <select id="genderSelect" name="gender" class="form-control" required>
                <option value="">-- ເລືອກ --</option>
                <option value="ຊາຍ">ຊາຍ</option>
                <option value="ຍິງ">ຍິງ</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">ວັນເດືອນປີເກີດ</label>
              <input type="date" name="birth" class="form-control" required />
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
              <input type="text" name="village" class="form-control" />
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">ເບໂທ</label>
              <input id="tel" type="number" name="tel" class="form-control" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">ເງິນເດືອນ (ກີບ)</label>
              <input type="number" name="salary" class="form-control" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">ຕຳແໜ່ງ</label>
              <select id="positionSelect" name="positionID" class="form-control" required></select>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">CV</label>
              <input id="cv" type="file" name="cv" class="form-control" required />
            </div>
          </div>

          <div class="text-end">
            <button class="btn btn-success"><i class="fa fa-save me-1"></i> ບັນທຶກ</button>
          </div>
        </form>
      </div>
    `,
    didOpen: () => {
      document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

      const provinceSelect = document.getElementById('provinceSelect');
      const districtSelect = document.getElementById('districtSelect');
      const positionSelect = document.getElementById('positionSelect');

      // Populate Provinces
      provinceSelect.innerHTML = '<option value="">-- ເລືອກແຂວງ --</option>';
      Provinces.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.provinceID;
        opt.textContent = p.provinceName;
        provinceSelect.appendChild(opt);
      });

      // Function to render districts
      const renderDistricts = (items) => {
        districtSelect.innerHTML = '<option value="">-- ເລືອກເມືອງ --</option>';
        items.forEach(d => {
          const opt = document.createElement('option');
          opt.value = d.districtID;
          opt.textContent = d.districtName;
          districtSelect.appendChild(opt);
        });
      };
      renderDistricts(Districts);

      // Populate Positions
      positionSelect.innerHTML = '<option value="">-- ເລືອກຕຳແໜ່ງ --</option>';
      Positions.forEach(pos => {
        const opt = document.createElement('option');
        opt.value = pos.positionID;
        opt.textContent = pos.positionName;
        positionSelect.appendChild(opt);
      });

      // Province → District filter
      provinceSelect.addEventListener('change', () => {
        const filtered = Districts.filter(d => String(d.provinceID) === String(provinceSelect.value));
        renderDistricts(filtered);
      });

      districtSelect.addEventListener('change', () => {
        const d = Districts.find(x => String(x.districtID) === String(districtSelect.value));
        if (d) provinceSelect.value = d.provinceID;
      });

      // Submit
      const form = document.getElementById('empForm');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);

        const payload = {
          employeeID: document.getElementById('AutoEmpId').value,
          employeeName: fd.get('employeeName'),
          birth: fd.get('birth'),
          tel: fd.get('tel'),
          village: fd.get('village') || '',
          cv: fd.get('cv') || '',
          districtID: fd.get('districtID'),
          salary: fd.get('salary'),
          positionID: fd.get('positionID'),
          gender: fd.get('gender'),
        };

        if (!payload.employeeName || !payload.birth || !payload.tel || !payload.districtID || !payload.salary || !payload.positionID || !payload.gender) {
          Swal.fire({ icon: 'warning', title: 'ແຈ້ງເຕືອນ', text: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ' });
          return;
        }

        Swal.fire({ title: 'ກຳລັງບັນທຶກ', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const ok = await saveEmployee(payload);
        Swal.close();
        if (ok) {
          await Swal.fire({ icon: 'success', title: 'ບັນທຶກສຳເລັດ' });
          await LoadEmployees();
        }
      });
    }
  });
};

// ====== PopUp Update ======
const PopUpupda = (x) => {
  Swal.fire({
    title: 'ແກ້ໄຂພະນັກງານ',
    width: '100%',
    confirmButtonText: 'ປິດ',
    html: `
      <div class="card-body">
        <form id="empForm">
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">ຊື່-ນາມສະກຸນ</label>
              <input type="text" name="employeeName" class="form-control" required value="${x.employeeName}" />
            </div>
            <div class="col-md-4">
              <label class="form-label">ເພດ</label>
              <select id="genderSelect" name="gender" class="form-control" required>
                <option value="">-- ເລືອກ --</option>
                <option value="ຊາຍ">ຊາຍ</option>
                <option value="ຍິງ">ຍິງ</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">ວັນເດືອນປີເກີດ</label>
              <input type="date" name="birth" class="form-control" required value="${new Date(x.birth).toISOString().split('T')[0]}"/>
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
              <input type="text" name="village" class="form-control" value="${x.employeeVillage}" />
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">ເບໂທ</label>
              <input type="number" name="tel" class="form-control" value="${x.employeeTel}" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">ເງິນເດືອນ (ກີບ)</label>
              <input type="number" name="salary" class="form-control" value="${x.salary}" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">ຕຳແໜ່ງ</label>
              <select id="positionSelect" name="positionID" class="form-control" required></select>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">CV</label>
              <input type="file" name="cv" class="form-control" />
            </div>
          </div>

          <div class="text-end">
            <button class="btn btn-success"><i class="fa fa-save me-1"></i> ບັນທຶກ</button>
          </div>
        </form>
      </div>
    `,
    didOpen: () => {
      document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";

      const provinceSelect = document.getElementById('provinceSelect');
      const districtSelect = document.getElementById('districtSelect');
      const positionSelect = document.getElementById('positionSelect');
      const genderSelect = document.getElementById('genderSelect');

      // Set gender
      genderSelect.value = x.employeeGender;

      // Populate Provinces
      provinceSelect.innerHTML = '<option value="">-- ເລືອກແຂວງ --</option>';
      Provinces.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.provinceID;
        opt.textContent = p.provinceName;
        provinceSelect.appendChild(opt);
      });
      provinceSelect.value = x.District.Province.provinceID;

      // Render Districts
      const renderDistricts = (items) => {
        districtSelect.innerHTML = '<option value="">-- ເລືອກເມືອງ --</option>';
        items.forEach(d => {
          const opt = document.createElement('option');
          opt.value = d.districtID;
          opt.textContent = d.districtName;
          districtSelect.appendChild(opt);
        });
      };
      renderDistricts(Districts.filter(d => d.provinceID === x.District.Province.provinceID));
      districtSelect.value = x.districtID;

      // Populate Positions
      positionSelect.innerHTML = '<option value="">-- ເລືອກຕຳແໜ່ງ --</option>';
      Positions.forEach(pos => {
        const opt = document.createElement('option');
        opt.value = pos.positionID;
        opt.textContent = pos.positionName;
        positionSelect.appendChild(opt);
      });
      positionSelect.value = x.positionID;

      // Province → District filter
      provinceSelect.addEventListener('change', () => {
        const filtered = Districts.filter(d => String(d.provinceID) === String(provinceSelect.value));
        renderDistricts(filtered);
      });

      districtSelect.addEventListener('change', () => {
        const d = Districts.find(x => String(x.districtID) === String(districtSelect.value));
        if (d) provinceSelect.value = d.provinceID;
      });

      // Submit
      const form = document.getElementById('empForm');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);

        const payload = {
          employeeID: x.employeeID,
          employeeName: fd.get('employeeName'),
          birth: fd.get('birth'),
          tel: fd.get('tel'),
          village: fd.get('village') || '',
          cv: fd.get('cv') || '',
          districtID: fd.get('districtID'),
          salary: fd.get('salary'),
          positionID: fd.get('positionID'),
          gender: fd.get('gender'),
        };

        if (!payload.employeeName || !payload.birth || !payload.tel || !payload.districtID || !payload.salary || !payload.positionID || !payload.gender) {
          Swal.fire({ icon: 'warning', title: 'ແຈ້ງເຕືອນ', text: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ' });
          return;
        }

        Swal.fire({ title: 'ກຳລັງບັນທຶກ', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const ok = await updateEmployee(x.employeeID, payload);
        Swal.close();
        if (ok) {
          await Swal.fire({ icon: 'success', title: 'ອັບເດດສຳເລັດ' });
          await LoadEmployees();
        }
      });
    }
  });
};


  // ====== EFFECTS ======
  useEffect(() => {
    LoadEmployees();
    LoadDistrict();
    LoadProvince();
    LoadPositions();
    AutoEmployeeId();
  }, []);

  useEffect(() => {
    setFilteredEmployees(Employees);
  }, [Employees]);

  // ====== SEARCH ======
  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = Employees.filter(emp => {
      const f = (v) => (v ?? '').toString().toLowerCase();
      return (
        f(emp.employeeID).includes(q) ||
        f(emp.employeeName).includes(q) ||
        f(emp.village).includes(q) ||
        f(emp?.District?.districtName).includes(q) ||
        f(emp?.District?.Province?.provinceName).includes(q) ||
        f(emp?.positionName).includes(q) || // ຖ້າ backend join ຊື່ຕຳແໜ່ງ
        f(emp.status).includes(q) ||
        f(emp.tel).includes(q) ||
        f(emp.salary).includes(q)
      );
    });
    setFilteredEmployees(filtered);
  };

  // ====== UI ======
  return (
    <div className="d-flex" style={{ fontFamily: 'Noto Sans Lao' }}>
      <Sidebar show={showSidebar} handleClose={closeSidebar} />
      <div className="flex-grow-1 w-100">
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-3">
          <Row className="mb-3">
            <Card className="p-3 shadow-lg rounted-3">
              <Card.Body>
                <h3 className="text-center fw-bold text-danger">ຈັດການຂໍ້ມູນພະນັກງານ</h3>
                <FormGroup>
                  <Container>
                    <label>ຄົ້ນຫາພະນັກງານ</label>
                    <div className="input-group mb-3">
                      <span className="input-group-text"><i className="fas fa-search" /></span>
                      <FormControl id="searchInput" placeholder="ຄົ້ນຫາ" onChange={handleSearch} />
                    </div>

                    <FormControl id="AutoEmpId" type="hidden" />

                    <Button 
                   className="btn btn-danger m-3" onClick={PopUpSave}>
                      <i className="fas fa-user-plus me-2"></i>  ເພີ່ມພະນັກງານໃໝ່
                    </Button>
                
                  </Container>
                </FormGroup>
              </Card.Body>
            </Card>
          </Row>
          <Card>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <td>ລະຫັດ</td>
                        <td>ຊື່ ແລະ ນາມສະກຸນ</td>
                        <td>ເພດ</td>
                        <td>ວັນເດືອນປີເກີດ</td>
                        <td>ເບີໂທ</td>
                        <td>ບ້ານ</td>
                        <td>ເມືອງ</td>
                        <td>ແຂວງ</td>
                        <td>ເງິນເດືອນ</td>
                        <td>ຈັດການ</td>
                    </tr>
                </thead>
                <tbody>
                    {Employees.map((x)=>(
                        <tr key={x.employeeID}>
                            <td>{x.employeeID}</td>
                            <td>{x.employeeName}</td>
                            <td>{x.employeeGender}</td>
                            <td>{x.birth}</td>
                            <td>{x.employeeTel}</td>
                            <td>{x.employeeVillage}</td>
                            <td>{x.District.districtName}</td>
                            <td>{x.District.Province.provinceName}</td>
                            <td>{x.salary}</td>
                            <td>
                                <button className='btn btn-warning 'onClick={()=>PopUpupda(x)}>
                                    ແກ້ໄຂ
                                </button>
                                &nbsp;
                                <button className='btn btn-danger' onClick={()=>deleteEmployee(x.employeeID)}>
                                    ລຶບ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Employee;