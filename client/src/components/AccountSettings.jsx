import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AccountSettings = () => {
  const [accountInfo, setAccountInfo] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = response.data;
        setAccountInfo(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1 className="text-lg"> Name : {accountInfo.name ? accountInfo.name[0].toUpperCase() + accountInfo.name.slice(1) : ""}</h1>
      <h1 className="text-lg">Email : {accountInfo.email}</h1>
    </div>
  );
};

export default AccountSettings;
