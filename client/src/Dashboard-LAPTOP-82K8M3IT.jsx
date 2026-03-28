// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './component/Sidebar';
import Header from './component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Container, Card, Row, Col, Button, FormGroup, Table } from 'react-bootstrap';
import { ReactTyped } from 'react-typed';
import { Pie, Bar } from "react-chartjs-2";
import Swal from 'sweetalert2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  const [income, setIncome] = useState(10000000);
  const [Incomes, setIncomes] = useState([]);
  const [expense, setExpense] = useState(25000000);
  const [expenses, setExpenses] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [ownerCount, setOwnerCount] = useState(0);
  const [productStats, setProductStats] = useState([]);


    const getIncomes = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/incomes`, {
        method: 'GET'
      });
      if (response.status === 200) {
        const responseData = await response.json();
        setIncomes(responseData)
      }
    } catch (error) {
      alert(error)
    }
  }

  const getSumIncome = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/incomes/sum-income");
      if (response.status === 200) {
        const result = await response.json();
        setIncome(result);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getProductCount = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products/product-count");
      if (response.status === 200) {
        const responseData = await response.json();
        setProductCount(responseData.count);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getOwnerCount = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/owners/getOwner_count");
      if (response.status === 200) {
        const responseData = await response.json();
        setOwnerCount(responseData.count);
      }
    } catch (error) {
      alert(error);
    }
  };

  const getProductStats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products/Typecount");
      if (response.status === 200) {
        const responseData = await response.json();
        setProductStats(responseData);
      }
    } catch (error) {
      alert(error);
    }
  };
  


  useEffect(() => {
    getProductCount();
    getOwnerCount();
    getSumIncome();
    getProductStats();
    getExpense();
    getIncomes();
    sumExpense();

  }, []);

  const pieData = {
    labels: ["ລາຍຮັບ", "ລາຍຈ່າຍ"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#198754", "#dc3545"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: function (context) {
            let value = context.raw;
            return context.label + ": " + value.toLocaleString() + " ກີບ";
          },
        },
      },
    },
    cutout: "70%",
  };

 const barData = {
  labels: productStats.map(p => p.ProductType.productTypeName),
  datasets: [
    {
      label: "ຈຳນວນສິນຄ້າ",
      data: productStats.map(p => p.count),
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#8f2c8dff",
        "#20c997",
        "#fd7e14",
        "#6610f2"
      ], // ສີຫຼາຍໆແບບງາມ
      borderWidth: 1,
      borderColor: "#fff",
      hoverOffset: 10,
      borderRadius: 5, // ເຮັດແບບມຸມມັ້ນເງິນ
    },
  ],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          family: "Noto Sans Lao", // ຕິດຕັ້ງ font ພາສາລາວ
          size: 14,
        },
        color: "#333",
      },
    },
    title: {
      display: true,
      text: "ສະຖິຕິຈຳນວນສິນຄ້າຕາມປະເພດ",
      font: {
        family: "Noto Sans Lao",
        size: 18,
        weight: "bold",
      },
      color: "#555",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.raw.toLocaleString()} ຊັບສິນ`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: { family: "Noto Sans Lao", size: 12 },
        color: "#333",
      },
    },
    y: {
      ticks: {
        font: { family: "Noto Sans Lao", size: 12 },
        color: "#333",
      },
      beginAtZero: true,
    },
  },
};

