import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);

  const validateAge = (age: number) => {
    return !isNaN(age) && age >= 18 && age <= 100;
  };

  const validatePositiveNumber = (value: number, min: number = 0) => {
    return !isNaN(value) && value > min;
  };

  const validateRate = (rate: number) => {
    return !isNaN(rate) && rate >= 0 && rate <= 100;
  };

  const calculateRetirement = () => {
    if (!validateAge(currentAge) || !validateAge(retirementAge) || retirementAge <= currentAge || 
        !validatePositiveNumber(monthlyExpense, 0) || !validateRate(inflation)) {
      return { corpusNeeded: 0, futureExpense: 0, sipNeeded: 0, ageData: [] };
    }
    const yearsToRetirement = retirementAge - currentAge;
    const futureExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const yearsInRetirement = 25;
    const corpusNeeded = futureExpense * 12 * yearsInRetirement;
    
    const monthlyRate = 12 / 12 / 100;
    const months = yearsToRetirement * 12;
    const sipNeeded = corpusNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const ageData = [];
    for (let age = currentAge; age <= retirementAge; age += 5) {
      const yearsFromNow = age - currentAge;
      const expenseAtAge = monthlyExpense * Math.pow(1 + inflation / 100, yearsFromNow);
      ageData.push({
        age: `Age ${age}`,
        monthlyExpense: Math.round(expenseAtAge),
      });
    }
    
    return { corpusNeeded, futureExpense, sipNeeded, ageData };
  };

  const retirementResult = calculateRetirement();

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
            <Label>Current Age</Label>
            <Input
              type="number"
              value={currentAge || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || validateAge(num)) {
                  setCurrentAge(num);
                }
              }}
              min="18"
              max="100"
              placeholder="Enter age"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 18 - 100 years</p>
          </div>
          <div>
            <Label>Retirement Age</Label>
            <Input
              type="number"
              value={retirementAge || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validateAge(num) && num > currentAge)) {
                  setRetirementAge(num);
                }
              }}
              min={currentAge + 1}
              max="100"
              placeholder="Enter age"
            />
            <p className="text-xs text-muted-foreground mt-1">Must be greater than current age</p>
          </div>
          <div>
            <Label>Current Monthly Expense (₹)</Label>
            <Input
              type="number"
              value={monthlyExpense || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validatePositiveNumber(num, 0) && num <= 10000000)) {
                  setMonthlyExpense(num);
                }
              }}
              min="1"
              max="10000000"
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground mt-1">Min: ₹1, Max: ₹1,00,00,000</p>
          </div>
          <div>
            <Label>Expected Inflation (%)</Label>
            <Input
              type="number"
              value={inflation || ""}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (e.target.value === "" || (validateRate(num) && num <= 50)) {
                  setInflation(num);
                }
              }}
              min="0"
              max="50"
              step="0.1"
              placeholder="Enter rate"
            />
            <p className="text-xs text-muted-foreground mt-1">Range: 0% - 50%</p>
          </div>
        </div>
        <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Years to Retirement</p>
            <p className="text-2xl font-bold">{retirementAge - currentAge} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Future Monthly Expense</p>
            <p className="text-2xl font-bold">{formatCurrency(retirementResult.futureExpense)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Retirement Corpus Needed</p>
            <p className="text-3xl font-bold text-indigo-600">{formatCurrency(retirementResult.corpusNeeded)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly SIP Required</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(retirementResult.sipNeeded)}</p>
          </div>
        </div>
      </div>
      
      {retirementResult.ageData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Expense Projection by Age</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={retirementResult.ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="monthlyExpense" fill="#8884d8" name="Monthly Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
