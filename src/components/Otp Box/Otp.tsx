import { useState } from 'react';
import OtpInput from 'react-otp-input';

export default function App() {
  const [otp, setOtp] = useState('');

  return (
    <OtpInput
      value={otp}
      onChange={setOtp}
      numInputs={4}
      renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
      inputStyle={{
        width: '50px', 
        height: '50px', 
        margin: '10px', 
        borderRadius: '5px', 
        border: '1px solid #ccc', 
        textAlign: 'center', 
        fontSize: '18px', 
        color: 'black',
      }}/>
  );
}