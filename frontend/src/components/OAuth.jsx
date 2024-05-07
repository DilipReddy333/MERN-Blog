import { Alert, Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

const OAuth = () => {
  const handleGoogleSignIn = () => {
    alert("Firebase Google authentication");
  };
  return (
    <Button
      type='button'
      onClick={handleGoogleSignIn}
      gradientDuoTone={"pinkToOrange"}
      outline
    >
      <AiFillGoogleCircle className='w-6 h-6 mr-2' /> Continue with Google
    </Button>
  );
};

export default OAuth;
