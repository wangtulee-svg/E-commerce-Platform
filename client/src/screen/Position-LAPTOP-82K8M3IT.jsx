import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/header";
import { Row, Card, Container, Button, FormGroup, FormControl } from "react-bootstrap";
import Swal from "sweetalert2";

const Position = () => {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);
  const [Position, setPosition] = useState("");
  // Load positions from API
  const loadPositions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/positions/");
      if (res.ok) {
        const data = await res.json();
        setPositions(data);
      } else {
        console.error("Failed to fetch positions");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredPositions = positions.filter((pos) =>
    (pos.PositionName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deletePosition = async (id) => {
    const result = await Swal.fire({
      title: "ຢືນຢັນການລຶບ?",
      text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະລຶບຂໍ້ມູນນີ້?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/positions/${id}`, {
          method: "DELETE",
        });

        if (res.status === 200) {
          Swal.fire("ສຳເລັດ!", "ລຶບຂໍ້ມູນແລ້ວ", "success");
          loadPositions(); // Refresh data
        } else {
          Swal.fire("ຜິດພາດ!", "ບໍ່ສາມາດລຶບໄດ້", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("ເກີດຂໍ້ຜິດພາດ", err.message || "Unknown error", "error");
      }
    }
  };


  const SavePosition = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/positions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positionName: Position }),
      });
      if (res.status === 201) {
        Swal.fire("ສຳເລັດ!", "ບັນທຶກຂໍ້ມູນແລ້ວ", "success");
        setPosition("");
        loadPositions();
      }

    } catch (err) {
      console.error(err);
      alert(err);
    }
  }
  // Update position
  const PopUpUpdate = async (pos) => {
    await Swal.fire({
      title: "ແກ້ໄຂຕຳແໜ່ງ",
      showCloseButton: true,
      html: `
      <input id="custom-position-name" class="form-control mb-3" style="font-size:18px; padding:10px;" value="${pos.positionName}" />
      <button id="custom-save-btn" class="btn btn-success w-100">ບັນທຶກ</button>
    `,
      showConfirmButton: false, // ❌ Don't show default button
      didOpen: () => {
        document.getElementById("custom-save-btn").addEventListener("click", async () => {
          const x = document.getElementById("custom-position-name").value;

          if (!x.trim()) {
            Swal.showValidationMessage("ກະລຸນາປ້ອນຊື່");
            return;
          }

          try {
            const res = await fetch(`http://localhost:3000/api/positions/${pos.positionID}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ positionName: x }),
            });

            if (res.status === 200) {
              await Swal.fire("ສຳເລັດ!", "ແກ້ໄຂຂໍ້ມູນແລ້ວ", "success");
              loadPositions();
            } else {
              Swal.fire("ຜິດພາດ!", "ບັນທຶກບໍ່ສຳເລັດ", "error");
            }
          } catch (err) {
            console.error("Fetch error:", err);
            Swal.fire("ຜິດພາດ!", "ບັນທຶກບໍ່ສຳເລັດ", "error");
          }
        });
      }
    });
  };




  return (
    <div className="d-flex" style={{ fontFamily: "Noto Sans Lao" }}>
      <Sidebar show={showSidebar} handleClose={closeSidebar} />
      <div className="flex-grow-1 w-100">
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-3">
          <Row className="mb-3">
            <Card className="p-3 shadow-lg rounded-3">
              <Card.Body>
                <h3 className="text-center fw-bold text-danger">ຈັດການຕຳແໜ່ງ</h3>
                <FormGroup>
                  <Container>
                    <div className="input-group mb-3">
                      <span className="input-group-text"><i className="fas fa-search" /></span>
                      <FormControl placeholder="ຄົ້ນຫາ" onChange={handleSearch} />
                    </div>
                    <div className="mb-3">
                      <FormControl id="positionName"
                        placeholder="ປ້ອນຊື່ຕຳແໜ່ງ"
                        value={Position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>
                    <div className="text-start">
                      <Button className="btn btn-success" onClick={SavePosition}>
                        <i className="fas fa-save me-1" /> ບັນທຶກ
                      </Button>
                    </div>
                  </Container>
                </FormGroup>
              </Card.Body>
            </Card>
          </Row>

          <Card>
            <table className="table table-striped text-center" style={{ tableLayout: "fixed", width: "100%" }}>
              <thead>
                <tr>
                  <th>ລະຫັດ</th>
                  <th>ຊື່ຕຳແໜ່ງ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center py-3">Loading...</td></tr>
                ) : filteredPositions.length > 0 ? (
                  filteredPositions.map((x) => (
                    <tr key={x.PositionID}>
                      <td>{x.positionID}</td>
                      <td>{x.positionName}</td>
                      <td>
                        <div className="d-inline-flex">
                          <button className="btn btn-warning btn-sm me-1" onClick={() => PopUpUpdate(x)}>
                            <i className="fas fa-edit me-1"></i> ແກ້ໄຂ
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deletePosition(x.positionID)}
                          >
                            <i className="fas fa-trash-alt me-1"></i> ລຶບ
                          </button>


                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-3">
                      <i className="fas fa-exclamation-circle me-2"></i> ບໍ່ພົບຂໍ້ມູນ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default Position;