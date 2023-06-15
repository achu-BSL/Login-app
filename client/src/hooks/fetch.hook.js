import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper.js";

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

        const fetchData = async ()=>{
            try {
                setData(prev => ({...prev, isLoading: true}))
                const {username} = await getUsername()
                console.log(query)
                const {data, status} = !query ? await axios.get(`http://localhost:8080/api/user/${username}`) : await axios.get(`http://localhost:8080/api/${query}`)
                if(status === 200){
                    setData(prev => ({...prev, isLoading: false}))
                    setData(prev => ({...prev, apiData: data, status: status}))
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