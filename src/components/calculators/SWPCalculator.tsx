import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function SWPCalculator() {
  const [swpCorpus, setSwpCorpus] = useState(5000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(40000);
  const [swpRate, setSwpRate] = useState(8);
  const [swpYears, setSwpYears] = useState(20);

  // Debounced values
  const [debouncedCorpus, setDebouncedCorpus] = useState(swpCorpus);
  const [debouncedWithdrawal, setDebouncedWithdrawal] = useState(swpWithdrawal);
  const [debouncedRate, setDebouncedRate] = useState(swpRate);
  const [debouncedYears, setDebouncedYears] = useState(swpYears);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCorpus(swpCorpus);
      setDebouncedWithdrawal(swpWithdrawal);
      setDebouncedRate(swpRate);
      setDebouncedYears(swpYears);
    }, 300);

    return () => clearTimeout(timer);
  }, [swpCorpus, swpWithdrawal, swpRate, swpYears]);

  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  const calculateSWP = () => {
    if (!validatePositiveNumber(debouncedCorpus, 0) || !validatePositiveNumber(debouncedWithdrawal, 0) || 
        !validateRate(debouncedRate) || !validateYears(debouncedYears)) {
      return { finalBalance: 0, totalWithdrawn: 0, yearlyData: [] };
    }
    const monthlyRate = debouncedRate / 12 / 100;
    let balance = debouncedCorpus;
    let totalWithdrawn = 0;
    
    const yearlyData = [];
    for (let year = 1; year <= debouncedYears; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) - debouncedWithdrawal;
        totalWithdrawn += debouncedWithdrawal;
        if (balance <= 0) {
          balance = 0;
          break;
        }
      }
      yearlyData.push({
        year: `Year ${year}`,
        balance: Math.round(balance),
        withdrawn: Math.round(totalWithdrawn),
      });
      if (balance <= 0) break;
    }
    
    return { finalBalance: balance, totalWithdrawn, yearlyData };
  };

  const swpResult = useMemo(() => calculateSWP(), [debouncedCorpus, debouncedWithdrawal, debouncedRate, debouncedYears]);

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
            <Label>Total Corpus (₹)</Label>
            <Input
              type="number"
              value={swpCorpus || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 10000000000)) {
                  setSwpCorpus(num);
                }
              }}
              min="1"
              max="10000000000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,000,00,00,000</p>
          </div>
          <div>
            <Label>Monthly Withdrawal (₹)</Label>
            <Input
              type="number"
              value={swpWithdrawal || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 10000000)) {
                  setSwpWithdrawal(num);
                }
              }}
              min="1"
              max="10000000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,00,00,000</p>
          </div>
          <div>
            <Label>Expected Return Rate (% p.a.)</Label>
            <Input
              type="number"
              value={swpRate || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateRate(num)) {
                  setSwpRate(num);
                }
              }}
              min="0"
              max="100"
              step="0.1"
              placeholder="Enter rate"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 0% - 100%</p>
          </div>
          <div>
            <Label>Withdrawal Period (Years)</Label>
            <Input
              type="number"
              value={swpYears || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setSwpYears(num);
                }
              }}
              min="1"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Initial Corpus</p>
            <p className="text-2xl font-bold">{formatCurrency(swpCorpus)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Withdrawn</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(swpResult.totalWithdrawn)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Final Balance</p>
            <p className="text-3xl font-bold text-teal-600">{formatCurrency(swpResult.finalBalance)}</p>
          </div>
        </div>
      </div>
      
      {swpResult.yearlyData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Balance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={swpResult.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#14b8a6" name="Remaining Balance" />
              <Line type="monotone" dataKey="withdrawn" stroke="#f97316" name="Total Withdrawn" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}