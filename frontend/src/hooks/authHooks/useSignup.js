import { useEffect,useState } from "react";
import axios from "../../utils/axios.config"


const useSignup = (url,formData) => {
   const [data, setData] = useState(null);
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState(null);

   useEffect(()=> {
      let isMounted = true;

      const signup = async()=> {
         try{
            const response = await axios.post(url,
                {
                body: formData.toString(),
                }
            );
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

      signup();

      return ()=>{
         isMounted = false;
      };   
   }, [url]);

   return {data,loading,error};
}

export default useSignup;