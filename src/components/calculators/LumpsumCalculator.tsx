import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function LumpsumCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const validatePositiveNumber = (value: number, min: number = 0, max: number = 100000000) => {
    return !isNaN(value) && value > min && value <= max;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  const calculateLumpsum = () => {
    if (!validatePositiveNumber(investment, 0) || !validateRate(rate) || !validateYears(years)) {
      return { futureValue: 0, returns: 0, yearlyData: [] };
    }

    const futureValue = investment * Math.pow(1 + rate / 100, years);
    const returns = futureValue - investment;

    const yearlyData = [];
    for (let year = 1; year <= years; year++) {
      const value = investment * Math.pow(1 + rate / 100, year);
      yearlyData.push({
        year: `Year ${year}`,
        value: Math.round(value),
        invested: investment,
      });
    }

    return { futureValue, returns, yearlyData };
  };

  const result = calculateLumpsum();

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
            <Label>Investment Amount (₹)</Label>
            <Input
              type="number"
              value={investment || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validatePositiveNumber(num, 0)) {
                  setInvestment(num);
                }
              }}
              min="1"
              max="100000000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹10,00,00,000</p>
          </div>
          <div>
            <Label>Expected Return Rate (% p.a.)</Label>
            <Input
              type="number"
              value={rate || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateRate(num)) {
                  setRate(num);
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
              value={years || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setYears(num);
                }
              }}
              min="1"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Investment Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(investment)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated Returns</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(result.returns)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Future Value</p>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(result.futureValue)}</p>
          </div>
        </div>
      </div>

      {result.yearlyData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Growth Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="invested" stroke="#8884d8" name="Invested Amount" />
              <Line type="monotone" dataKey="value" stroke="#10b981" name="Future Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
