import { useEffect,useState } from "react";
import axios from "../../utils/axios.config"

const useLogout = (url) => {
   const [data, setData] = useState(null);
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState(null);

   useEffect(()=> {
      let isMounted = true;

      const logout = async()=> {
         try{
            const response = await axios.get(url);
            if(isMounted) {
               setData (response.data);
               setLoading(false);
            }
         }
         catch(error) {
            if(isMounted) {
               setError (error);
               setLoading(false);
            }
         }
      };

      logout();

      return ()=>{
         isMounted = false;
      };   
   }, [url]);

   return {data,loading,error};
}

export default useLogout;