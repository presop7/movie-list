import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Alert, { AlertType } from "../../components/MUIComponents/Alert";
import Button from "../../components/MUIComponents/Button";
import { Form, Formik } from "formik";
import { object, ref, string } from "yup";
import theme from "../../theme";

const fieldValidation = object({
  email: string().email("Email is not valid").required("Email is required"),
  password: string()
    .min(6, "Password should be atleast 6")
    .required("Password is required"),
  confirmPassword: string().oneOf(
    [ref("password")],
    "Passwords does not match"
  ),
});

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const styles = {
  submutButton: {
    textAlign: "center",
    px: "2rem",
    py: "0.5rem",
    bgcolor: theme.palette.info.main,
    margin: "1rem",
  },
};

const Register = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType>({
    message: "",
    severity: "error",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: RegisterFormValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleFormSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      ).then((user) => {
        navigate("/auth/login");
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setShowAlert(true);
      setAlert({
        message: (error as Error).message,
        severity: "error",
      });
    }
  };

  return (
    <Stack
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Paper sx={{ width: "100%", maxWidth: "600px", padding: 4 }}>
        <Stack justifyContent="center" alignItems="center" gap={2} mb={2}>
          <Typography component="h1" variant="h1">
            Medialist
          </Typography>

          <Typography component="h2" variant="h3">
            Register
          </Typography>
        </Stack>

        {!loading ? (
          <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={fieldValidation}
            enableReinitialize
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              touched,
              errors,
              values,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Stack spacing={2} alignItems="center">
                  <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    error={
                      (touched["email"] || !!errors["email"]) &&
                      !!errors["email"]
                    }
                    helperText={
                      (touched["email"] || !!errors["email"]) && errors["email"]
                    }
                  />

                  <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    error={
                      (touched["password"] || !!errors["password"]) &&
                      !!errors["password"]
                    }
                    helperText={
                      (touched["password"] || !!errors["password"]) &&
                      errors["password"]
                    }
                  />

                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      (touched["confirmPassword"] ||
                        !!errors["confirmPassword"]) &&
                      !!errors["confirmPassword"]
                    }
                    helperText={
                      (touched["confirmPassword"] ||
                        !!errors["confirmPassword"]) &&
                      errors["confirmPassword"]
                    }
                  />

                  <Alert
                    severity={alert.severity}
                    text={alert.message}
                    showError={showAlert}
                    setShowError={setShowAlert}
                  />
                  <Box>
                    <Button
                      label="Register"
                      isSubmit
                      sx={styles.submutButton}
                    />
                  </Box>
                  <Stack
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <Box>
                      <Typography component="span" variant="body2">
                        Already have an account?{" "}
                      </Typography>
                      <Link href="/auth/login">Login</Link>
                    </Box>

                    <Box>
                      <Link href="/">
                        <Typography
                          component="p"
                          variant="body2"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          Just want to checkout? Click to go to homepage.
                        </Typography>
                      </Link>
                    </Box>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        ) : (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            my={6}
          >
            <CircularProgress />
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default Register;
