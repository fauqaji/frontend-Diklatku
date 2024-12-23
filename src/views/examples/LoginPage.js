import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import ExamplesNavbar from "../../components/Navbars/ExamplesNavbar.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstFocus, setFirstFocus] = useState(false);
  const [lastFocus, setLastFocus] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mengirim permintaan login
      const response = await axios.post(
        "/api/auth/login",
        { email, password }
      );

      if (response.data && response.data.status === "success") {
        const { token, username, email } = response.data.data;

        // Simpan token di localStorage
        localStorage.setItem("token", token);

        // Simpan data pengguna di localStorage jika diperlukan
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        toast.success("Login berhasil!");

        // Redirect ke dashboard setelah login sukses
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(response.data.message || "Login gagal.");
      }
    } catch (error) {
      let errorMessage = "Login gagal";
      if (error.response) {
        if (error.response.status === 429) {
          // Jika status 429, tampilkan pesan warning
          toast.warning("Terlalu banyak percobaan login. Coba lagi nanti.");
        } else {
          errorMessage = error.response.data.message || "Kesalahan server";
        }
      } else if (error.request) {
        errorMessage = "Tidak ada respons dari server";
      } else {
        errorMessage = error.message || "Kesalahan jaringan";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <ExamplesNavbar />
      <ToastContainer />
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../../assets/img/bg-balaikota.jpg") + ")",
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form onSubmit={handleLogin} className="form">
                  <CardHeader className="text-center">
                    <div className="logo-container">
                      <img
                        alt="..."
                        src={require("../../assets/img/logo-pemkot.png")}
                      ></img>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (firstFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupText
                        addontype="prepend"
                        className="input-group-text-centered"
                      >
                        <i className="fas fa-envelope mr-3"></i>
                      </InputGroupText>
                      <Input
                        placeholder="Email..."
                        type="email"
                        name="email-unique"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                        autoComplete="off"
                      />
                    </InputGroup>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (lastFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupText
                        addontype="prepend"
                        className="input-group-text-centered"
                      >
                        <i className="fas fa-lock mr-3"></i>
                      </InputGroupText>
                      <Input
                        placeholder="Password..."
                        type="password"
                        name="password-unique"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setLastFocus(true)}
                        onBlur={() => setLastFocus(false)}
                        autoComplete="off"
                      />
                    </InputGroup>
                  </CardBody>

                  <CardFooter className="text-center">
                    <Button
                      block
                      className="btn-round"
                      color="danger"
                      type="submit"
                      size="lg"
                    >
                      Login
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
