import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function FDCalculator() {
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(6.5);
  const [fdYears, setFdYears] = useState(5);

  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  const calculateFD = () => {
    if (!validatePositiveNumber(fdPrincipal, 0) || !validateRate(fdRate) || !validateYears(fdYears)) {
      return { maturityAmount: 0, interest: 0 };
    }
    const amount = fdPrincipal * Math.pow(1 + fdRate / 100, fdYears);
    const interest = amount - fdPrincipal;
    return { maturityAmount: amount, interest };
  };

  const fdResult = calculateFD();

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
            <Label>Principal Amount (₹)</Label>
            <Input
              type="number"
              value={fdPrincipal || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 100000000)) {
                  setFdPrincipal(num);
                }
              }}
              min="1"
              max="100000000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹10,00,00,000</p>
          </div>
          <div>
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              type="number"
              value={fdRate || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateRate(num)) {
                  setFdRate(num);
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
              value={fdYears || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setFdYears(num);
                }
              }}
              min="1"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Principal Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(fdPrincipal)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interest Earned</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(fdResult.interest)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Maturity Amount</p>
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(fdResult.maturityAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
