// app/page.jsx
import Image from 'next/image'; // Import Image from next/image
import SignInForm from '@/app/components/SignInForm';
import logo from '../../public/espana logo.png'; // Import your logo

const Homepage = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* Logo Container */}
      <div className="flex justify-center items-center h-1/4"> {/* Set height to one-third */}
        <Image 
          src={logo} 
          alt="Logo" 
          width={200} // Set the width as per your design
// Set the height as per your design
        />
      </div>
      {/* Render the SignInForm component below the logo */}
      <div className="flex flex-grow justify-center items-center"> {/* Center the form vertically */}
        <SignInForm />
      </div>
    </div>
  );
}

export default Homepage;
