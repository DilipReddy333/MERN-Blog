import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../store/userSlice";
import { FaUsers } from "react-icons/fa6";

const DashSidebar = () => {
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const tab = searchParams.get("tab");
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={user.isAdmin ? "Admin" : "User"}
              labelColor='dark'
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {user.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as={"div"}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {user.isAdmin && (
            <Link to='/dashboard?tab=allusers'>
              <Sidebar.Item
                active={tab === "allusers"}
                icon={FaUsers}
                as={"div"}
              >
                All Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            onClick={() => dispatch(signOutUser())}
            className='cursor-pointer'
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
