import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function SIPCalculator() {
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  const calculateSIP = () => {
    if (!validatePositiveNumber(sipMonthly, 0) || !validateRate(sipRate) || !validateYears(sipYears)) {
      return { futureValue: 0, invested: 0, returns: 0, yearlyData: [] };
    }
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipMonthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = sipMonthly * months;
    const returns = futureValue - invested;
    
    const yearlyData = [];
    for (let year = 1; year <= sipYears; year++) {
      const monthsElapsed = year * 12;
      const value = sipMonthly * (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate));
      const investedAmount = sipMonthly * monthsElapsed;
      yearlyData.push({
        year: `Year ${year}`,
        invested: Math.round(investedAmount),
        value: Math.round(value),
        returns: Math.round(value - investedAmount),
      });
    }
    
    return { futureValue, invested, returns, yearlyData };
  };

  const sipResult = calculateSIP();

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
            <Label>Monthly Investment (₹)</Label>
            <Input
              type="number"
              value={sipMonthly || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 10000000)) {
                  setSipMonthly(num);
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
              value={sipRate || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateRate(num)) {
                  setSipRate(num);
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
            <Label>Time Period (Years)</Label>
            <Input
              type="number"
              value={sipYears || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setSipYears(num);
                }
              }}
              min="1"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Total Investment</p>
            <p className="text-2xl font-bold">{formatCurrency(sipResult.invested)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated Returns</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(sipResult.returns)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Future Value</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(sipResult.futureValue)}</p>
          </div>
        </div>
      </div>
      
      {sipResult.yearlyData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Growth Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sipResult.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="invested" stroke="#8884d8" name="Invested Amount" />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Future Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
