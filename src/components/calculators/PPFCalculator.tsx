import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function PPFCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState(100000);
  const [years, setYears] = useState(15);
  const [rate] = useState(7.1); // Current PPF rate

  const validateYearlyInvestment = (value: number) => {
    return !isNaN(value) && value > 0 && value <= 150000;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years >= 15 && years <= 50;
  };

  const calculatePPF = () => {
    if (!validateYearlyInvestment(yearlyInvestment) || !validateYears(years)) {
      return { maturityAmount: 0, totalInvestment: 0, interest: 0, yearlyData: [] };
    }

    let balance = 0;
    const yearlyData = [];

    for (let year = 1; year <= years; year++) {
      balance = (balance + yearlyInvestment) * (1 + rate / 100);
      yearlyData.push({
        year: `Year ${year}`,
        balance: Math.round(balance),
        invested: yearlyInvestment * year,
      });
    }

    const totalInvestment = yearlyInvestment * years;
    const interest = balance - totalInvestment;

    return { maturityAmount: balance, totalInvestment, interest, yearlyData };
  };

  const result = calculatePPF();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Yearly Investment (₹)</Label>
            <Input
              type="number"
              value={yearlyInvestment || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYearlyInvestment(num)) {
                  setYearlyInvestment(num);
                }
              }}
              min="1"
              max="150000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,50,000 (Annual limit)</p>
          </div>
          <div>
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              type="number"
              value={rate}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Current PPF rate (fixed by Govt.)</p>
          </div>
          <div>
            <Label>Time Period (Years)</Label>
            <Input
              type="number"
              value={years || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setYears(num);
                }
              }}
              min="15"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum: 15 years (PPF lock-in period)</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Total Investment</p>
            <p className="text-2xl font-bold">{formatCurrency(result.totalInvestment)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interest Earned</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(result.interest)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Maturity Amount</p>
            <p className="text-3xl font-bold text-amber-600">{formatCurrency(result.maturityAmount)}</p>
          </div>
        </div>
      </div>

      {result.yearlyData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">PPF Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="invested" stroke="#f59e0b" name="Total Invested" />
              <Line type="monotone" dataKey="balance" stroke="#10b981" name="PPF Balance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
