// import React from "react";
// import { Link } from "react-router-dom";
// // reactstrap components
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   CardTitle,
//   Form,
//   Input,
//   InputGroupText,
//   InputGroup,
//   Container,
//   Row,
// } from "reactstrap";

// // core components

// function SignUp() {
//   const [firstFocus, setFirstFocus] = React.useState(false);
//   const [lastFocus, setLastFocus] = React.useState(false);
//   const [emailFocus, setEmailFocus] = React.useState(false);
//   return (
//     <>
//       <div
//         className="section section-signup"
//         style={{
//           backgroundImage:
//             "url(" + require("../../assets/img/bg-balaikota.jpg") + ")",
//           backgroundSize: "cover",
//           backgroundPosition: "top center",
//           minHeight: "700px",
//         }}
//       >
//         <Container>
//           <Row>
//             <Card className="card-signup" data-background-color="blue">
//               <Form action="" className="form" method="">
//                 <CardHeader className="text-center">
//                   <CardTitle className="title-up" tag="h3">
//                     Sign Up
//                   </CardTitle>
//                 </CardHeader>
//                 <CardBody>
//                   <InputGroup
//                     className={
//                       "no-border" + (firstFocus ? " input-group-focus" : "")
//                     }
//                   >
//                     <InputGroupText addonType="prepend">
//                       <InputGroupText>
//                         <i className="now-ui-icons users_circle-08"></i>
//                       </InputGroupText>
//                     </InputGroupText>
//                     <Input
//                       placeholder="First Name..."
//                       type="text"
//                       onFocus={() => setFirstFocus(true)}
//                       onBlur={() => setFirstFocus(false)}
//                     ></Input>
//                   </InputGroup>
//                   <InputGroup
//                     className={
//                       "no-border" + (lastFocus ? " input-group-focus" : "")
//                     }
//                   >
//                     <InputGroupText addonType="prepend">
//                       <InputGroupText>
//                         <i className="now-ui-icons text_caps-small"></i>
//                       </InputGroupText>
//                     </InputGroupText>
//                     <Input
//                       placeholder="Last Name..."
//                       type="text"
//                       onFocus={() => setLastFocus(true)}
//                       onBlur={() => setLastFocus(false)}
//                     ></Input>
//                   </InputGroup>
//                   <InputGroup
//                     className={
//                       "no-border" + (emailFocus ? " input-group-focus" : "")
//                     }
//                   >
//                     <InputGroupText addonType="prepend">
//                       <InputGroupText>
//                         <i className="now-ui-icons ui-1_email-85"></i>
//                       </InputGroupText>
//                     </InputGroupText>
//                     <Input
//                       placeholder="Email..."
//                       type="text"
//                       onFocus={() => setEmailFocus(true)}
//                       onBlur={() => setEmailFocus(false)}
//                     ></Input>
//                   </InputGroup>
//                 </CardBody>
//                 <CardFooter className="text-center">
//                   <Button
//                     className="btn-neutral btn-round"
//                     color="info"
//                     href="#pablo"
//                     onClick={(e) => e.preventDefault()}
//                     size="lg"
//                   >
//                     Get Started
//                   </Button>
//                 </CardFooter>
//               </Form>
//             </Card>
//           </Row>
//           <div className="col text-center">
//             <Button
//               className="btn-round btn-white"
//               color="default"
//               to="/login-page"
//               outline
//               size="lg"
//               tag={Link}
//             >
//               Login Page
//             </Button>
//           </div>
//         </Container>
//       </div>
//     </>
//   );
// }

// export default SignUp;
