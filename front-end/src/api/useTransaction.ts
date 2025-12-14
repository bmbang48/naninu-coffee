import { baseUrl } from "./baseUrl";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";


const storeTransaction = async (payload: any) => {
    await fetch ('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include'
    });
    console.log("payload dikirim", JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${baseUrl}/api/transactions`, payload, {
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
        },
    });
    return response.data;
}

export const useStoreTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: storeTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(["transactions"]);
        }
    });
};


const fetchTransaction = async () =>{
    const response = await fetch(`${baseUrl}/api/transactions`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept' : 'application/json',
        }
    });

    if(!response.ok) {
        throw new Error('Network response was not ok');
    }

    const json = await response.json();
    return json.data.data;
    
}

export const useTransactions = () =>{
    return useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransaction,
    })
}

const deleteTransaction = async (id:number) =>{
  const response = await fetch(`${baseUrl}/api/transactions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers:{
      'Accept': 'application/json',
    }
  });

  if(!response.ok){
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const useDeleteTransaction = () =>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: ()=>{
      queryClient.invalidateQueries(['transactions']);
    }
  });
};