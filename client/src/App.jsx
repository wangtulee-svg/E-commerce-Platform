import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import { ReactTyped } from 'react-typed';
const App = () => {
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State for displaying messages (errors/success)
  const [messageColor, setMessageColor] = useState("text-danger"); // State for message color

  const LoginUser = async () => {
    // Clear previous messages
    setMessage("");
    setMessageColor("text-danger");

    if (!tel || !password) {
      setMessage("ກະລຸນາປ້ອນໃຫ້ຄົບ");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tel,
          password
        })
      });

      const responseData = await response.json();

      if (response.status === 200) {
        setMessage(responseData.message || "ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ!");
        setMessageColor("text-success");
        window.location.href = "/dashboard";

      } else if (response.status === 401) {
        setMessage(responseData.message || "ເບີໂທລະສັບ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ.");
        setMessageColor("text-danger");
      } else {
        setMessage("ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ. ກະລຸນາລອງໃໝ່.");
        setMessageColor("text-danger");
      }
    } catch (error) {
      setMessage("ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້. ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ອິນເຕີເນັດຂອງທ່ານ.");
      setMessageColor("text-danger");
      console.error("Login error:", error);
    }
  };
 

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Noto Sans Lao, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Top 50% section with gradient and SVG curve */}
      <div style={{
        height: '45vh',
        minHeight: 420,
        backgroundImage: `
    linear-gradient(120deg, rgba(91, 5, 26, 0.7) 0%, rgba(255,0,0,0.7) 100%), url('https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/v1620075511/Best-Tourist-Attractions-Laos-to-See-Pha-That-Luang/Best-Tourist-Attractions-Laos-to-See-Pha-That-Luang.jpg')
  `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingBottom: '50px',
      }}>
        {/* Placeholder for content in the top section if any */}
        <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 'bold', zIndex: 3 }}>
          <ReactTyped
            strings={[
              'ຍິນດີຕ້ອນຮັບ',
              'ເຂົ້າສູ່ລະບົບຈັດການ Star Home'
            ]}
            typeSpeed={60}
            backSpeed={30}
            loop
          />
        </h1>
        {/* SVG curve divider */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 250" /* Adjusted viewBox height for a more pronounced curve */
          style={{
            position: 'absolute',
            bottom: -1, // Adjust to cover the gap
            left: 0,
            width: '100%',
            height: 'auto', // Keep aspect ratio
            zIndex: 1,
            display: 'block',
          }}
        >
          <path
            fill="#fff" // Color of the bottom section
            fillOpacity="1"
            /* Modified SVG path for a smoother, more aesthetic curve */
            d="M0,192C360,255,1080,128,1440,192L1440,250L0,250Z"
          ></path>
        </svg>
      </div>

      {/* Bottom 50% section, white background, center form */}
      <div style={{
        flexGrow: 1, // Allows this section to take remaining height
        background: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column', // Changed to column for footer
        alignItems: 'center',
        justifyContent: 'flex-start', // Align items to the top initially
        zIndex: 2,
        paddingTop: '10px', // Add padding to push content down from the curve
      }}>
        <Card className="shadow-lg border border-4" style={{
          width: 400,

          maxWidth: '90%', // Ensure responsiveness on smaller screens
          borderRadius: 50,
          /* Softened box-shadow for a more aesthetic look */
          boxShadow: '50px 10px 40px rgba(104, 11, 11, 0.9)',
          border: 'none',
          padding: '32px 28px 24px 28px',
          background: '#fff',
          marginTop: -180, // Move card higher up (adjust based on SVG curve)
          zIndex: 4,
        }}>
          <Card.Body>
            <div style={{ fontWeight: 700, color: '#222', fontSize: 28, marginBottom: 8, textAlign: 'center', fontFamily: 'Noto Sans Lao, sans-serif' }}>Star Home</div>
            <Form>
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label style={{ color: '#d11534ff', fontWeight: 600 }}>ເບີໂທລະສັບ*</Form.Label>
                <Form.Control
                  id="tel"
                  type="number"
                  placeholder="020XXXXXXXX"
                  style={{ borderRadius: 10, borderColor: '#d11534ff' }}
                  value={tel}
                  onChange={e => setTel(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label style={{ color: '#d11534ff', fontWeight: 600 }}>ລະຫັດຜ່ານ*</Form.Label>
                <Form.Control
                  id="pass"
                  type="password"
                  placeholder=""
                  style={{ borderRadius: 10, borderColor: '#d11534ff' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label={<span style={{ fontSize: '0.95rem', color: '#888' }}>ຈົດຈຳຂ້ອຍ</span>} id="rememberMe" />
                <a href="#" style={{ color: '#d11534ff', fontSize: '0.95rem', textDecoration: 'none' }}>ລືມລະຫັດຜ່ານ</a>
              </div>
              <Button
                className="mb-2"
                onClick={LoginUser}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #d11534ff 0%, #9a0a11ff 100%)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 18,
                  marginTop: 15
                }}
              >
                ເຂົ້າສູ່ລະບົບ
              </Button>
              <p className="text-center">
                <span id="showError" className={messageColor}>
                  {message}
                </span>
              </p>
            </Form>
          </Card.Body>
        </Card>
        {/* Stylish Footer */}
        <footer style={{
          minHeight: '20vh',
          marginTop: 'auto', // Pushes footer to the bottom
          width: '100%',
          textAlign: 'center',
          padding: '20px 0',
          background: '#f8f8f8', // Light grey background for the footer
          color: '#666',
          fontSize: '0.9rem',
          borderTop: '1px solid #eee', // Subtle border at the top
        }}>
          <p>&copy; 2025 Star Home. All rights reserved.</p>
          <p>ອອກແບບດ້ວຍຄວາມຮັກໃນປະເທດລາວ</p> {/* Designed with love in Laos */}
        </footer>
      </div>
    </div>
  );
}


export default App;