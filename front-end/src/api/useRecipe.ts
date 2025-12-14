import { number } from "zod";
import { baseUrl } from "./baseUrl";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    credentials: 'include'
});
const fetchRecipes = async ()=>{
    const response = await fetch(`${baseUrl}/api/recipe-product`, {
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

export const useRecipes = () =>{
    return useQuery({
        queryKey: ['recipes'],
        queryFn: fetchRecipes,
    })
}


const storeRecipe = async (payload: any)=>{
    // console.log(payload);
    const response = await fetch(`${baseUrl}/api/recipe-product`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
        },
        body : JSON.stringify(payload),
    });
    
    if(!response.ok){
        throw new Error('Network response is not OK');
    }

    return response.json();
}

export const useStoreRecipe = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: storeRecipe,
        onSuccess: ()=>{
            queryClient.invalidateQueries(['recipe']);
        }
    });
};

const deleteRecipe = async (id: number) => {
    const response = await fetch(`${baseUrl}/api/recipe-product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries(['recipes']);
        }
    });
}


const showRecipe = async (id: number) => {
    const response = await fetch(`${baseUrl}/api/recipe-product/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export const useShowRecipe = (id: number) => {
    return useQuery({
        queryKey: ['recipe', id],
        queryFn: () => showRecipe(id),
        enabled: !!id, // Only run if id is truthy
    });
};


const updateRecipe = async({ id, data }: { id: number, data: any })=>{

    console.log("Received : ", id,data);
    const response = await fetch(`${baseUrl}/api/recipe-product/${id}`,{
        method: 'POST',
        credentials: 'include',
        headers:{
            'Accept' : 'application/json',
            'Content-Type': "application/json"
        },
        body:JSON.stringify(data),
    });
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const useUpdateRecipe = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRecipe,
        onSuccess: ()=>{
            queryClient.invalidateQueries(['recipes']);
        }
    });
}
