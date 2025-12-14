import { useEffect, useState, useRef } from "react";
import { useStoreProduct,useUpdateProduct } from "../api/useProduct";
import { formatCurrency, unformatCurrency } from "./FormatCurrency";

interface Props{
  isActiveForm: boolean;
  setIsActiveForm: (isActiveForm: boolean) => void;
  formData?: {
    id: number | null;
    product_name: string;
    price: number;
    description: string;
    image: string |File | null;
  };
  mode: 'create' | 'edit';
}
const FormProduct = ({isActiveForm, setIsActiveForm, formData, mode}:props) => { 

  const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [localFormData, setLocalFormData] = useState({
      product_name: '',
      price:  0,
      description: '',
      image: null as File | null,
    });
    const [price, setPrice] = useState<number>(0);

    
    useEffect(()=>{
      if (mode === 'edit' && formData) {
        setLocalFormData({
          product_name: formData.product_name || '',
          description: formData.description || '',
          image: formData.image instanceof File ? formData.image : null, // Ensure image is a File or null  
        });
        setPrice(formData.price || 0);
    }else {
  setLocalFormData({
    product_name: '',
    description: '',
    image: null,
  });
  setPrice(0)
}
  }, [formData,mode]);

    const {mutate, isPending,isSuccess,isError} = useStoreProduct();
    const {mutate: updateProduct, isPending: updateIsPending, isSuccess: updateIsSuccess, isError: updateIsError, updateProductMutation} = useUpdateProduct();

    const handleSubmit = (e: React.FormEvent)=>{
      e.preventDefault();
      const data = new FormData();
      data.append('product_name', localFormData.product_name); 
      data.append('price', price.toString());
      data.append('description', localFormData.description);
      if (localFormData.image) {
        data.append('image', localFormData.image);
      }
      mutate(data);
      setLocalFormData({
        product_name: '',
        price: 0,
        description: '',
        image: null,
      });
      // setIsActiveForm(false);
      if(isActiveForm){
        setIsActiveForm(false);
      }
    };

    const handleSubmitUpdate = (e:  React.FormEvent)=>{
      e.preventDefault();
      if(!formData.id){
        console.error("No product ID provided for update.");
        return;
      }

      const data = new FormData();
      data.append('_method', 'PUT'); // Use PUT method for update
      data.append('product_name', localFormData.product_name);
      data.append('price', price.toString());
      data.append('description', localFormData.description); 
      if (localFormData.image) {
        data.append('image', localFormData.image);
      }

        console.log("Sending FormData:");
  

      updateProduct({id:formData.id, data});
      

      if(isActiveForm){
        setIsActiveForm(false);
        setLocalFormData({
        product_name: '',
        price: 0,
        description: '',
        image: null,
      });
      }
    }
  

  const handleCloseForm = () => {
    setIsActiveForm(false);
    setLocalFormData({
        product_name: '',
        price: 0,
        description: '',
        image: null,
      });

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  }
  useEffect(() => {
  console.log("localFormData RESET:", localFormData);
}, [localFormData]);
  
  return (
    <div className="form-product d-flex flex-column justify-content-center align-items-center">
      <p className="btn-x position-absolute top-0" onClick={handleCloseForm}>X</p>
      <form onSubmit={mode === 'edit' ? handleSubmitUpdate : handleSubmit} encType="multipart/form-data" >
        <div className="mb-3">
          <label htmlFor="productName" className="form-label fw-500">Product Name</label>
          <input type="text" className="form-control" id="productName" 
          value={localFormData.product_name}
          onChange={(e)=> setLocalFormData({...localFormData, product_name:e.target.value})} placeholder="Input product name" />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label fw-500">Price</label>
         <input
  type="text"
  className="form-control"
  value={price === 0 ? "" : formatCurrency(price)}
  onChange={(e) => {
    const numeric = unformatCurrency(e.target.value);
    setPrice(numeric);
  }}
/>

        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-500">Description</label>
          <textarea className="form-control" id="description" 
          value={localFormData.description}
          onChange={(e) => setLocalFormData({ ...localFormData, description: e.target.value })} placeholder="Detail product"></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label fw-500">Image</label>
          <input type="file" className="form-control" id="image"
          ref={fileInputRef}
          onChange={(e)=>setLocalFormData({...localFormData, image: e.target.files?.[0] || null})} />
        </div>
        <button type="submit" className="btn btn-success w-100">Submit</button>
      </form>
    </div>
  );
}

export default FormProduct;