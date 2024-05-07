import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { signOutUser } from "../store/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const { user } = useSelector((state) => state.userReducer);
  const { theme } = useSelector((state) => state.themeReducer);
  // console.log(theme);
  const dispatch = useDispatch();
  // console.log(user);
  return (
    <Navbar className='border-b-2'>
      <Link
        to={"/"}
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-700 via-purple-400 rounded-lg text-gray-100 dark:text-white'>
          Dilip's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden rounded-full' color={"gray"}>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline rounded-full bg-gray-100'
          color={"gray"}
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        {user ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt='user avatar' img={user.photoUrl} rounded />}
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{user.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {user.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => dispatch(signOutUser())}>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Link to={"/sign-in"}>
            <Button
              gradientDuoTone={"purpleToBlue"}
              outline
              className='dark:text-white'
            >
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
