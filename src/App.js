// import { set } from 'mongoose';
// import './App.css';
// import {useEffect, useState} from 'react';
// //import { response } from 'express';

// function App() {
//   const [name,setname] = useState('');
//   const [datetime,setdatetime] = useState('');
//   const [description,setdescription] = useState('');
//   const [transactions,setTransactions] = useState([]);
//   useEffect(()=>{
//     getTransactions().then(setTransactions);
//   },[]);

//   async function getTransactions(){
//     const url = process.env.REACT_APP_API_URL+'/transaction';
//     const response = await fetch(url);
//     return await response.json();
//   }

//   function addNewTransaction(ev){
//     ev.preventDefault();
//     const url = process.env.REACT_APP_API_URL+'/transaction';
//     const price = name.split(' ')[0];
//     fetch(url,{
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         price,
//         name:name.substring(price.length+1),
//         description,
//         datetime,
//       })
//     }).then((response)=> {
//       response.json().then((json)=> {
//         setname('');
//         setdatetime('');
//         setdescription('');
//       console.log('result',json);
//     });
//   });
//   }
//   let balance = 0;
//   for(const Transaction of transactions){
//     balance += Transaction.price;
//   }

//   balance = balance.toFixed(2);
//   const fraction = balance.split('.')[1];
//   balance = balance.split('.')[0];

//   return (
//     <main>
//       <h1>${balance}<span>{fraction}</span></h1>
//       <form onSubmit={addNewTransaction}>
//         <div className="basic">
//           <input type="text" 
//             value={name}
//             onChange={(ev)=>setname(ev.target.value)}
//             placeholder={"+200 new phone"}/>
//           <input value={datetime}
//             onChange={(ev)=>setdatetime(ev.target.value)} 
//             type="datetime-local"/>
//         </div>
//         <div className="description">
//           <input type="text"
//             value={description}
//             onChange={(ev)=>setdescription(ev.target.value)} 
//           placeholder={"Description"}/>
//         </div>
//         <button type="submit">Add new transaction</button>
//         {transactions.length}
//       </form>
//       <div className="transactions">
//         {transactions.length > 0 && transactions.map((Transaction)=>(
//           <div className="transaction">
//           <div className="left">
//             <div className="name">{Transaction.name}</div>
//             <div className="description">{Transaction.description}</div>
//           </div>
//           <div className="right">
//             <div className={"price"+(Transaction.price<0 ? 'red' : 'green')}>
//               {Transaction.price}</div>
//             <div className="date">2024-09-22 21:05</div>
//           </div>
//         </div>
//           ))}
        
//       </div>
//     </main>
//   );
// }

// export default App;

import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transaction';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  async function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    
    const parts = name.split(' ');
    const price = parseFloat(parts[0]);
    const transactionName = parts.slice(1).join(' ');

    if (isNaN(price) || !transactionName || !description || !datetime) {
      alert('Please fill all fields correctly');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
          name: transactionName,
          description,
          datetime,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log('Transaction added:', json);

      setName('');
      setDatetime('');
      setDescription('');

      // Fetch updated transactions
      getTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  }

  const balance = transactions.reduce((acc, transaction) => acc + transaction.price, 0).toFixed(2);
  const [balanceWhole, balanceFraction] = balance.split('.');

  return (
    <div className="app-container">
      <h1>${balanceWhole}<span>.{balanceFraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"+200 new phone"}
          />
          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder={"Description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.map((transaction) => (
          <div className="transaction" key={transaction._id}>
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                {transaction.price.toFixed(2)}
              </div>
              <div className="date">{new Date(transaction.datetime).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;