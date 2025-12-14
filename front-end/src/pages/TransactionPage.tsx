import { useTransactions } from "../api/useTransaction";
import { useEffect, useState } from "react";
import { formatCurrency } from "../components/FormatCurrency";

const TransactionPage = () =>{

    const {data: transactions, isLoading: transactionsIsLoading, error: transactionsError} = useTransactions();

    
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(today);
    
    const handleChangeDate = (e)=>{
        setSelectedDate(e.target.value);
    }


    const filteredData = (transactions ?? []).filter((t)=>
                        selectedDate ? t.transaction_date === selectedDate : true
                );

    
    // console.log(filteredData)

    return (
        <>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1>Transaction Page</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-10 d-flex justify-content-end align-items-center">
                    Tanggal
                </div>
                <div className="col-md-2">
                    <input type="date" 
                    value={selectedDate} 
                    onChange={handleChangeDate}
                    id="date" 
                    className="form-control" 
                    max={today}/>
                </div>
            </div>
            <div className="row">
            <div className="col-12">

            { transactionsIsLoading &&  <p>Loading...</p>}
            { transactionsError && <p>Error Fetching Transactions</p>}
            { transactions && transactions.length === 0 && <p>No Transactions Found</p>}
            { transactions && transactions.length > 0 && (
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>No Pesanan</th>
                        <th>List Item</th>
                        <th>Jumlah Item</th>
                        <th>Tanggal</th>
                        <th>Subtotal</th>
                        <th>Discount</th>
                        <th>Pajak</th>
                        <th>Total Harga</th>
                        <th>Bayar</th>
                        <th>Kembalian</th>
                        <th>Opsi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((transaction, index) => (
                        <tr key = {transaction.id}>
                        <td>{index + 1}</td>
                        <td>{transaction.transaction_code}</td>
                        <td>{new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}</td>
                        <td>
                            {transaction.items.map((item: any, itemIndex: number) => (
                                <div key={itemIndex}>
                                    {item.quantity} x {item.product.product_name}
                                </div>
                            ))}
                            </td>
                        <td className="text-center">{transaction.items.reduce((sum,item) => sum + item.quantity,0)}</td>
                        <td className="text-end">{formatCurrency(transaction.items.reduce((sum,item) => sum + item.subtotal,0))}</td>
                        <td className="text-end">{formatCurrency(transaction.discount)}</td>
                        <td className="text-end">{formatCurrency(transaction.tax)}</td>
                        <td className="text-end">{formatCurrency(transaction.total_price)}</td>
                        <td className="text-end">{formatCurrency(transaction.pay)}</td>
                        <td className="text-end">{formatCurrency(transaction.change)}</td>
                        <td className="px-3 py-3">
                                    <button className="btn btn-warning btn-sm me-2" onClick={()=>handleEditCost(cost)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={()=>handleActiveConfirmDelete(cost.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                    </tr>
                    ))}
                    <tr className="fw-bold">
                        <td colSpan={4}></td>
                        <td className="text-center">
                            {
                                filteredData.reduce((total, transaction)=> {
                                    const subTotalPerTransaksi = transaction.items.reduce(
                                        (sum, item) => sum + item.quantity, 0
                                    );
                                    return total + subTotalPerTransaksi;
                                },0)
                            }
                        </td>
                        <td className="text-end">
                            {
                                formatCurrency(
                                filteredData.reduce((total, transaction)=> {
                                    const subTotalPerTransaksi = transaction.items.reduce(
                                        (sum, item) => sum + item.subtotal, 0
                                    );
                                    return total + subTotalPerTransaksi;
                                },0)
                            )
                            }
                        </td>

                        <td className="text-end">
                            {formatCurrency(filteredData.reduce((sum,item)=> sum + item.discount,0))}
                        </td>
                        <td className="text-end">
                            {formatCurrency(filteredData.reduce((sum,item)=> sum + item.tax,0))}
                        </td>
                        <td className="text-end">
                            {formatCurrency(filteredData.reduce((sum,item)=> sum + item.total_price,0))}
                        </td>
                    </tr>
                </tbody>
            </table>
            )}
                </div>
            </div>
        </div>
        </>
    )
}
export default TransactionPage;