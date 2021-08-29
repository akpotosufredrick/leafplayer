import { ButtonPrimary, ButtonText } from 'components/form/Button/Button';
import Checkbox from 'components/form/Checkbox/Checkbox';
import FormCard from 'components/form/FormCard/FormCard';
import Input from 'components/form/Input/Input';
import { useFormik } from 'formik';
import { AuthRequestDto, AuthResponseDto } from 'leafplayer-common';
import { isApiError, makeApiPostRequest } from 'modules/api';
import { AuthContext } from 'modules/auth';
import React, { ReactElement, useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

function Login({ history }: RouteComponentProps): ReactElement {
  const authContext = useContext(AuthContext);

  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      stayLoggedIn: true,
    },

    validate: values => {
      const errors: { [key: string]: string } = {};

      if (!values.username) {
        errors.username = 'Required';
      }

      if (!values.password) {
        errors.password = 'Required';
      }

      return errors;
    },

    onSubmit: async values => {
      setError('');

      const result = await makeApiPostRequest<AuthResponseDto, AuthRequestDto>(
        'auth/login',
        values,
      );

      if (isApiError(result)) {
        setError(result.error);
      } else {
        authContext.storeUser(result.user);
        authContext.storeArtworkToken(result.artworkToken);
        history.replace('/');
      }
    },
  });

  function renderActions(): ReactElement {
    return (
      <>
        <ButtonPrimary type="submit">Login</ButtonPrimary>

        <ButtonText to="/register">Create Account</ButtonText>
      </>
    );
  }

  return (
    <>
      <FormCard
        error={error}
        onCloseError={() => setError('')}
        actions={renderActions()}
        onSubmit={formik.handleSubmit}
      >
        <Input
          type="text"
          label="Username"
          name="username"
          autoComplete="username"
          value={formik.values.username}
          onBlur={formik.handleBlur}
          onInput={formik.handleChange}
          error={formik.touched.username && formik.errors.username}
        />

        <Input
          type="password"
          label="Password"
          name="password"
          value={formik.values.password}
          onBlur={formik.handleBlur}
          onInput={formik.handleChange}
          error={formik.touched.password && formik.errors.password}
        />

        <Checkbox
          name="stayLoggedIn"
          checked={formik.values.stayLoggedIn}
          onChange={formik.handleChange}
        >
          Stay logged in
        </Checkbox>
      </FormCard>
    </>
  );
}

export default Login;
