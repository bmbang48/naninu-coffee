import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "./baseUrl";
// React fetch


// fething products
const fetchProducts = async () => {
  const response = await fetch(`${baseUrl}/api/products`,{
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const useProducts = () => {  
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}


//Store Data
const storeProduct = async (data: FormData) => {
  console.log(data);
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept' : 'application/json',
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const useStoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation ({
    mutationFn: storeProduct,
    onSuccess: () =>{
      queryClient.invalidateQueries(['products']);
    }
  });
};

const deleteProduct = async (id:number) =>{
  const response = await fetch(`${baseUrl}/api/products/${id}`, {
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

export const useDeleteProduct = () =>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: ()=>{
      queryClient.invalidateQueries(['products']);
    }
  });
};

const updateProduct = async({id,data}:{id:number,data:FormData})=>{
  const response = await fetch(`${baseUrl}/api/products/${id}`,{
    method: 'POST',
    credentials: 'include',
    headers:{
      'Accept': 'application/json',
    },
    body:data,
  });
  if(!response.ok){
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const useUpdateProduct = ()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: ()=>{
      queryClient.invalidateQueries(['products']);
    }
  });
}