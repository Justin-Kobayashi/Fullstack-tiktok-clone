import React from 'react';
import { useMutation } from '@apollo/client';
import { useUserStore } from '../stores/userStore';
import { GraphQLErrorExtensions } from 'graphql';
import { useGeneralStore } from '../stores/generalStore';
import { LoginUserMutation } from '../gql/graphql';
import Input from './Input';
import { LOGIN_USER } from '../graphql/mutations/Login';

function Login() {
  const [loginUser, { loading, error, data }] =
    useMutation<LoginUserMutation>(LOGIN_USER);

  const setUser = useUserStore((state) => state.setUser);
  const setIsLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});
  const [invalidCredentials, setInvalidCredentials] = React.useState('');

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    setErrors({});
    try {
      const response = await loginUser({
        variables: {
          email: loginData.email,
          password: loginData.password,
        },
      });

      response && response.data && setUser(response.data.login.user);
      setIsLoginOpen(false);
    } catch (_) {
      if (error && error.graphQLErrors[0].extensions?.invalidCredentials) {
        setInvalidCredentials(
          error.graphQLErrors[0].extensions?.invalidCredentials as string,
        );
      } else if (error) setErrors(error.graphQLErrors[0].extensions);
    }
  };

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Login</div>
      <div className="px-6 pb-2">
        <Input
          max={64}
          placeHolder="Email"
          inputType="text"
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          autoFocus={false}
          error={errors?.email as string}
        />
      </div>
      <div className="px-6 pb-2">
        <Input
          max={64}
          placeHolder="Password"
          inputType="password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          autoFocus={false}
          error={errors?.password as string}
        />
      </div>

      <div className="px-6">
        <span className="text-red-500 text-[14px] font-semibold">
          {invalidCredentials}
        </span>
        <button
          onClick={handleLogin}
          disabled={!loginData.email || !loginData.password}
          className={[
            'mt-6 w-full text-[17px] font-semibold text-white py-3 rounded-sm',
            !loginData.email || !loginData.password
              ? 'bg-gray-200'
              : 'bg-[#F02C56]',
          ].join(' ')}
        >
          Login
        </button>
      </div>
    </>
  );
}

export default Login;
