import { useState } from "react";
import { Card, CardContent, Grid } from "@mui/material";
import { Button,TextField } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Container} from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const categories = ["Food", "Transport", "Entertainment", "Bills", "Other"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: "", date: "", description: "", category: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTransaction = () => {
    if (!form.amount || !form.date || !form.description || !form.category) return;
    setTransactions([...transactions, { ...form, id: Date.now() }]);
    setForm({ amount: "", date: "", description: "", category: "" });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const monthlyExpenses = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const categoryExpenses = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const chartData = Object.keys(monthlyExpenses).map((month) => ({
    name: month,
    amount: monthlyExpenses[month],
  }));

  const pieData = Object.keys(categoryExpenses).map((category, index) => ({
    name: category,
    value: categoryExpenses[category],
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Container fixed>

    <div className="p-4 max-w-xl mx-auto " >
      <h1 className="text-2xl font-bold mb-4">Personal Finance Tracker</h1>
      <Card>
        <CardContent className="p-4 space-y-2">

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
        <Grid item xs={6}>
        <TextField
          id="outlined-password-input"
          label="Amount"
          type="text"
          autoComplete="current-password" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" /><br/>
                 </Grid>
                 <Grid item xs={6}>
                  <TextField
          id="outlined-password-input"
          autoComplete="current-password" name="date" type="date" value={form.date} onChange={handleChange} /><br/>
               </Grid>
               <Grid item xs={6}>
                 <TextField
          id="outlined-password-input"
          label="Description"
          type="text"
          autoComplete="current-password" name="description" value={form.description} onChange={handleChange} placeholder="Description" /><br/>
          </Grid>
          <Grid item xs={6}>
          <select name="category" value={form.category} onChange={handleChange} style={{    padding:" 3%", fontSize:" 14px"}} className="border  p-2 w-full">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          </Grid>
          <Grid item xs={6}>
          <Button variant="contained" onClick={addTransaction}>Add Transaction</Button>
          </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:"50px"}}>
      <TableContainer>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
          <TableRow>
      
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        {transactions.map((t) => (
       
           <TableBody key={t.id}>
              <TableCell align="right"> ${t.amount}</TableCell>
            <TableCell align="right">{t.date}</TableCell>
            <TableCell align="right">{t.description} </TableCell>
            <TableCell align="right">{t.category}</TableCell>
            <TableCell align="right"> <Button variant="contained" onClick={() => deleteTransaction(t.id)} >Delete</Button></TableCell>
           </TableBody>
        ))}
        </Table>
     </TableContainer>
        </Grid>
      <div className="mt-6">
        <h2 className="text-xl font-bold" style={{marginTop:"50px"}}>Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold">Category Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    </Container>
  );
}