const saveIncome = async () => {
    Swal.fire({
      title: 'ບັນທຶກລາຍຮັບ',
      width: "80%",
      confirmButtonText: 'ບັນທຶກ',
      showCancelButton: true,
      cancelButtonText: 'ຍົກເລີກ',
      html: `
      <form id="incomeForm" class="text-start">
        <div class="mb-3">
          <label for="amount" class="form-label">ຈຳນວນເງິນ</label>
          <input type="number" id="amount" class="form-control" placeholder="ປ້ອນຈຳນວນເງິນ" required>
        </div>
        <div class="mb-3">
          <label for="reason" class="form-label">ເຫດຜົນ</label>
          <input type="text" id="reason" class="form-control" placeholder="ປ້ອນເຫດຜົນ" required>
        </div>
      </form>
    `,
      preConfirm: () => {
        const amount = document.getElementById("amount").value;
        const reason = document.getElementById("reason").value;

        if (!amount || !reason) {
          Swal.showValidationMessage("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ");
          return false;
        }
        return { amount, reason };
      },
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { amount, reason } = result.value;
        console.log("ຈຳນວນເງິນ:", amount);
        console.log("ເຫດຜົນ:", reason);
        try {
          const response = await fetch(`http://localhost:3000/api/incomes`, {
            method: 'POST',
            body: JSON.stringify({
              incomeAmount: amount,
              incomeReason: reason
            }),
            headers: {
              "Content-Type": "application/json"
            }
          });
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ສຳເລັດ!",
              text: "ບັນທຶກລາຍຮັບແລ້ວ",
              timer: 1500,
              showConfirmButton: false,
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
            getIncomes();
            getSumIncome();
          }
        } catch (error) {
          alert(error);
        }
      }
    });
  };

 const saveExpense = async () => {
    Swal.fire({
      title: 'ບັນທຶກລາຍຈ່າຍ',
      width: "80%",
      confirmButtonText: 'ບັນທຶກ',
      showConfirmButton: false,
      cancelButtonText: 'ຍົກເລີກ',
      html: `
      <form id="expenseForm" class="text-start">
        <div class="mb-3">
          <label for="amount" class="form-label">ຈຳນວນເງິນ</label>
          <input type="number" id="amount" class="form-control" placeholder="ປ້ອນຈຳນວນເງິນ" required>
        </div>
        <div class="mb-3">
          <label for="reason" class="form-label">ເຫດຜົນ</label>
          <input type="text" id="reason" class="form-control" placeholder="ປ້ອນເຫດຜົນ" required>
        </div>
      </form>
    `,
      preConfirm: () => {
        const amount = document.getElementById("amount").value;
        const reason = document.getElementById("reason").value;

        if (!amount || !reason) {
          Swal.showValidationMessage("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ");
          return false;
        }
        return { amount, reason };
      },
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { amount, reason } = result.value;
        console.log("ຈຳນວນເງິນ:", amount);
        console.log("ເຫດຜົນ:", reason);
        try {
          const response = await fetch(`http://localhost:3000/api/expense`, {
            method: 'POST',
            body: JSON.stringify({
              expenseAmount: amount,
              expenseReason: reason
            }),
            headers: {
              "Content-Type": "application/json"
            }
          });
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ສຳເລັດ!",
              text: "ບັນທຶກລາຍຈ່າຍແລ້ວ",
              timer: 1500,
              showConfirmButton: false,
              didOpen: () => {
                document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
            });
            getExpense();
            sumExpense();
          }
        } catch (error) {
          alert(error);
        }
      }
    });
  };
  const sumExpense = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/expense/sum-expense`, {
        method: 'GET'
      });
      if (response.status === 200) {
        const sum = await response.json();
        setExpense(sum);
      }
    } catch (error) {
      alert(error);
    }
  }
  const getExpense = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/expense/`, {
        method: 'GET'
      });
      if (response.status === 200) {
        const results = await response.json();
        setExpenses(results);
      }
    } catch (error) {
      alert(error);
    }
  }

  const PopUpExpenseEdit = (x) => {
    Swal.fire({
      title: 'ແກ້ໄຂຂໍ້ມູນລາຍຈ່າຍ',
      confirmButtonText: 'ປິດຟອມ',
      width: '50%',
      html: `
        <div class="card-body">
          <form id="ExpenseForm" enctype="multipart/form-data">
            <h5 class="text-danger">ຂໍ້ມູນລາຍຈ່າຍ</h5>
            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label">ຈໍານອນເງີນ</label>
                <input type="text" name="Amount" class="form-control" required value="${x.expenseAmount}">
              </div>
              <div class="col-md-4">
                <label class="form-label">ເຫດຜົນ</label>
                <input type="text" name="Reason" class="form-control" required value="${x.expenseReason}">
              </div>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-success btn-update">
                <i class="fa fa-save me-1"></i> ບັນທຶກ
              </button>
            </div>
          </form>
        </div>
      `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
  
        // ຈັບ event submit ຟອມ
        const form = document.getElementById("ExpenseForm");
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
  
          const updatedExpense = {
            expenseAmount: form.Amount.value,
            expenseReason: form.Reason.value,
          };
  
          try {
            const res = await fetch(`http://localhost:3000/api/expense/${x.expenseID}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedExpense),
            });
  
            if (res.ok) {
              Swal.fire({
                icon: "success",
                title: "ສຳເລັດ!",
                text: "ແກ້ໄຂຂໍ້ມູນແລ້ວ",
                timer: 1500,
                showConfirmButton: false,
                didOpen: ()=>{
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                }
              }).then(() => {
                getExpense();
              });
            } else {
              Swal.fire("Error", "ບໍ່ສາມາດແກ້ໄຂໄດ້", "error");
            }
          } catch (err) {
            Swal.fire("Error", "ມີຂໍ້ຜິດພາດ!", "error");
            alert(err);
          }
        });
      },
    });
  };

  const deleteExpense = async (expenseID) => {
          Swal.fire({
              title: 'ຢືນຢັນການລົບ?',
              text: "ເຈົ້າຕ້ອງການລົບຂໍ້ມູນນີ້ຫຼືບໍ?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'ຕົກລົງ',
              cancelButtonText: 'ຍົກເລີກ',
              didOpen: () => {
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      const response = await fetch(`http://localhost:3000/api/expense/${expenseID}`, {
                          method: "DELETE"
                      });
                      if (response.status === 200) {
                          getExpense();
                          Swal.fire({
                              title: 'ລົບສຳເລັດ',
                              icon: 'success',
                              text: 'ລົບຂໍ້ມູນລາຍຈ່າຍສຳເລັດ',
                              confirmButtonText: 'ຕົກລົງ',
                              didOpen: () => {
                                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                              }
                          });
                      }
                  } catch (error) {
                      Swal.fire({
                          title: 'ມີຂໍ້ຜິດພາດ',
                          icon: 'error',
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

   const PopUpIncomeEdit = (x) => {
    Swal.fire({
      title: 'ແກ້ໄຂຂໍ້ມູນລາຍຮັບ',
      confirmButtonText: 'ປິດຟອມ',
      width: '50%',
      html: `
        <div class="card-body">
          <form id="IncomeForm" enctype="multipart/form-data">
            <h5 class="text-danger">ຂໍ້ມູນລາຍຮັບ</h5>
            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label">ຈໍານອນເງີນ</label>
                <input type="text" name="Amount" id="Amount" class="form-control" required value="${x.incomeAmount}">
              </div>
              <div class="col-md-4">
                <label class="form-label">ເຫດຜົນ</label>
                <input type="text" name="Reason" id="Reason" class="form-control" required value="${x.incomeReason}">
              </div>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-success btn-update">
                <i class="fa fa-save me-1"></i> ບັນທຶກ
              </button>
            </div>
          </form>
        </div>
      `,
      didOpen: () => {
        document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
  
        // ຈັບ event submit ຟອມ
        const form = document.getElementById("IncomeForm");
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
  
          const updatedIncome = {
            incomeAmount: document.getElementById("Amount").value,
            incomeReason: document.getElementById("Reason").value,
          };
  
          try {
            const res = await fetch(`http://localhost:3000/api/incomes/${x.incomeID}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedIncome),
            });
  
            if (res.ok) {
              Swal.fire({
                icon: "success",
                title: "ສຳເລັດ!",
                text: "ແກ້ໄຂຂໍ້ມູນແລ້ວ",
                timer: 1500,
                showConfirmButton: false,
                didOpen: ()=>{
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                }
              }).then(() => {
                getIncomes();
              });
            } else {
              Swal.fire("Error", "ບໍ່ສາມາດແກ້ໄຂໄດ້", "error");
            }
          } catch (err) {
            Swal.fire("Error", "ມີຂໍ້ຜິດພາດ!", "error");
            alert(err);
            console.error(err)
          }
        });
      },
    });
  };

  const deleteIncome = async (incomeID) => {
          Swal.fire({
              title: 'ຢືນຢັນການລົບ?',
              text: "ເຈົ້າຕ້ອງການລົບຂໍ້ມູນນີ້ຫຼືບໍ?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'ຕົກລົງ',
              cancelButtonText: 'ຍົກເລີກ',
              didOpen: () => {
                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
              }
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      const response = await fetch(`http://localhost:3000/api/incomes/${incomeID}`, {
                          method: "DELETE"
                      });
                      if (response.status === 200) {
                          getIncomes();
                          Swal.fire({
                              title: 'ລົບສຳເລັດ',
                              icon: 'success',
                              text: 'ລົບຂໍ້ມູນລາຍຮັບສຳເລັດ',
                              confirmButtonText: 'ຕົກລົງ',
                              didOpen: () => {
                                  document.querySelector('.swal2-popup').style.fontFamily = "'Noto Sans Lao', sans-serif";
                              }
                          });
                      }
                  } catch (error) {
                      Swal.fire({
                          title: 'ມີຂໍ້ຜິດພາດ',
                          icon: 'error',
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
    <div className="d-flex" style={{ fontFamily: 'Noto Sans Lao' }}>
      <Sidebar show={showSidebar} handleClose={closeSidebar} />
      <div className="flex-grow-1">
        <Header toggleSidebar={toggleSidebar} />
        <Container fluid className="py-3">

          {/* Header */}
          <Card className="shadow-lg mb-4">
            <Card.Header className="bg-danger text-center text-white fw-bold">
              <h4 className="mt-2">
                <ReactTyped
                  strings={["ຍິນດີຕ້ອນຮັບເຂົ້າສູ່", "ລະບົບຈັດການ Star Home"]}
                  typeSpeed={60}
                  backSpeed={30}
                  loop
                />
              </h4>
            </Card.Header>
          </Card>

          {/* Statistic Cards */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={6} md={3}>
              <Card className="shadow-lg bg-primary text-white text-center">
                <Card.Body>
                  <h5>ຊັບສິນທັງໝົດ</h5>
                  <h3 className="fw-bold">{productCount}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="shadow-lg text-white text-center" style={{ backgroundColor: "#8f2c8dff" }}>
                <Card.Body>
                  <h5>ເຈົ້າຂອງຊັບສິນ</h5>
                  <h3 className="fw-bold">{ownerCount}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="shadow-lg bg-success text-white text-center">
                <Card.Body>
                  <h5>ລາຍຮັບ</h5>
                  <h3 className="fw-bold">{income.toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={3}>
              <Card className="shadow-lg bg-danger text-white text-center">
                <Card.Body>
                  <h5>ລາຍຈ່າຍ</h5>
                  <h3 className="fw-bold">{expense.toLocaleString()}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3">
            {/* Pie Chart */}
            <Col xs={12} md={6}>
              <Card className="shadow-lg h-100">
                <Card.Body>
                  <Card.Title className="text-center mb-3">ສະຖິຕິລາຍຮັບ - ລາຍຈ່າຍ</Card.Title>
                  <div className="d-flex justify-content-center">
                    <div style={{ maxWidth: "260px", width: "100%" }}>
                      <Pie data={pieData} options={pieOptions} />
                    </div>
                  </div>
                  <h5 className="text-center mt-4 text-primary fw-bold">
                    ລາຍໄດ້ສຸດທິ: <span className="text-dark">{(income - expense).toLocaleString()}</span>
                  </h5>
                </Card.Body>
                <Card.Footer className="text-center">
                  <FormGroup>
                    <Button variant="success" className="me-2" onClick={saveIncome}>ບັນທຶກລາຍຮັບ</Button>
                    <Button variant="danger" className="me-2" onClick={saveExpense}>ບັນທຶກລາຍຈ່າຍ</Button>
                  </FormGroup>
                </Card.Footer>
              </Card>
            </Col>

            {/* Bar Chart */}
            <Col xs={12} md={6}>
              <Card className="shadow-lg h-100">
                <Card.Body>
                  <Bar data={barData} options={barOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className='shadow-lg'>
            <Row style={{ margin: '10px 10px' }}>
              <Col md={6}>
                <h5 className="text-center fw-bold mb-3 mt-3">ຕາຕະລາງລາຍຮັບ</h5>
                <Container>
                  <div className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table className='table table-striped table-bordered'>
                      <thead className='table-dark' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                          <td>ຈຳນວນເງິນ</td>
                          <td>ເຫດຜົນ</td>
                          <td>ແກ້ໄຂແລະລືບ</td>
                        </tr>
                      </thead>
                      <tbody>
                        {Incomes.map((x) => (
                          <tr key={x.incomeID}>
                            <td>{(x.incomeAmount).toLocaleString()}</td>
                            <td>{x.incomeReason}</td>
                            <td>
                              <Button variant="btn btn-warning" size="sm" onClick={()=> PopUpIncomeEdit(x)}>&nbsp;<i className="fas fa-edit"></i></Button>
                              &nbsp;&nbsp;<Button variant="btn btn-danger" size="sm" onClick={()=> deleteIncome(x.incomeID)}><i className="fas fa-trash"></i>&nbsp;ລືບ</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Container>
              </Col>
              <Col md={6}>
                <h5 className="text-center fw-bold mb-3 mt-3">ຕາຕະລາງລາຍຈ່າຍ</h5>
                <Container>
                  <div className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table className='table table-striped table-bordered' style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                      <thead className='table-dark'>
                        <tr>
                          <td>ຈຳນວນເງິນ</td>
                          <td>ເຫດຜົນ</td>
                          <td>ແກ້ໄຂແລະລືບ</td>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((x) => (
                          <tr key={x.expenseID}>
                            <td>{(x.expenseAmount).toLocaleString()}</td>
                            <td>{x.expenseReason}</td>
                            <td>
                              <Button variant="btn btn-warning" size="sm" onClick={()=> PopUpExpenseEdit(x)}>&nbsp;<i className="fas fa-edit"></i></Button>
                              &nbsp;&nbsp;<Button variant="btn btn-danger" size="sm" onClick={()=> deleteExpense(x.expenseID)}><i className="fas fa-trash"></i>&nbsp;ລືບ</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Container>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;