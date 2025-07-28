import { useEffect, useState } from "react";
import HLBackendV1Api from '../utils/http/api';

function OpenPositionTable() {

    const [userBets, setUserBets] = useState();

    const getPendingUserBets = async() => {
        try {
            await HLBackendV1Api.get(`${process.env.BACKEND_API_URL}/betting-management/user-transaction-history?status=pending&skip=0&take=20`)
            .then((response) => { 
                setUserBets(response.data)
                
            });
        } catch (error) {
            console.log(error)
        }
    }

  useEffect(() => {

    let intId = setInterval(() => {
      getPendingUserBets();
    },2000)
    

    return () => {
        clearInterval(intId)
    }
  },[])
    

    return <>
        <div>Open - { JSON.stringify(userBets) }</div>
    </>
}

export default OpenPositionTable;