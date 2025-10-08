import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);

  // Debounced values
  const [debouncedAmount, setDebouncedAmount] = useState(loanAmount);
  const [debouncedRate, setDebouncedRate] = useState(loanRate);
  const [debouncedYears, setDebouncedYears] = useState(loanYears);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(loanAmount);
      setDebouncedRate(loanRate);
      setDebouncedYears(loanYears);
    }, 300);

    return () => clearTimeout(timer);
  }, [loanAmount, loanRate, loanYears]);

  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const validateYears = (years: number) => {
    return !isNaN(years) && years > 0 && years <= 50;
  };

  const calculateEMI = () => {
    if (!validatePositiveNumber(debouncedAmount, 0) || !validateRate(debouncedRate) || !validateYears(debouncedYears)) {
      return { emi: 0, totalAmount: 0, totalInterest: 0 };
    }
    const monthlyRate = debouncedRate / 12 / 100;
    const months = debouncedYears * 12;
    const emi = debouncedAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - debouncedAmount;
    return { emi, totalAmount, totalInterest };
  };

  const emiResult = useMemo(() => calculateEMI(), [debouncedAmount, debouncedRate, debouncedYears]);

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
            <Label>Loan Amount (₹)</Label>
            <Input
              type="number"
              value={loanAmount || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 1000000000)) {
                  setLoanAmount(num);
                }
              }}
              min="1"
              max="1000000000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹100,00,00,000</p>
          </div>
          <div>
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              type="number"
              value={loanRate || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateRate(num)) {
                  setLoanRate(num);
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
            <Label>Loan Tenure (Years)</Label>
            <Input
              type="number"
              value={loanYears || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateYears(num)) {
                  setLoanYears(num);
                }
              }}
              min="1"
              max="50"
              placeholder="Enter years"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 1 - 50 years</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Monthly EMI</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(emiResult.emi)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Interest</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(emiResult.totalInterest)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(emiResult.totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}