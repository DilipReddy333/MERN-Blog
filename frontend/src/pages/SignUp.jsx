import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputChangeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value.trim() });
  };
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log(formValues);
    try {
      setError("");
      setLoading(true);
      const resp = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await resp.json();
      console.log(data);
      if (data.error) {
        setLoading(false);
        return setError(data.error);
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='max-h-screen mt-10 flex items-center justify-center flex-wrap p-4'>
      {/* left side */}
      <div className='p-3 flex-col md:flex-row'>
        <Link to={"/"} className='text-4xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-700 via-purple-400 rounded-lg text-gray-100 dark:text-white'>
            Dilip's
          </span>
          Blog
        </Link>
        <p className='text-sm mt-5'>
          This is a sample mern blog application, where you can add your own
          blogs
        </p>
      </div>
      {/* right side */}
      <div className='p-3 flex-col md:flex-row md:w-1/4 w-auto'>
        <form className='flex flex-col gap-4' onSubmit={formSubmitHandler}>
          <div>
            <Label value='Your username' />
            <TextInput
              type='text'
              name='username'
              placeholder='Username'
              id='username'
              value={formValues.username}
              onChange={inputChangeHandler}
              required
            />
          </div>
          <div>
            <Label value='Your email' />
            <TextInput
              type='email'
              name='email'
              placeholder='Email'
              value={formValues.email}
              onChange={inputChangeHandler}
              id='email'
              required
            />
          </div>
          <div>
            <Label value='Password' />
            <TextInput
              type='password'
              name='password'
              placeholder='Password'
              value={formValues.password}
              onChange={inputChangeHandler}
              id='password'
              required
            />
          </div>
          <Button
            className='block w-full'
            gradientDuoTone='purpleToPink'
            type='submit'
            outline
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size={"sm"} />
                <span className='pt-3'>Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <OAuth />
        </form>
        <p className='text-base font-semibold mt-3'>
          Already have an account?{" "}
          <Link to={"/sign-in"} className='text-purple-600'>
            Sign in
          </Link>
        </p>
        <div>
          {error && (
            <Alert color={"failure"}>
              <span>{error}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
