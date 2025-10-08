import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function MutualFundCalculator() {
  const [mfInvestment, setMfInvestment] = useState(100000);
  const [mfRate, setMfRate] = useState(12);
  const [mfYears, setMfYears] = useState(10);
  const [mfType, setMfType] = useState<"lumpsum" | "sip">("lumpsum");

  // Debounced values
  const [debouncedInvestment, setDebouncedInvestment] = useState(mfInvestment);
  const [debouncedRate, setDebouncedRate] = useState(mfRate);
  const [debouncedYears, setDebouncedYears] = useState(mfYears);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInvestment(mfInvestment);
      setDebouncedRate(mfRate);
      setDebouncedYears(mfYears);
    }, 300);

    return () => clearTimeout(timer);
  }, [mfInvestment, mfRate, mfYears]);

  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  const calculateMutualFund = () => {
    if (!validatePositiveNumber(debouncedInvestment, 0) || !validateRate(debouncedRate) || !validateYears(debouncedYears)) {
      return { futureValue: 0, invested: 0, returns: 0, yearlyData: [] };
    }
    if (mfType === "lumpsum") {
      const futureValue = debouncedInvestment * Math.pow(1 + debouncedRate / 100, debouncedYears);
      const returns = futureValue - debouncedInvestment;
      
      const yearlyData = [];
      for (let year = 1; year <= debouncedYears; year++) {
        const value = debouncedInvestment * Math.pow(1 + debouncedRate / 100, year);
        yearlyData.push({
          year: `Year ${year}`,
          value: Math.round(value),
          invested: debouncedInvestment,
        });
      }
      
      return { futureValue, invested: debouncedInvestment, returns, yearlyData };
    } else {
      const monthlyRate = debouncedRate / 12 / 100;
      const months = debouncedYears * 12;
      const futureValue = debouncedInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const invested = debouncedInvestment * months;
      const returns = futureValue - invested;
      
      const yearlyData = [];
      for (let year = 1; year <= debouncedYears; year++) {
        const monthsElapsed = year * 12;
        const value = debouncedInvestment * (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate));
        const investedAmount = debouncedInvestment * monthsElapsed;
        yearlyData.push({
          year: `Year ${year}`,
          value: Math.round(value),
          invested: Math.round(investedAmount),
        });
      }
      
      return { futureValue, invested, returns, yearlyData };
    }
  };

  const mfResult = useMemo(() => calculateMutualFund(), [debouncedInvestment, debouncedRate, debouncedYears, mfType]);

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
            <Label>Investment Type</Label>
            <div className="flex gap-4 mt-2">
              <Button
                variant={mfType === "lumpsum" ? "default" : "outline"}
                onClick={() => setMfType("lumpsum")}
                className="flex-1"
              >
                Lumpsum
              </Button>
              <Button
                variant={mfType === "sip" ? "default" : "outline"}
                onClick={() => setMfType("sip")}
                className="flex-1"
              >
                SIP
              </Button>
            </div>
          </div>
          <div>
            <Label>{mfType === "lumpsum" ? "Investment Amount (₹)" : "Monthly Investment (₹)"}</Label>
            <Input
              type="number"
              value={mfInvestment || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 100000000)) {
                  setMfInvestment(num);
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
              value={mfRate || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateRate(num)) {
                  setMfRate(num);
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
            <Label>Investment Period (Years)</Label>
            <Input
              type="number"
              value={mfYears || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setMfYears(num);
                }
              }}
              min="1"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Total Investment</p>
            <p className="text-2xl font-bold">{formatCurrency(mfResult.invested)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated Returns</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(mfResult.returns)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Future Value</p>
            <p className="text-3xl font-bold text-violet-600">{formatCurrency(mfResult.futureValue)}</p>
          </div>
        </div>
      </div>
      
      {mfResult.yearlyData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Investment Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mfResult.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="invested" stroke="#8b5cf6" name="Invested Amount" />
              <Line type="monotone" dataKey="value" stroke="#d946ef" name="Future Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}