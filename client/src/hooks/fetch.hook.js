import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

/**custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null
    })

    useEffect(()=>{
        if(!query) return;

        const fetchData = async ()=>{
            try {
                setData(prev => ({...prev, isLoading: true}))
                const {data, status} = await axios.get(`http://localhost:8080/api/${query}`)
                if(status === 200){
                    setData(prev => ({...prev, isLoading: false}))
                    setData(prev => ({...prev, apiData: data, status: status}))
                    console.log(data.username)
                }

                // setData(prev => ({...prev, isLoading: false}))
            } catch (err) {
                setData(prev => ({...prev, isLoading: false, serverError: err}))
            }
        }
        fetchData()
    }, [])

    return [getData, setData]
}